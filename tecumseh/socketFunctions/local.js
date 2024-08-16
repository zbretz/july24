const { db__, db_locals } = require('../mongoConnection.js')
var ObjectId = require('mongodb').ObjectId;
const { notifyUser, notifyDriver, notifyAllDrivers } = require('../notify.js');

let stripe_public_key = process.env.STRIPE_PUBLIC_KEY
let stripe_private_key = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripe_private_key);
// const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // pc app test key
// const stripe = require('stripe')('sk_test_51Ov1U9JhmMKAiBpVczAh3RA7hEZfa4VRmOmyseADv5sY225uLcYlpfH4dYup6tMLkhC8YhUAt754dTmwNsLa23mo00P2T8WqN0'); // pc payments test key

requestLocalRide = async (io, rideRequest) => {

    console.log('Local ride requested:', rideRequest);

    let newRequest = await db__.collection('localRides').insertOne({ ...rideRequest })

    let user = await db__.collection('users').findOneAndUpdate(
        { _id: new ObjectId(String(rideRequest.user._id)) },
        { $set: { localRide: { ...rideRequest } } },
    )

    rideRequest = { ...rideRequest, _id: newRequest.insertedId }

    io.to('drivers').emit('local_ride_request', rideRequest);

    notifyAllDrivers('Local', rideRequest.pickupAddress, rideRequest.dropoffAddress, new Date(rideRequest.pickupDateTime))

}

acceptLocalRide = async (io, socket, rideRequest) => {
    console.log('Local ride accepted:', rideRequest);

    let rideUpdate = await db__.collection('localRides').updateOne(
        { _id: new ObjectId(String(rideRequest._id)), driver: null },
        { $set: { driver: rideRequest.driver } },
    )
    console.log('rides update: ', rideUpdate)

    //Driver already assigned to this ride
    if (rideUpdate.modifiedCount === 0) {
        console.log('ride already taken!')
        socket.emit('ride_taken', rideRequest._id)
    }

    else {
        let user_update = await db__.collection('users').findOneAndUpdate(
            { _id: new ObjectId(String(rideRequest.user._id)) },
            { $set: { localRide: rideRequest } }, //https://stackoverflow.com/a/10523963
            { upsert: true, returnDocument: "after" }
        )

        console.log('user update: ', user_update)

        db__.collection('drivers').updateOne(
            { _id: new ObjectId(String(rideRequest.driver._id)) },
            {
                $push: {
                    localRides: {
                        $each: [rideRequest],
                        $sort: { pickupDateTimeEpoch: 1 }
                    }
                },
            },
        )
    }

    io.to(rideRequest.user._id).emit('local_ride_accepted', rideRequest);
    io.to('drivers').emit('remove_local_ride', rideRequest);
}

completeLocalRide = async (io, rideRequest, callback) => {
    // console.log('Local ride completed:', rideRequest);

    try {
        db__.collection('users').updateOne(
            { _id: new ObjectId(String(rideRequest.user._id)) },
            { $set: { localRide: null } }, //https://stackoverflow.com/a/10523963
            { returnDocument: "after" }
        )
        db__.collection('drivers').updateOne(
            { _id: new ObjectId(String(rideRequest.driver._id)) },
            { $pull: { "localRides": { _id: rideRequest._id } } }, //https://stackoverflow.com/a/10523963
            { returnDocument: "after" }
        )
        db__.collection('localRides').updateOne(
            { _id: new ObjectId(String(rideRequest._id)) },
            { $set: { rideCompleted: true } },
        )

        // For collecting tips after payment
        // https://docs.stripe.com/payments/overcapture
        // let transfer_amount = (rideRequest.fare * 100)
        let { fare } = rideRequest
        let app_fee = fare * .1
        let payment_fees = .30 + fare * .029
        let transfer_amount = fare - app_fee - payment_fees
        transfer_amount = Math.floor(transfer_amount * 100)

        let driverStripeAccount = rideRequest.driver.stripe_account
        let stripe_transfers_enabled = rideRequest.driver.stripe_transfers_enabled

        if (stripe_transfers_enabled && !rideRequest.paymentSentToDriver) {
            const transfer = await stripe.transfers.create({
                amount: transfer_amount,
                currency: "usd",
                destination: driverStripeAccount//"{{CONNECTED_STRIPE_ACCOUNT_ID}}",
            });
            console.log('stripe transfer: ', transfer)
            await db__.collection('localRides').updateOne({ _id: new ObjectId(String(rideRequest._id)) }, { $set: { paymentSentToDriver: true } })
        }

        io.to(rideRequest.user._id).emit('local_ride_completed', rideRequest);

        callback()
    } catch (e) {
        console.log('payout error: ', e)
    }

};




module.exports = {
    requestLocalRide,
    acceptLocalRide,
    completeLocalRide
}