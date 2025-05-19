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
  const ride = await db__.collection('rides').findOne({ _id: new ObjectId(rideId) })

  const now = new Date();
  const pickupTime = new Date(ride.pickupDateTime);
  const diffMs = pickupTime - now;

  // if (diffMs > 60 * 60 * 1000) {
  //   return res.status(403).json({ error: 'Too early to contact rider/driver' });
  // }
  // if (diffMs < -30 * 60 * 1000) {
  //   return res.status(403).json({ error: 'Ride has ended. Please call support for assistance.' });
  // }

  try {

    if (ride.twilio) {
      // const existingSession = await client.proxy.v1.services(proxySid)
      //   .sessions(ride.twilio.proxySessionSid)
      //   .fetch();
      // console.log('exisintg session: ', existingSession)
      // console.log('session exists!: ', ride.twilio)
      const proxyNumber = userType == 'driver' ? ride.twilio.driverProxyIdentifier : ride.twilio.riderProxyIdentifier
      return res.json({ proxyNumber });
    }

    const session = await client.proxy.v1.services(proxySid).sessions.create({
      uniqueName: `ride-${rideId}`,
      ttl: 1.5 * 60 * 60, // 1.5 hours
    })

    const transformPhone = (num) => {
      if (num[0] == '1') {
        return '+' + num
      } else return '+1' + num
    }

    const driver = await client.proxy.v1.services(proxySid)
      .sessions(session.sid)
      .participants
      .create({ friendlyName: 'Driver', identifier: transformPhone(ride.driver.phone) });

    const rider = await client.proxy.v1.services(proxySid)
      .sessions(session.sid)
      .participants
      .create({ friendlyName: 'Rider', identifier: transformPhone(ride.user.phone) });
    
    // Save session SID for future use
    await db__.collection('rides').updateOne(
      { _id: new ObjectId(rideId) },
      { $set: { twilio: { proxySessionSid: session.sid, driverProxyIdentifier: driver.proxyIdentifier, riderProxyIdentifier: rider.proxyIdentifier, driverSID: driver.sid, riderSID: rider.sid } } },
    )

    const proxyNumber = userType == 'driver' ? driver.proxyIdentifier : rider.proxyIdentifier
    return res.json({ proxyNumber });
  }
  catch (e) {
    console.log('twilio calling error: ', e)
  }
});

//testing via browser
router.get('/sms', async (req, res) => {
  console.log('sms test')
  const twiml = new MessagingResponse();
  twiml.message('Hi!');
  res.type('text/xml').send(twiml.toString());
});

router.post('/sms', async (req, res) => {

  const message = req.body.Body.toLowerCase()
  console.log('sms test, request body: ', message)
  console.log('sms test, request body: ', req.body.From.slice(2))

  // text stop/start to turn off/on sms messaging
  if (message == 'stop' || message == 'start') {
    console.log('stop!', message)
    let smsEnabled = message == 'stop' ? false : true
    try {
      let updatedUser = await db__.collection('users').updateOne({ phone: req.body.From.slice(2) }, { $set: { smsEnabled } }, { returnDocument: "after" });
    } catch (e) {
      console.log('receipt preferences error: ', e)
    }
    return
  }

  // console.log('io: ', io)
  let user = await db__.collection('users').findOne({ phone: req.body.From.slice(2) })

  let ride = user.activeRides[0]
  // console.log('active ride: ', ride)

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

  var io = req.app.get('socketio');

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
