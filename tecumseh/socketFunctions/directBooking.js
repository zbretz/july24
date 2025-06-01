const { db__, uri } = require('../mongoConnection.js')
var ObjectId = require('mongodb').ObjectId;
const { notifyUser, notifyDriver, notifyAllDrivers } = require('../notify.js');
const { smsMessageUser, rideCheckIn, alertAdmin } = require("../sms.js");

let stripe_private_key = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripe_private_key);
// const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // pc app test key


requestDirectBooking = async (io, bookingRequest, callback) => {


    console.log('bookingRequest: ', bookingRequest)

    // let ride = await db__.collection('directBookings').insertOne({ ...bookingRequest })
    // console.log('   RIDE:   ', ride)
    // bookingRequest = { ...bookingRequest, _id: ride.insertedId }


    // let user = await db__.collection('users').findOneAndUpdate(
    //     { _id: new ObjectId(String(bookingRequest.user._id)) },
    //     {
    //         $set: { directBooking: bookingRequest },
    //     },
    //     { upsert: true, returnDocument: "after" }
    // )

    // console.log('callback data: ', ride.insertedId)
    // callback(ride.insertedId)
    callback('confirmed')

    io.to(bookingRequest.driver._id).emit('direct_booking_request', bookingRequest);



    // notifyAllDrivers('Scheduled', bookingRequest.pickupAddress, bookingRequest.dropoffAddress, new Date(bookingRequest.pickupDateTime), bookingRequest.preferredDrivers)
    // io.to('drivers').emit('request_scheduled_ride', bookingRequest);
};




module.exports = {
    requestDirectBooking
}