const { db__, uri } = require('../mongoConnection.js')
var ObjectId = require('mongodb').ObjectId;
const { notifyUser, notifyDriver, notifyAllDrivers } = require('../notify.js');
const { smsMessageUser, rideCheckIn, alertAdmin } = require("../sms.js");

let stripe_private_key = process.env.STRIPE_PRIVATE_KEY
const stripe = require('stripe')(stripe_private_key);
// const stripe = require('stripe')('sk_test_51Nj9WRAUREUmtjLCN8G4QqEEVvYoPpWKX82iY5lDX3dZxnaOGDDhqkyVpIFgg63FvXaAE3FmZ1p0btPM9s1De3m200uOIKI70O'); // pc app test key
// const stripe = require('stripe')('sk_test_51Ov1U9JhmMKAiBpVczAh3RA7hEZfa4VRmOmyseADv5sY225uLcYlpfH4dYup6tMLkhC8YhUAt754dTmwNsLa23mo00P2T8WqN0'); // pc payments test key

console.log('agewnda start -- move this to separate module')
// const agenda = require('../rideMonitor');
console.log('agewnda start 2')

const Agenda = require('agenda');
const agenda = new Agenda({ db: { address: `${uri}agenda`, collection: 'jobs' } });


agenda.define('alert admin', async job => {
    const { rideId } = job.attrs.data;

    // const event = await Event.findById(eventId);
    // if (!event) return;

    alertAdmin()//include ride data for action by admin

    // console.log(`Sent reminder for event "${event.name}"`);
});


agenda.define('send initial reminder', async job => {
    const { rideId } = job.attrs.data;

    // const event = await Event.findById(eventId);
    // if (!event) return;

    rideCheckIn('+19175751955')


    const currentTime = new Date()
    const scheduleTime = new Date(currentTime.getTime() + 10 * 1000)
    agenda.schedule(scheduleTime, 'alert admin', { rideId: rideId, is_initial_reminder: false }).then(start => console.log('starting agenda'))


    // console.log(`Sent reminder for event "${event.name}"`);
});





agenda.start()

setReminder = async (rideDetail) => {


    // let ride = { insertedId: 1234 }

    console.log('test')

    const currentTime = new Date()
    const scheduleTime = new Date(currentTime.getTime() + 7 * 1000)

    // need control to not trigger if ride is coming up immediately (eg. no reminder needed if ride is in next 20 mins)

    agenda.schedule(scheduleTime, 'send initial reminder', { rideId: rideDetail._id, is_initial_reminder: true }).then(start => console.log('starting agenda'))

}

disableReminder = async (io, status) => {

    const { checkedIn, rideRequest } = status


    let driver = await db__.collection('drivers').updateOne(
        { _id: new ObjectId(String(rideRequest.driver._id)), "activeRides._id": rideRequest._id },
        { $set: { "activeRides.$.checkedIn": checkedIn } }, //https://stackoverflow.com/a/10523963
    )

    console.log('found driver: ', driver)

    db__.collection('rides').updateOne(
        { _id: new ObjectId(String(rideRequest._id)) },
        { $set: { checkedIn } },
    )




    let ride = { insertedId: 1234 }
    // agenda.cancel({ data: {rideId: ride.insertedId} })
    agenda.disable({ data: { rideId: ride.insertedId, is_initial_reminder: status.onTime } })

}




message = async (io, data) => {

    console.log('Received message:', data);

    let driver_chat_persist = await db__.collection('drivers').findOneAndUpdate(
        { _id: new ObjectId(String(data.driverid)), "activeRides._id": (String(data.rideid)) },
        {
            $push: {
                "activeRides.$.chatLog": data
            },
            $set: {
                "activeRides.$.unreadMessageFromUser": true
            }
        },
        { returnDocument: 'after' }
    )

    let user_chat_persist = await db__.collection('users').findOneAndUpdate(
        { _id: new ObjectId(String(data.userid)), "activeRides._id": new ObjectId(String(data.rideid)) },
        {
            $push: {
                "activeRides.$.chatLog": data
            },
        },
        { returnDocument: 'after' }
    )

    let ride_chat_persist = await db__.collection('rides').findOneAndUpdate(
        { _id: new ObjectId(String(data.rideid)) },
        {
            $push: {
                chatLog: data
            },
        },
        { returnDocument: 'after' }
    )

    let smsEnabled = user_chat_persist.smsEnabled

    // if user was created bwfore the property was automatically applied to user object
    if (!user_chat_persist.hasOwnProperty('smsEnabled')) {
        smsEnabled = true
        await db__.collection('users').updateOne(
            { _id: new ObjectId(String(data.userid)) },
            { $set: { smsEnabled } },
        )
    }

    let first_message_for_ride;
    if (ride_chat_persist.chatLog.length == 1) first_message_for_ride = true

    // only send to sms for immediate next ride
    let is_upcoming_ride;
    console.log('ride id: ', user_chat_persist.activeRides[0]._id)
    if (data.rideid == user_chat_persist.activeRides[0]._id) {
        is_upcoming_ride = true
    }

    // return

    if (data.toUser && smsEnabled && is_upcoming_ride) {
        smsMessageUser(user_chat_persist.phone, data.text, first_message_for_ride)
    }

    io.to(data.userid).to(data.driverid).emit('message', data);

    // if (data.toUser) {
    //     notifyUser({ ...data, type: 'message' })
    // } else {
    //     notifyDriver({ ...data, type: 'message' })
    // }

};


requestScheduledRide = async (io, rideRequest, callback) => {







    // console.log('preferred drivers: ', rideRequest.preferredDrivers)
    // return


    let ride = await db__.collection('rides').insertOne({ ...rideRequest })
    console.log('   RIDE:   ', ride)
    rideRequest = { ...rideRequest, _id: ride.insertedId }


    let user = await db__.collection('users').findOneAndUpdate(
        { _id: new ObjectId(String(rideRequest.user._id)) },
        {
            $push: {
                activeRides: {
                    $each: [rideRequest],
                    $sort: { pickupDateTimeEpoch: 1 }
                }
            },
        },
        { upsert: true, returnDocument: "after" }
    )

    console.log('all this users scheduled rides: ', user.activeRides)

    // IF WE WANT THE FUTURE RIDES LIST ON FRONTEND TO BE SORTED IMMEDIATELY (instead of on next db pull), WE CAN SEND THIS WHOLE ACTIVERIDES LIST (WHICH IS SORTED BY DB) TO FRONTEND AND REPLACE THE ACTIVERIDES OBJECT
    // WE CAN DO THAT VIA THE CALLBACK

    console.log('callback data: ', ride.insertedId)
    callback(ride.insertedId)
    // callback() for testing
    notifyAllDrivers('Scheduled', rideRequest.pickupAddress, rideRequest.dropoffAddress, new Date(rideRequest.pickupDateTime), rideRequest.preferredDrivers)
    io.to('drivers').emit('request_scheduled_ride', rideRequest);
};



acceptScheduledRide = async (io, rideRequest) => {

    console.log('Scheduled ride accepted:', rideRequest);

    let rideUpdate = await db__.collection('rides').updateOne(
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
            { _id: new ObjectId(String(rideRequest.user._id)), "activeRides._id": new ObjectId(String(rideRequest._id)) },
            { $set: { "activeRides.$.driver": rideRequest.driver } }, //https://stackoverflow.com/a/10523963
            { upsert: true, returnDocument: "after" }
        )

        console.log('user update: ', user_update)


        db__.collection('drivers').updateOne(
            { _id: new ObjectId(String(rideRequest.driver._id)) },
            {
                $push: {
                    activeRides: {
                        $each: [rideRequest],
                        $sort: { pickupDateTimeEpoch: 1 }
                    }
                },
            },
        )

        io.to(rideRequest.user._id).emit('scheduled_ride_accepted', rideRequest);
        io.to('drivers').emit('remove_scheduled_ride', rideRequest);


    }

};



enRouteScheduledRide = async (io, rideRequest) => {

    console.log('en route')

    console.log('en route ride request: ', rideRequest)

    let user = await db__.collection('users').updateOne(
        { _id: new ObjectId(String(rideRequest.user._id)), "activeRides._id": new ObjectId(String(rideRequest._id)) },
        { $set: { "activeRides.$.enRoute": true } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )

    console.log('found user: ', user)

    let driver = await db__.collection('drivers').updateOne(
        { _id: new ObjectId(String(rideRequest.driver._id)), "activeRides._id": rideRequest._id },
        { $set: { "activeRides.$.enRoute": true } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )

    console.log('found driver: ', driver)

    db__.collection('rides').updateOne(
        { _id: new ObjectId(String(rideRequest._id)) },
        { $set: { enRoute: true } },
    )

    io.to(rideRequest.user._id).emit('scheduled_ride_en_route', rideRequest);


}



completeScheduledRide = async (io, rideRequest) => {
    console.log('ride completed:', rideRequest);
    db__.collection('users').updateOne(
        { _id: new ObjectId(String(rideRequest.user._id)) },
        { $pull: { "activeRides": { _id: new ObjectId(String(rideRequest._id)) } } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )
    db__.collection('drivers').updateOne(
        { _id: new ObjectId(String(rideRequest.driver._id)) },
        { $pull: { "activeRides": { _id: rideRequest._id } } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )
    let completedRide = await db__.collection('rides').findOneAndUpdate(
        { _id: new ObjectId(String(rideRequest._id)), rideCompleted: false },
        { $set: { rideCompleted: true } },
    )
    io.to(rideRequest.user._id).emit('scheduled_ride_completed', rideRequest);


    // Driver Payout
    if (completedRide.paid == "card" && !completedRide.paymentSentToDriver) {
        console.log('ride to update: ', completedRide)
        let fare = completedRide.fare
        let tipAmount = completedRide.tipAmount ? completedRide.tipAmount : 0
        console.log('tipAmount: ', tipAmount)


        // let app_fee = fare > 55 ? .10 * fare > 10 ? .10 * fare : 10 : fare * .10
        let app_fee = fare > 99 || fare < 50 ? .10 * fare : 8
        let depositAmount = fare * .05 > 5 ? 5 : Number((fare * .05).toFixed(2))
        // depositAmount *= 100
        console.log('depositAmount: ', depositAmount)



        let charges = .30 + (.029 * fare) + app_fee + (.029 * tipAmount)
        console.log('charges: ', charges)
        let transfer_amount = (fare + tipAmount - charges - depositAmount) * 100

        transfer_amount = Math.floor(transfer_amount)
        console.log('transfer amount: ', transfer_amount)
        let driverStripeAccount = completedRide.driver.stripe_account
        let stripe_transfers_enabled = completedRide.driver.stripe_transfers_enabled

        if (stripe_transfers_enabled) {
            console.log('stripe transfer initiated!')
            const transfer = await stripe.transfers.create({
                amount: transfer_amount,
                currency: "usd",
                destination: driverStripeAccount//"{{CONNECTED_STRIPE_ACCOUNT_ID}}",
            });
            console.log('stripe transfer: ', transfer)
            await db__.collection('rides').updateOne({ _id: new ObjectId(String(completedRide._id)) }, { $set: { paymentSentToDriver: true } })


            //Wallet Deposit
            result1 = await db__.collection('drivers').findOneAndUpdate(
                { _id: new ObjectId(String(rideRequest.driver._id)) }, {
                $inc: { "wallet.balance": depositAmount },
                $push: {
                    "wallet.transactions": {
                        "type": 'credit',
                        "amount": depositAmount,
                        "ride": { _id: rideRequest._id, user: rideRequest.user, dateTime: rideRequest.pickupDateTime, fare: rideRequest.fare }
                    }
                },
            }, { returnDocument: "after" });


            result2 = await db__.collection('users').findOneAndUpdate(
                { phone: rideRequest.driver.phone }, {
                $inc: { "wallet.balance": depositAmount },
                $push: {
                    "wallet.transactions": {
                        "type": 'credit',
                        "amount": depositAmount,
                        "ride": { _id: rideRequest._id, user: rideRequest.user, dateTime: rideRequest.pickupDateTime, fare: rideRequest.fare }
                    }
                },
            }, { returnDocument: "after" });




        }

    }


};



walletTest = async (io, data, callback) => {

    let { amount, inc_dec } = data

    amount = inc_dec == 'inc' ? amount : amount * -1

    console.log('inc dec: ', inc_dec, amount)
    let driver_id = '66722439d283bd70fa29ec9d'
    let driver_phone = '9175751955'
    let ride = "ride data"

    // let result = await db__.collection('drivers').findOneAndUpdate(
    //     { _id: new ObjectId(String(driver_id)) },
    //     { $inc: { walletBalance: amount } },
    //     { returnDocument: "after" }
    // )
    let result1, result2

    if (inc_dec == 'inc') {

        result1 = await db__.collection('drivers').findOneAndUpdate(
            { _id: new ObjectId(String(driver_id)) }, {
            // $set: { "wallet.balance": useWallet.newBalance },
            $inc: { "wallet.balance": amount },
            $push: {
                "wallet.transactions": {
                    "type": 'credit',
                    "amount": amount,
                    "ride": ride
                }
            },
        }, { returnDocument: "after" });


        result2 = await db__.collection('users').findOneAndUpdate(
            { phone: driver_phone }, {
            // $set: { "wallet.balance": useWallet.newBalance },
            $inc: { "wallet.balance": amount },
            $push: {
                "wallet.transactions": {
                    "type": 'credit',
                    "amount": amount,
                    "ride": ride
                }
            },
        }, { returnDocument: "after" });

    } else {

        result1 = await db__.collection('drivers').findOneAndUpdate(
            { _id: new ObjectId(String(driver_id)) }, {
            // $set: { "wallet.balance": useWallet.newBalance },
            $inc: { "wallet.balance": amount },
            $push: {
                "wallet.transactions": {
                    "type": 'debit',
                    "amount": amount,//useWallet.chargedToWallet,
                    "basket": null,
                }
            },
        }, { returnDocument: "after" });

        result2 = await db__.collection('users').findOneAndUpdate(
            { phone: driver_phone }, {
            // $set: { "wallet.balance": useWallet.newBalance },
            $inc: { "wallet.balance": amount },
            $push: {
                "wallet.transactions": {
                    "type": 'debit',
                    "amount": amount,//useWallet.chargedToWallet,
                    "basket": null,
                }
            },
        }, { returnDocument: "after" });


    }



    console.log('result: ', result1, result2)

}




cancelScheduledRide = async (io, rideRequest, callback) => {

    console.log('ride canceled:', rideRequest);

    db__.collection('users').updateOne(
        { _id: new ObjectId(String(rideRequest.user._id)) },
        { $pull: { "activeRides": { _id: new ObjectId(String(rideRequest._id)) } } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )

    if (rideRequest.driver) {
        db__.collection('drivers').updateOne(
            { _id: new ObjectId(String(rideRequest.driver._id)) },
            { $pull: { "activeRides": { _id: rideRequest._id } } }, //https://stackoverflow.com/a/10523963
            { returnDocument: "after" }
        )
        io.to(rideRequest.driver._id).emit('scheduled_ride_canceled', rideRequest);
    }

    db__.collection('rides').updateOne(
        { _id: new ObjectId(String(rideRequest._id)) },
        { $set: { rideCanceledByDriver: rideRequest.rideCanceledByDriver, rideCanceledByRider: rideRequest.rideCanceledByRider } },
    )

    callback && callback('success')

    io.to(rideRequest.user._id).emit('scheduled_ride_canceled', rideRequest);
};


acceptPayScheduledRide = async (io, rideRequest) => {

    console.log('ride mark as paid:', rideRequest);

    let user = await db__.collection('users').updateOne(
        { _id: new ObjectId(String(rideRequest.user._id)), "activeRides._id": new ObjectId(String(rideRequest._id)) },
        { $set: { "activeRides.$.paid": rideRequest.paid } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )

    console.log('found user: ', user)

    let driver = await db__.collection('drivers').updateOne(
        // { _id: new ObjectId(String(rideRequest.driver._id)), "activeRides._id": rideRequest._id },
        { _id: new ObjectId(String(rideRequest.driver._id)), "activeRides._id": new ObjectId(String(rideRequest._id)) },
        { $set: { "activeRides.$.paid": rideRequest.paid } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )

    console.log('found driver: ', driver)

    db__.collection('rides').updateOne(
        { _id: new ObjectId(String(rideRequest._id)) },
        { $set: { paid: rideRequest.paid } },
    )

    io.to(rideRequest.user._id).to(rideRequest.driver._id).emit('scheduled_ride_paid', rideRequest);

};




paymentCompleteScheduledRide = async (io, rideRequest) => {

    console.log('ride mark as paid:', rideRequest);

    let user = await db__.collection('users').updateOne(
        { _id: new ObjectId(String(rideRequest.user._id)), "activeRides._id": new ObjectId(String(rideRequest._id)) },
        { $set: { "activeRides.$.paid": rideRequest.paid } }, //https://stackoverflow.com/a/10523963
        { returnDocument: "after" }
    )
    // console.log('found user: ', user)

    if (rideRequest.driver) {
        let driver = await db__.collection('drivers').updateOne(
            { _id: new ObjectId(String(rideRequest.driver._id)), "activeRides._id": rideRequest._id },
            { $set: { "activeRides.$.paid": rideRequest.paid } }, //https://stackoverflow.com/a/10523963
            { returnDocument: "after" }
        )
        io.to(rideRequest.driver._id).emit('scheduled_ride_paid', rideRequest);
    }
    // console.log('found driver: ', driver)

    db__.collection('rides').updateOne(
        { _id: new ObjectId(String(rideRequest._id)) },
        { $set: { paid: rideRequest.paid, tipAmount: rideRequest.tipAmount } },
    )

};






// socket.on('reassign_scheduled_ride', async (rideRequest) => {
//     console.log('ride reassigned:', rideRequest);
//     io.to(rideRequest.user._id).emit('scheduled_ride_reassigned', rideRequest);
// });



module.exports = {
    message,
    requestScheduledRide,
    acceptScheduledRide,
    completeScheduledRide,
    cancelScheduledRide,
    acceptPayScheduledRide,
    paymentCompleteScheduledRide,
    enRouteScheduledRide,
    walletTest,
    setReminder,
    disableReminder,
}