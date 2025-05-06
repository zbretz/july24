const dotenv = require('dotenv')
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const demoNumber = process.env.DEMO_NUMBER;

const client = require('twilio')(accountSid, authToken);

let notifications = {
    "confirmed": "Hi. Your ride request has been confirmed. View ride details on The Park City App. Thanks!",
    "please_confirm": "Please confirm your upcoming Ride on the app.",
    "enroute": "Your driver is en route. We'll notify you when we've arrived",
    "arrived": "Your ride has arrived! Please meet your driver outside when you're ready.",
    "chatMessage": "You have a new chat message. Read and respond on the app."
}


const smsRequestConfirmation = (status = 'confirmed', name, userPhone) => {
    return client.messages
        .create({
            // body: `Hi ${name}, your ride request has been confirmed. View ride details on The Park City App. Thanks!`,//`Ride request: \nName: ${name}\nDate/Time: ${Object.values(pickup)}\nMessage: ${message}.\nTheir phone number: ${phone}`,
            body: notifications[status],
            from: phoneNumber,
            to: userPhone//demoNumber
        })
        .then(message => message.sid)

}

const smsNotifyUser = (userPhone, text) => {
    console.log(userPhone, text)
    return client.messages
        .create({
            body:
                `Park City App here. You have a new message:\n${text}`,
            from: phoneNumber,
            to: userPhone
        })
        .then(message => console.log('sms sent: ', message.sid))
        .catch(e => {
            console.log('caught error!: ', e)
            // throw new Error
        });
}

const smsNotifyDriver = (driverPhone, text) => {
    console.log(driverPhone, text)
    return client.messages
        .create({
            body:
                `Park City App here. You have a new message:\n${text}`,
            from: phoneNumber,
            to: driverPhone
        })
        .then(message => console.log('sms sent: ', message.sid))
        .catch(e => {
            console.log('caught error!: ', e)
            // throw new Error
        });
}

const sendCode = (clientNumber, code) => {
    console.log(clientNumber, code)
    return client.messages
        .create({
            body: `Park City verification code: ${code}`,
            from: phoneNumber,
            to: clientNumber,
            // enable mediaURL field for MMS
            // mediaUrl: ['https://c1.staticflickr.com/3/2899/14341091933_1e92e62d12_b.jpg'],
        })
        .then(message => {
            console.log(message.sid)
            return message.sid
        })
        .catch(e => {
            console.log('caught error!: ', e)
            // throw new Error
        });
}

const smsMessageUser = (userPhone, text, first_message_for_ride) => {
    console.log(userPhone, text, first_message_for_ride)

    if (first_message_for_ride){
        text = `New message from Driver!\n\nReply here or in The Park City App. (To opt out, reply 'STOP'.)\n\n---------------\n\n${text}`
    }

    return client.messages
        .create({
            body: text,
            from: '+18016182619',
            to: userPhone
        })
        .then(message => console.log('sms sent: ', message.sid))
        .catch(e => {
            console.log('caught error!: ', e)
            // throw new Error
        });
}

module.exports = {
    smsRequestConfirmation,
    smsNotifyUser,
    smsNotifyDriver,
    sendCode,
    smsMessageUser
}; 