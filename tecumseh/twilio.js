const dotenv = require('dotenv')
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const proxySid = process.env.TWILIO_PROXY_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);
const router = require("express").Router();
const { MessagingResponse } = require('twilio').twiml;

const { db__ } = require('./mongoConnection.js')
var ObjectId = require('mongodb').ObjectId;




const express = require('express');
// Middleware to parse application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));
const { message } = require("./socketFunctions/schedule");





router.post('/create-proxy-session', async (req, res) => {


  const { rideId, userType } = req.body;
  console.log('ride id: ', rideId, userType)

  // return

  const ride = await db__.collection('rides').findOne({ _id: new ObjectId(rideId) })

  // console.log('ride: ', ride)

  // return

  // const now = new Date();
  // const pickupTime = new Date(ride.pickupDateTime);
  // const diffMs = pickupTime - now;

  // if (diffMs > 60 * 60 * 1000) {
  //   return res.status(403).json({ error: 'Too early to contact rider/driver' });
  // }

  if (ride.twilio) {
    // const existingSession = await client.proxy.v1.services(proxySid)
    //   .sessions(ride.twilio.proxySessionSid)
    //   .fetch();

    // console.log('exisintg session: ', existingSession)

    console.log('session exists!: ', ride.twilio)

    const proxyNumber = userType == 'driver' ? ride.twilio.driverProxyIdentifier : ride.twilio.riderProxyIdentifier


    // const participants = await client.proxy.v1.services(proxySid)
    //   .sessions(ride.twilio.proxySessionSid)
    //   .participants
    //   .list();

    // console.log('particiopants list: ', participants)

    return res.json({ proxyNumber });


  }

  const session = await client.proxy.v1.services(proxySid).sessions.create({
    uniqueName: `ride-${rideId}`,
    ttl: 2 * 60 * 60, // 2 hours
  })
  // console.log('session: ', session)
  console.log('new session')


  const transformPhone = (num) => {

    if (num[0] == '1') {
      return '+' + num
    } else return '+1' + num
  }

  const driver = await client.proxy.v1.services(proxySid)
    .sessions(session.sid)
    .participants
    .create({ friendlyName: 'Driver', identifier: transformPhone(ride.driver.phone) });

  // console.log('driver: ', driver)

  const rider = await client.proxy.v1.services(proxySid)
    .sessions(session.sid)
    .participants
    .create({ friendlyName: 'Rider', identifier: transformPhone(ride.user.phone) });

  // console.log('rider: ', rider)


  // Save session SID for future use
  await db__.collection('rides').updateOne(
    { _id: new ObjectId(rideId) },
    { $set: { twilio: { proxySessionSid: session.sid, driverProxyIdentifier: driver.proxyIdentifier, riderProxyIdentifier: rider.proxyIdentifier, driverSID: driver.sid, riderSID: rider.sid } } },
  )


  const proxyNumber = userType == 'driver' ? driver.proxyIdentifier : rider.proxyIdentifier


  return res.json({ proxyNumber });
});




//testing via browser
router.get('/sms', async (req, res) => {
  console.log('sms test')
  const twiml = new MessagingResponse();
  twiml.message('Hi!');
  res.type('text/xml').send(twiml.toString());
});



router.post('/sms', async (req, res) => {



  // const { rideId, userType } = req.body;
  console.log('sms test, request body: ', req.body.Body)
  console.log('sms test, request body: ', req.body.From.slice(2))
  // return res.json({ proxyNumber});
  // const twiml = new MessagingResponse();
  // twiml.message('Hi!');
  // res.type('text/xml').send(twiml.toString());




  var io = req.app.get('socketio');
  // console.log('io: ', io)
  let user = await db__.collection('users').findOne({ phone: req.body.From.slice(2) })



  let ride = user.activeRides[0]

  if (!ride) {
    const twiml = new MessagingResponse();
    twiml.message("Hi there.\n\nIt appears you don't have a ride scheduled.\n\nPlease contact support for assistance: +19175751955");
    res.type('text/xml').send(twiml.toString());
    return
  }

  if (!ride.driver) {
    const twiml = new MessagingResponse();
    twiml.message("Your driver hasn't been assigned yet, but we're working on it.\n\nPlease contact support for assistance: +19175751955");
    res.type('text/xml').send(twiml.toString());
    return
  }


  // test stop to turn off sms messaging

  console.log('active ride: ', ride)

  const messageData = {
    toDriver: true,
    userid: ride.user._id,
    driverid: ride.driver._id,
    rideid: ride._id,
    text: req.body.Body,
    createdAt: new Date()
  }

  io.to(ride.driver._id).emit('message', messageData);







  let driver_chat_persist = await db__.collection('drivers').findOneAndUpdate(
    { _id: new ObjectId(String(messageData.driverid)), "activeRides._id": (String(messageData.rideid)) },
    {
      $push: {
        "activeRides.$.chatLog": messageData
      },
      $set: {
        "activeRides.$.unreadMessageFromUser": true
      }
    },
    { returnDocument: 'after' }
  )

  let user_chat_persist = await db__.collection('users').findOneAndUpdate(
    { _id: new ObjectId(String(messageData.userid)), "activeRides._id": new ObjectId(String(messageData.rideid)) },
    {
      $push: {
        "activeRides.$.chatLog": messageData
      },
    },
    { returnDocument: 'after' }
  )

  let ride_chat_persist = await db__.collection('rides').findOneAndUpdate(
    { _id: new ObjectId(String(messageData.rideid)) },
    {
      $push: {
        chatLog: messageData
      },
    },
    { returnDocument: 'after' }
  )






});


module.exports = router;
