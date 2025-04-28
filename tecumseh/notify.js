const { db__ } = require('./mongoConnection.js')
const { Expo } = require('expo-server-sdk')
var ObjectId = require('mongodb').ObjectId;
const { smsNotifyUser, smsNotifyDriver } = require("./sms.js");
let expo = new Expo();

const notifyUser = async ({ userid, text, type }) => {

    let notifications = {
        'confirmedByDriver': ["Your ride has been accepted."],
        'riderConfirmationRequested': ["Your attention is needed", "Please confirm your upcoming Ride on the app."],
        'driverHasArrived': ["Your ride has arrived!", "Please meet your driver outside when you're ready."],
        'driverEnroute': ["Your driver is en route.", "We'll notify you when we've arrived"],
        "message": ["New message", text]
    }

    let rider = await db__.collection('users').findOne({ _id: new ObjectId(String(userid)) })
    console.log('rider: ', rider)

    try {
        if (rider.expoPushToken) {
            let messageUser = {
                to: rider.expoPushToken,
                sound: 'default',
                title: notifications[type][0],
                body: text, //notifications[status][1],
                data: { message: null },
            }
            let sendNotification = await expo.sendPushNotificationsAsync([messageUser]);
            // let receipts = await expo.getPushNotificationReceiptsAsync(sendNotification);
        } else {
            console.log('no token')
            smsNotifyUser(rider.phone, text)
            // smsRequestConfirmation(rider.name, rider.phone)
        }
    } catch (e) {
        console.log('push notification error: ', e)
    }

}

const notifyDriver = async ({ driverid, text, type }) => {

    let driver = await db__.collection('drivers').findOne({ _id: new ObjectId(String(driverid)) })
    console.log('driver: ', driver)

    let notifications = {
        'message': [`New message: `, text],
        'confirmedByRider': ['Rider has confirmed', 'Your passenger has confirmed their ride']
    }

    try {
        let messagedriver = {
            to: driver?.expoPushToken,
            sound: 'default',
            title: notifications[type][0],
            body: notifications[type][1],
            data: { message: null },
        }
        if (driver?.expoPushToken && driver.expoPushToken !== 'simulator') {
            let sendNotification = await expo.sendPushNotificationsAsync([messagedriver]);
            let receipts = await expo.getPushNotificationReceiptsAsync(sendNotification);
        } else {
            smsNotifyDriver(driverPhone, text)
        }
    } catch (e) {
        console.log('push notification error: ', e)
    }
}

const notifyAllDrivers = async (type, pickup, dropoff, date, preferredDrivers) => {

    // let drivers = preferredDrivers.length ? preferredDrivers : await db__.collection('drivers').find({ driverIsAuthorized: true }).toArray()
    // console.log('preferred drivers?: ', preferredDrivers)

    let drivers = await db__.collection('drivers').find({ driverIsAuthorized: true }).toArray()

    drivers.forEach(async (driver) => {

        console.log('driver push token: ', driver.expoPushToken)

        let messageDriver = {
            to: driver.expoPushToken,
            sound: 'default',
            title: `${type} Ride Request`,
            body: ` to: ${pickup} from: ${dropoff} date: ${date}`,
            data: { message: null },
        }

        if (driver.expoPushToken) {//&& recipient.expoPushToken !== 'simulator') {
            let sendNotification = await expo.sendPushNotificationsAsync([messageDriver]);
            let receipts = await expo.getPushNotificationReceiptsAsync(sendNotification);
            console.log('BONG BONG', receipts)
        }

    })

}

module.exports = {
    notifyUser,
    notifyDriver,
    notifyAllDrivers
}; 