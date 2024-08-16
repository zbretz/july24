const dotenv = require('dotenv')
// dotenv.config({path : '../.env'})
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;
// const { Expo } = require('expo-server-sdk')

const { db__, db_locals } = require('./mongoConnection.js')


let onDemandActive = true
let live_versions = ['6.0.1', '6.1.0']

router.get('/populateData', async (req, res) => {

    let _id = req.query._id
    console.log('user _id: ', _id, typeof _id)

    try {

        //no logged-in user
        if (_id == 'null') {
            console.log('null')
            res.status(200).send({ user: null, onDemandActive, live_versions });
            return
        }


        let user = await db__.collection('users').findOne({ _id: new ObjectId(_id) })
        console.log('populate data user?: ', user)

        if (user) {
            res.status(200).send({ user, onDemandActive, live_versions });
        } else {
            res.status(200).send({ user: null, onDemandActive, live_versions });
        }


    } catch (e) {
        console.log('user populate data error: ', e)
    }


});




module.exports = router;


