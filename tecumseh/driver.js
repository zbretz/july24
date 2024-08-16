const dotenv = require('dotenv')
// dotenv.config({path : '../.env'})
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;
// const { Expo } = require('expo-server-sdk')

const { db__, db_locals } = require('./mongoConnection.js')

router.get('/populateData', async (req, res) => {

    let _id = req.query._id
    console.log('driver _id: ', _id)

    try {
        let driver = await db__.collection('drivers').findOne({ _id: new ObjectId(_id) })
        console.log('auth driver: ', driver)

        if (driver) {
            let newScheduledRides = await db__.collection('rides').find({ driver:null }).toArray()
            let newLocalRides = await db__.collection('localRides').find({ driver:null }).toArray()
            console.log('open rides: ', newScheduledRides, newLocalRides)
            res.status(200).send({driver, newScheduledRides, newLocalRides});
        } else {
            res.status(200).send(false);
        }


    } catch (e) {
        console.log('driver populate data error: ', e)
    }


});

router.get('/fetchDrivers', async (req, res) => {
    let userUUID = req.query.userUUID
    console.log('fetch drivers', userUUID)
    try {
        const drivers = await db__.collection('drivers').find({}).toArray();
        res.status(200).send(drivers);
    } catch (e) {
        console.log("db error fetching inital data: ", e)
    }
});



module.exports = router;


