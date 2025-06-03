const { db__, uri } = require('../mongoConnection.js')
var ObjectId = require('mongodb').ObjectId;
const { notifyUser, notifyDriver, notifyAllDrivers } = require('../notify.js');
const { smsMessageUser, rideCheckIn, alertAdmin } = require("../sms.js");

let stripe_private_key = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripe_private_key);
// const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // pc app test key


requestDirectBooking = async (io, booking, callback) => {


    console.log('booking: ', booking)

    let ride = await db__.collection('directBookings').insertOne({ ...booking })
    // console.log('   RIDE:   ', ride)
    booking = { ...booking, _id: ride.insertedId }


    let user = await db__.collection('users').findOneAndUpdate(
        // { _id: new ObjectId(String(booking.user._id)) },
        { _id: new ObjectId(booking.user._id) },
        // { _id: booking.user._id },
        {
            $set: { directBooking: booking },
        },
        { upsert: true, returnDocument: "after" }
    )

    // let driver = await db__.coll ection('drivers').updateOne(
    //     { _id: new ObjectId(booking.driver._id) },
    //     { $set: { directBookings: booking } }, //https://stackoverflow.com/a/10523963
    //     { returnDocument: "after" }
    // )

      db__.collection('drivers').updateOne(
                { _id: new ObjectId(String(booking.driver._id)) },
                {
                    $push: {
                        directBookings: {
                            $each: [booking],
                            $sort: { pickupDateTimeEpoch: 1 }
                        }
                    },
                },
            )


    // console.log('callback data: ', ride.insertedId)
    // callback(ride.insertedId)
    callback('confirmed')

    io.to(booking.driver._id).emit('direct_booking_request', booking);



    // notifyAllDrivers('Scheduled', bookingRequest.pickupAddress, bookingRequest.dropoffAddress, new Date(bookingRequest.pickupDateTime), bookingRequest.preferredDrivers)
    // io.to('drivers').emit('request_scheduled_ride', bookingRequest);
};




module.exports = {
    requestDirectBooking
}