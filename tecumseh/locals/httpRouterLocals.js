const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

let stripe_public_key = process.env.STRIPE_PUBLIC_KEY
let stripe_private_key = process.env.STRIPE_PRIVATE_KEY

// const {app} = require('indexRefactored')
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;

const { Expo } = require('expo-server-sdk')
// const { smsRequestConfirmation, sendCode } = require("../sms.js");

// const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // test key
const stripe = require('stripe')(stripe_private_key);
// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

const { db_locals, db__ } = require('../mongoConnection.js')


console.log('stripe private key: ', stripe_private_key)

router.get('/6100test', async (req, res) => {
    console.log('6100test')
    res.status(200).send('6100test');
});

router.post('/placeOrder', async (req, res) => {

    console.log(req.body)

    let { user, basket, timeOfOrder } = req.body
    let orderNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);

    console.log(user, basket, timeOfOrder, orderNumber)

    try {
        const order = await db_locals.collection('orders').insertOne({ phone: user.phone, userName: user.firstName + ' ' + user.lastName, partner: basket.partner, orderItems: basket.items, timeOfOrder: timeOfOrder, completed: false, orderNumber: orderNumber })
        console.log('order: ', order)
        res.status(200).send(order);

        let io = req.app.get('socketio');

        let socketOrder =
        {
            "phone": user.phone,
            "userName": user.firstName + ' ' + user.lastName,
            "partner": basket.partner,
            "orderItems": basket.items,
            "timeOfOrder": timeOfOrder,
            "completed": false,
            "orderNumber": orderNumber
        }

        notifyAdminLocals(basket.partner, socketOrder)
        io.in(basket.partner).emit('order_received', socketOrder)

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

router.post('/orderComplete', async (req, res) => {
    let orderId = req.body.orderId
    console.log('orderId: ', orderId)

    completeOrder = await db_locals.collection('orders').findOneAndUpdate({ _id: new ObjectId(orderId) }, { $set: { completed: true } }, { returnDocument: "after" });

    console.log('complete order: ', completeOrder)

    res.status(200).send('complete');
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

    let orders = await db_locals.collection('orders').find({ partner: partner, completed: false }).sort({ _id: -1 }).toArray();
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



// router.get('/sockettest', async (req, res) => {
//     console.log('test')
//     let io = req.app.get('socketio');

//     let order =
//       {
//         "_id": {
//           "$oid": "662ed683e1137fa23b6a3a6b"
//         },
//         "phone": "9175751955",
//         "userName": "Zee Bee",
//         "partner": "Clockwork",
//         "orderItem": {
//           "item": "Latest order",
//           "notes": "Make it yummy Make i t yummy Make it yumm t yummy Make it yummy Make it yummy",
//           "price": 13.99,
//           // "is_drink": false
//           "is_drink": {
//             type: "cold",
//             size: "20oz"
//           },
//         },
//         "timeOfOrder": "Sun Apr 28th 5:08 pm",
//         "completed": false,
//         "orderNumber": 283
//       }

//     io.emit('order_received', order)
// });


module.exports = router;


