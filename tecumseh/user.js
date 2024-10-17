const dotenv = require('dotenv')
// dotenv.config({path : '../.env'})
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;
// const { Expo } = require('expo-server-sdk')

const { db__, db_locals } = require('./mongoConnection.js')


let onDemandActive = true
let localsDisabled = false//['"Locals" is temporarily offline.', "We're resolving some bugs and are working to restore ordering ASAP!"]
let live_versions = ['6.3.1', '6.3.2']

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
            res.status(200).send({ user, onDemandActive, localsDisabled, live_versions });
        } else {
            res.status(200).send({ user: null, onDemandActive, localsDisabled, live_versions });
        }


    } catch (e) {
        console.log('user populate data error: ', e)
    }


});



router.post('/receiptPreferences', async (req, res) => {

    let _id = req.body.user._id
    let { email, autoReceipts } = req.body
    // console.log('user _id: ', _id, 'email: ', email, 'autoReceipts: ', autoReceipts)

    try {
        let updatedUser = await db__.collection('users').findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: { email, autoReceipts } }, { returnDocument: "after" });
        console.log('receipt user?: ', updatedUser)

        if (updatedUser) {
            res.status(200).send('ok');
        } else {
            res.status(200).send('fail');
        }

    } catch (e) {
        console.log('receipt preferences error: ', e)
    }

});




module.exports = router;


