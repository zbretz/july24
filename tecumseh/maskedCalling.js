const dotenv = require('dotenv')
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const proxySid = process.env.TWILIO_PROXY_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

const router = require("express").Router();

router.post('/create-proxy-session', async (req, res) => {
  // const { rideId } = req.body;

  const rideId = '2'
  let ride = {
    riderPhone: '+19175751955',
    driverPhone: '+14358000057',
    proxySessionSid: 'KC4b16f18300f463e89b4d625cc785085e'
  }

  // const ride = await db.getRideById(rideId);

  // const now = new Date();
  // const pickupTime = new Date(ride.pickupDateTime);
  // const diffMs = pickupTime - now;

  // if (diffMs > 60 * 60 * 1000) {
  //   return res.status(403).json({ error: 'Too early to contact rider/driver' });
  // }

  if (ride.proxySessionSid) {
    const existingSession = await client.proxy.v1.services(proxySid)
      .sessions(ride.proxySessionSid)
      .fetch();

      console.log('exisintg session: ', existingSession)

    // return res.json({ proxyNumber: existingSession.participants[0].proxyIdentifier });


    const participants = await client.proxy.v1.services(proxySid)
    .sessions(ride.proxySessionSid)
    .participants
    .list();

    console.log('particiopants list: ', participants)
  }

  const session = await client.proxy.v1.services(proxySid).sessions.create({
    uniqueName: `ride-${rideId}`,
    ttl: 2 * 60 * 60, // 2 hours
  })
    // .then(res => console.log('create session res: ', res));

  const driver = await client.proxy.v1.services(proxySid)
    .sessions(session.sid)
    .participants
    .create({ friendlyName: 'Driver', identifier: ride.driverPhone });

  console.log('driver: ', driver)

  const rider = await client.proxy.v1.services(proxySid)
    .sessions(session.sid)
    .participants
    .create({ friendlyName: 'Rider', identifier: ride.riderPhone });


    console.log('rider: ', rider)
  // Save session SID for future use
  // await db.updateRide(rideId, { proxySessionSid: session.sid });

  return res.json({ proxyNumber: driver.proxyIdentifier });
});


module.exports = router;
