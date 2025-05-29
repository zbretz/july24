const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

let stripe_public_key = process.env.STRIPE_PUBLIC_KEY
let stripe_private_key = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripe_private_key);
// const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // pc app test key

// const stripe = require('stripe')('sk_test_51Ov1U9JhmMKAiBpVczAh3RA7hEZfa4VRmOmyseADv5sY225uLcYlpfH4dYup6tMLkhC8YhUAt754dTmwNsLa23mo00P2T8WqN0'); // pc payments test key

// // const {app} = require('indexRefactored')
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;
// const { Expo } = require('expo-server-sdk')
// // const { smsRequestConfirmation, sendCode } = require("../sms.js");

const axios = require("axios");
const moment = require('moment-timezone');

moment.tz.setDefault('America/Denver');

const { db__, db_childcare } = require('./mongoConnection.js')


router.get('/test', async (req, res) => {


    try {
        console.log('test')
    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});


router.get('/validateAddress', async (req, res) => {

    let param = "address=2100+Canyons+Resort+D"//"address=1600+Amphitheatre+Parkway,+Mountain+View,+CA"
    let url = `https://maps.googleapis.com/maps/api/geocode/json?${param}&key=AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI`

    try {
        axios.get(url)
            .then(api => {
                console.log('api: ', api.data.results)
                if (api.data.results.length) res.status(200).send(true);
                else res.status(200).send(false);
            })
            .catch(e => {
                console.log('error: ', e)
                res.status(200).send(null);
            }
            )

    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});



router.get('/determineFare', async (req, res) => {

    let pickup = req.query.pickup.replaceAll(' ', '+')
    let dropoff = req.query.dropoff.replaceAll(' ', '+')
    let rideType = req.query.rideType
    let dateTime = req.query.dateTime

    console.log('ride type & totalPax: ', rideType, dropoff, pickup)

    console.log('date time: ', dateTime)
    let dt = moment(new Date(dateTime))
    // let hours = dt.hours()
    console.log(dt.hours() == 23 || dt.hours() < 5)
    let timeCharge = dt.hours() == 23 || dt.hours() < 5

    let combined_locations = pickup.toLowerCase() + dropoff.toLowerCase()

    let is_airport_ride = combined_locations.indexOf('slc') !== -1 || combined_locations.indexOf('airport') !== -1

    let distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${dropoff}&origins=${pickup}&units=imperial&key=AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI`

    let distance;

    let fareObj = {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0
    }

    try {
        axios.get(distanceMatrixUrl)
            .then(api => {
                distance = api.data.rows[0].elements[0].distance.text
                distance = distance.slice(0, distance.length - 3)
                console.log('distance: ', distance)
                let base_fare = 24 > 2.1 * distance ? 24 : 2.1 * distance

                if (distance > 40) base_fare = 2 * distance
                if (distance > 48) base_fare = 1.85 * distance

                base_fare = Math.round(base_fare)

                if (is_airport_ride) base_fare = base_fare > 63 ? base_fare : 63

                if (timeCharge) base_fare += 32

                fareObj['1'] = base_fare
                fareObj['2'] = base_fare + 18
                fareObj['3'] = base_fare + 30
                fareObj['4'] = base_fare + 45

                if (is_airport_ride) fareObj['4'] = 155

                if (distance < 25.1) {

                    if (distance > 10) base_fare += 18

                    fareObj['1'] = base_fare
                    fareObj['2'] = base_fare + 12
                    fareObj['3'] = base_fare + 24
                    fareObj['4'] = base_fare + 31
                }

                console.log('fare object: ', fareObj)

                res.status(200).send(fareObj);

            })
            .catch(e => {
                console.log('error: ', e)
                res.status(200).send(null);
            }
            )

    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});



router.post('/payment-sheet', async (req, res) => {



    const { charge, rideDetail } = req.body;
    console.log('charge: ', charge)
    console.log('query string charge: ', req.query.charge)
    console.log('query string ride: ', req.query.ride)


    //  rideDetail = JSON.parse(req.query.ride)
    console.log('ride: ', rideDetail)


    let ride_id = rideDetail._id

    let stripe_customer_id = rideDetail.user.stripe_customer_id //  'cus_SCNcJnuQuHOzuY'//

    let customer

    if (!stripe_customer_id) {
        const user = await db__.collection('users').findOne({ _id: new ObjectId(String(rideDetail.user._id)) });

        console.log('stripe customer id user: ', user)

        if (!user.stripe_customer_id) {
            console.log('stripe2')
            customer = await stripe.customers.create({
                name: `${rideDetail.user.firstName} ${rideDetail.user.lastName}`,
                phone: rideDetail.user.phone,
                metadata: { user_id: rideDetail.user._id }
            })

            stripe_customer_id = customer.id

            console.log('new stripe customer: ', customer)

            await db__.collection('users').findOneAndUpdate({ phone: rideDetail.user.phone }, { $set: { stripe_customer_id: stripe_customer_id } }, { returnDocument: "after" });
        } else {
            console.log('stripe1')
            stripe_customer_id = user.stripe_customer_id
        }


    } else {
        console.log('stripe customer exists', stripe_customer_id)
    }

    console.log('charge: ', charge)
    console.log('ride_id: ', ride_id)

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: stripe_customer_id },
        { apiVersion: '2023-08-16' }
    );

    let initIntent = {
        amount: charge * 100,
        currency: 'usd',
        customer: stripe_customer_id,
        payment_method_types: ['card'],
        ...(rideDetail.user.autoReceipts && rideDetail.user.email) && { receipt_email: rideDetail.user.email }     // Object.assign
    }

    const paymentIntent = await stripe.paymentIntents.create(initIntent);

    console.log("PI: ", paymentIntent)
    res.json({
        ephemeralKey: ephemeralKey.secret,
        customer: stripe_customer_id,
        paymentIntent: paymentIntent.client_secret,
        publishableKey: stripe_public_key
        // publishableKey: 'pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT' // test key

    });

});




router.post('/local-payment-sheet', async (req, res) => {

    let fare = req.query.fare
    console.log('fare: ', fare)
    // console.log('ride: ', JSON.parse(req.query.ride))
    // let rideDetail = JSON.parse(req.query.ride)

    // let rideDetail = JSON.parse(req.query.ride)
    // console.log('active ride: ', rideDetail)

    let user = JSON.parse(req.query.user)
    console.log('user: ', user)

    // let stripe_customer_id = 'cus_PaPI1VLGHW6olo'//rideDetail.stripe_customer_id
    let stripe_customer_id = user.stripe_customer_id
    let customer

    if (!stripe_customer_id) {
        // new ObjectId(String(rideRequest._id))

        user = await db__.collection('users').findOne({ _id: new ObjectId(user._id) });

        // user = await db__.collection('users').findOne({ _id: user._id});


        if (!user.stripe_customer_id) {
            console.log('stripe2 -- ', user)
            customer = await stripe.customers.create({
                name: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                metadata: { userUUID: user.userUUID }
            })

            stripe_customer_id = customer.id

            await db__.collection('users').findOneAndUpdate({ _id: new ObjectId(user._id) }, { $set: { stripe_customer_id: stripe_customer_id } }, { returnDocument: "after" });
        } else {
            console.log('stripe1')
            stripe_customer_id = user.stripe_customer_id
        }


    } else {
        console.log('stripe customer exists')
    }

    // 'cus_PaPI1VLGHW6olo'

    console.log('fare: ', fare)

    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: stripe_customer_id },
        { apiVersion: '2023-08-16' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.query.fare * 100,
        currency: 'usd',
        customer: stripe_customer_id,
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        payment_method_types: ['card'],
    });

    // console.log("PI: ", paymentIntent)
    res.json({
        ephemeralKey: ephemeralKey.secret,
        customer: stripe_customer_id,
        paymentIntent: paymentIntent.client_secret,
        publishableKey: stripe_public_key
        // publishableKey: 'pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT' // test key

    });

});


router.get('/rideHistory', async (req, res) => {

    let userId = req.query.userId
    console.log('RIDE HISTORY user id: ', userId)

    try {
        let rideHistory = await db__.collection('rides').find({ "user._id": userId, rideCompleted: true }).toArray()
        console.log('rideHistory: ', rideHistory)
        res.status(200).send(rideHistory)
    } catch (e) {
        console.log('ride history error: ', e)
    }

});

router.get('/bookings', async (req, res) => {
    console.log('childcare booking: ', req.body)

    try {
        bookings = await db_childcare.collection('bookings').find({ completed: false, canceled: false }).toArray();
        providers = await db_childcare.collection('providers').find().toArray();

        console.log('update ride: ', bookings, providers)
        res.status(200).send({ bookings, providers });
    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});

router.get('/fetchProviders', async (req, res) => {

    try {
        providers = await db_childcare.collection('providers').find().toArray();
        console.log('providers: ', providers)
        res.status(200).send(providers);
    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});


router.post('/assignProvider', async (req, res) => {
    console.log('provider assignemnt: ', req.body)
    let { booking_id, user_id, provider } = req.body

    try {
        let updateBooking = await db_childcare.collection('bookings').updateOne(
            { _id: new ObjectId(String(booking_id)) },
            { $set: { provider } },
        )

        let updateBookingOnUser = await db__.collection('users').updateOne(
            { _id: new ObjectId(String(user_id)), "childcareBookings._id": new ObjectId(String(booking_id)) },
            { $set: { "childcareBookings.$.provider": provider } }, //https://stackoverflow.com/a/10523963
            { returnDocument: "after" }
        )

        console.log('user booking: ', user)

        res.status(200).send(true);

    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});


router.post('/booking', async (req, res) => {
    console.log('childcare booking: ', req.body)
    let { newBooking } = req.body

    try {

        let createBooking = await db_childcare.collection('bookings').insertOne(newBooking)

        let addBookingToUser = await db__.collection('users').updateOne(
            { _id: new ObjectId(String(newBooking.user._id)) },
            { $push: { childcareBookings: newBooking }, },
            { returnDocument: 'after' }
        )

        // console.log('update ride: ', booking)
        res.status(200).send(true);
    } catch (e) {
        console.log('fetchchatlog error: ', e)
    }

});

router.delete('/booking', async (req, res) => {
    let { booking_id, user_id } = req.body
    try {
        let updateBooking = await db_childcare.collection('bookings').updateOne(
            { _id: new ObjectId(String(booking_id)) },
            { $set: { completed: true, canceled: true } },
        )
        let updateBookingOnUser = await db__.collection('users').updateOne(
            { _id: new ObjectId(String(user_id)) },
            { $pull: { "childcareBookings": { _id: new ObjectId(String(booking_id)) } } }, //https://stackoverflow.com/a/10523963
            { returnDocument: "after" }
        )
        res.status(200).send('ok');
    } catch (e) {
        console.log('driver push token save error: ', e)
        res.status(200).send(false);
    }
});

module.exports = router;


