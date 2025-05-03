const dotenv = require('dotenv')
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const proxySid = process.env.TWILIO_PROXY_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

const router = require("express").Router();

const { db__ } = require('./mongoConnection.js')
var ObjectId = require('mongodb').ObjectId;

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


  return res.json({ proxyNumber});
});


module.exports = router;
