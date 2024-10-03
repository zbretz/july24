const dotenv = require('dotenv')
dotenv.config({ path: '../.env' })

let stripe_public_key = process.env.STRIPE_PUBLIC_KEY
let stripe_private_key = process.env.STRIPE_PRIVATE_KEY

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const demoNumber = process.env.DEMO_NUMBER;

const client = require('twilio')(accountSid, authToken);

// const {app} = require('indexRefactored')
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;

const { Expo } = require('expo-server-sdk')
// const { smsRequestConfirmation, sendCode } = require("../sms.js");

const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // test key
// const stripe = require('stripe')(stripe_private_key);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const { db_locals, db__ } = require('../mongoConnection.js')


console.log('stripe private key: ', stripe_private_key)

router.get('/6100test', async (req, res) => {
    console.log('6100test')
    res.status(200).send('6100test');
});

router.get('/partnerData', async (req, res) => {
    let partner = req.query.partner
    partner = await db_locals.collection('partners').findOne({ name: partner })
    console.log('partner!!!!!: ', partner)
    res.status(200).send(JSON.stringify(partner));
});

router.post('/placeOrder', async (req, res) => {

    // console.log(req.body)

    let { user, basket, timeOfOrder } = req.body
    let orderNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);

    console.log('notify zach', user, basket, timeOfOrder, orderNumber)

    try {
        const order = await db_locals.collection('orders').insertOne({ phone: user.phone, userName: user.firstName + ' ' + user.lastName, partner: basket.partner, orderItems: basket.items, timeOfOrder: timeOfOrder, completed: false, orderNumber: orderNumber, pickupTime: basket.pickupTime })
        console.log('ooooorder: ', order)
        res.status(200).send(order);

        let io = req.app.get('socketio');

        let socketOrder =
        {
            "_id": order.insertedId,
            "phone": user.phone,
            "userName": user.firstName + ' ' + user.lastName,
            "partner": basket.partner,
            "orderItems": basket.items,
            "timeOfOrder": timeOfOrder,
            "completed": false,
            "orderNumber": orderNumber,
            "pickupTime": basket.pickupTime
        }

        notifyAdminLocals(basket.partner, socketOrder)
        io.in(basket.partner).emit('order_received', socketOrder)
        smsNotifyZach(JSON.stringify(socketOrder))

    } catch (e) {
        console.log('order error: ', e)
    }





});


router.post('/payment-sheet2', async (req, res) => {
    try {

        let user = JSON.parse(req.query.user)
        console.log('user: ', user)

        let price = Number(req.query.price).toFixed(2)
        price = Math.round(price * 100)
        console.log('price - paymentsheet2: ', price)

        let stripe_customer_id = user.stripe_customer_id//  'cus_Pqv42p6HqP2PlU'

        if (!stripe_customer_id) {

            customer = await stripe.customers.create({
                name: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                metadata: { userUUID: user.userUUID }
            })


            // customer = await stripe.customers.create({
            //     name: "test user"
            //     // name: `${active_ride.firstName} ${active_ride.lastName}`,
            //     // phone: active_ride.phone,
            //     // metadata: { userUUID: active_ride.userUUID }
            // })

            stripe_customer_id = customer.id

            await db__.collection('riders').findOneAndUpdate({ phone: user.phone }, { $set: { stripe_customer_id: stripe_customer_id } }, { returnDocument: "after" });
        }
        // else {
        //     console.log('stripe1')
        //     stripe_customer_id = user.stripe_customer_id
        // }


        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: stripe_customer_id },
            { apiVersion: '2023-08-16' }
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: 'usd',
            customer: stripe_customer_id,//'cus_PaPI1VLGHW6olo',//stripe_customer_id,
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            payment_method_types: ['card'],
        });

        // console.log("PI: ", paymentIntent)
        res.json({
            ephemeralKey: ephemeralKey.secret,
            customer: stripe_customer_id,//'cus_PaPI1VLGHW6olo',//stripe_customer_id,
            paymentIntent: paymentIntent.client_secret,
            publishableKey: stripe_public_key
            // publishableKey: 'pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT' // test key

        });

    } catch (e) {
        console.log('payment sheet error: ', e)
    }

})

router.post('/acknowledgeOrder', async (req, res) => {
    let orderId = req.body.orderId
    console.log('orderId: ', orderId)
    acknowledgeOrder = await db_locals.collection('orders').findOneAndUpdate({ _id: new ObjectId(orderId) }, { $set: { acknowledged: true } }, { returnDocument: "after" });
    // console.log('order acknowledged: ', acknowledgeOrder)
    // res.status(200).send('acknowledged');
});

router.post('/saveDateChanges', async (req, res) => {
    let partner = req.body.partner
    let dateArray = req.body.dateArray
    console.log('date array: ', dateArray, partner)
    dates_saved = await db_locals.collection('partners').findOneAndUpdate({ name: partner }, { $set: { deactivatedDates: dateArray } }, { returnDocument: "after" });
    console.log('dates saved: ', dates_saved)
    res.status(200).send(dates_saved);
});

router.get('/fetchDates', async (req, res) => {
    let partner = req.query.partner
    console.log('sdfsdfsdf: ', partner)
    partner = await db_locals.collection('partners').findOne({ name: partner});
    console.log('fetch date: ', partner)
    res.status(200).send(partner);
});

router.post('/orderComplete', async (req, res) => {
    let orderId = req.body.orderId
    console.log('orderId: ', orderId)
    completeOrder = await db_locals.collection('orders').findOneAndUpdate({ _id: new ObjectId(orderId) }, { $set: { completed: true } }, { returnDocument: "after" });
    console.log('complete order: ', completeOrder)
    res.status(200).send('complete');
    // res.status(200).send(JSON.stringify(rideRequest));
});

router.post('/cancelOrder', async (req, res) => {
    let orderId = req.body.orderId
    console.log('orderId: ', orderId)
    cancelOrder = await db_locals.collection('orders').findOneAndUpdate({ _id: new ObjectId(orderId) }, { $set: { canceled: true } }, { returnDocument: "after" });
    console.log('cancel order: ', cancelOrder)
    res.status(200).send('canceled');
    // res.status(200).send(JSON.stringify(rideRequest));
});

router.get('/orderHistory', async (req, res) => {
    let partner = req.query.partner
    let userPhone = req.query.userPhone
    console.log('user phone: ', typeof userPhone)
    let page = req.query.page || 1
    let pageSize = 10//2

    // console.log('partnerr: ', partner)
    // console.log('user: ', userPhone)

    let orders

    if (partner) {
        orders = await db_locals.collection('orders').find({ partner: partner })
            .limit(pageSize)
            .skip((page - 1) * pageSize)
            .sort({ _id: -1 })
            .toArray();
    } else {
        orders = await db_locals.collection('orders').find({ phone: userPhone }).sort({ _id: -1 }).toArray();
    }
    // console.log('all orders: ', orders)
    res.status(200).send(orders);

});

router.get('/openOrders', async (req, res) => {
    let partner = req.query.partner
    let orders = await db_locals.collection('orders').find({ partner: partner, completed: false, canceled: { $exists: false } }).sort({ _id: -1 }).toArray();
    // console.log('open orders fetch: ', orders)
    res.status(200).send(orders);
});

router.get('/saveExpoPushTokenLocals', async (req, res) => {
    let partner = req.query.partner
    let push_token = req.query.push_token
    console.log('partner and token: ', partner, push_token)
    completeOrder = await db_locals.collection('partners').findOneAndUpdate({ name: partner }, { $set: { pushToken: push_token } }, { returnDocument: "after" });
    console.log('complete order: ', completeOrder)
    // let orders = await db_locals.collection('orders').find({ partner: partner, completed: false }).sort({ _id: -1 }).toArray();
    // console.log('open orders fetch: ', orders)
    res.status(200).send(push_token);

});

let expo = new Expo();

const notifyAdminLocals = async (partner, order) => {

    partner = await db_locals.collection('partners').findOne({ name: partner })
    console.log('partner: ', partner)
    console.log('orderrrrrrr: ', order)

    let itemNames = order.orderItems.map(item => item.name).join(", ")

    console.log('item names: ', itemNames)

    try {
        let messageAdmin = {
            to: partner.pushToken,
            sound: 'default',
            title: 'New Order',
            body: `Order: ${itemNames}`,
            data: { message: null },
        }
        if (partner.pushToken) {
            let sendNotification = await expo.sendPushNotificationsAsync([messageAdmin]);
            let receipts = await expo.getPushNotificationReceiptsAsync(sendNotification);
            console.log('receipts: ', receipts)
        } else {
            // smsNotifyAdmin()
        }
    } catch (e) {
        console.log('push notification error: ', e)
    }
}

const smsNotifyZach = (order) => {
    return client.messages
        .create({
            body:
                `New locals order:\n${order}`,
            from: phoneNumber,
            to: demoNumber
        })
        .then(message => console.log('sms sent: ', message.sid))
        .catch(e => {
            console.log('caught error!: ', e)
        });
}



module.exports = router;


