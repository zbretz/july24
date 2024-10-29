const dotenv = require('dotenv')
// dotenv.config({path : '../.env'})
const router = require("express").Router();
var ObjectId = require('mongodb').ObjectId;
// const { Expo } = require('expo-server-sdk')

const { sendCode } = require("./sms.js");

const registrationCodes = {}

const { db__, db_locals } = require('./mongoConnection.js')

router.post('/signIn', async (req, res) => {
    const code = Math.floor(1000 + Math.random() * 9000);

    let user = req.body.user
    let stripped_phone = user.phone.replace(/[^0-9]/g, "")

    console.log('code: ', code, 'sign in user: ', user)
    console.log('stipped phone:', stripped_phone)

    try {
        user = await db__.collection('users').findOneAndUpdate({ phone: stripped_phone }, { $set: { confirmationCode: code, confirmedWithCode: false, } }, { returnDocument: "after" })
        console.log('auth user?: ', user)

        if (!user) {
            res.status(200).send(false);
        } else {
            sendCode(user.phone, code)
            res.status(200).send(true);
        }
    } catch (e) {
        console.log('sign in error: ', e)
    }

});


router.post('/registerUser', async (req, res) => {
    const code = Math.floor(1000 + Math.random() * 9000);
    let user = req.body.user
    console.log('register user: ', code, user)

    let stripped_phone = user.phone.replace(/[^0-9]/g, "")

    let user_exists = await db__.collection('users').findOne({ phone: stripped_phone })
    if (user_exists) {
        console.log('user exists! ', user_exists)
        res.status(200).send('user exists');
    } else {
        registrationCodes[stripped_phone] = code
        console.log('registration codes: ', registrationCodes)
        await db__.collection('users').insertOne({ firstName: user.firstName, lastName: user.lastName, phone: stripped_phone, confirmationCode: code, signupDate: Date.now(), confirmedWithCode: false, driver: null, activeRides: [] })
        sendCode(stripped_phone, code)
        res.status(200).send('ok');
    }

});




router.post('/userCode', async (req, res) => {
    console.log('data: ', req.body)
    let user = req.body.user
    let code = Number(req.body.code)
    let stripped_phone = user.phone.replace(/[^0-9]/g, "")

    console.log('userrrr:', user)

    const loginType = req.body.type

    if (loginType == 'signin') {

        user = await db__.collection('users').findOne({ phone: stripped_phone })

        if (stripped_phone === '5551234567' && code === 9991) {
            //code for app store testing
            console.log('correct: ', code)
            user = await db__.collection('users').findOneAndUpdate({ phone: stripped_phone }, { $set: { confirmedWithCode: true } }, { returnDocument: "after" });
            res.status(200).send({ status: 'ok', user: user })
            return
        }

        else if (code === user.confirmationCode) {
            console.log('OK!')
            user = await db__.collection('users').findOneAndUpdate({ phone: stripped_phone }, { $set: { confirmedWithCode: true } }, { returnDocument: "after" });
            console.log('code user: ', user)
            res.status(200).send({ status: 'ok', user: user })
            return
        }

    } else //if (loginType == 'signup')
    {
        let registrationCode = registrationCodes[stripped_phone]

        if (code === registrationCode) {

            console.log('signup OK!')
            user = await db__.collection('users').findOneAndUpdate({ phone: stripped_phone }, { $set: { confirmedWithCode: true } }, { returnDocument: "after" });
            console.log('user value: ', user)
            // await db__.collection('users').insertOne({ firstName: user.firstName, lastName: user.lastName, phone: stripped_phone, confirmationCode: code, signupDate: Date.now(), confirmedWithCode: true, driver: null })
            res.status(200).send({ status: 'ok', user: user })
            return
        }

    }

    console.log('signin NOT OK!')
    res.status(200).send({ status: 'incorrect' });

});

router.post('/childcareSignIn', async (req, res) => {
    const code = Math.floor(1000 + Math.random() * 9000);

    let user = req.body.user
    let stripped_phone = user.phone.replace(/[^0-9]/g, "")

    console.log('code: ', code, 'sign in user: ', user)
    console.log('stipped phone:', stripped_phone)

    try {
        let saved_user = await db__.collection('users').findOneAndUpdate({ phone: stripped_phone }, { $set: { confirmationCode: code, confirmedWithCode: false, } }, { returnDocument: "after" })
        console.log('auth user?: ', saved_user)

        if (saved_user) {
            console.log('saved user: ', saved_user)
            // res.status(200).send(false);
            sendCode(saved_user.phone, code)
            res.status(200).send('ok');
        } else {
            registrationCodes[stripped_phone] = code
            console.log('registration codes: ', registrationCodes)
            await db__.collection('users').insertOne({ firstName: user.firstName, lastName: user.lastName, phone: stripped_phone, confirmationCode: code, signupDate: Date.now(), confirmedWithCode: false, driver: null, activeRides: [], registeredViaChildcare:true })
            sendCode(stripped_phone, code)
            res.status(200).send('ok');

        }
    } catch (e) {
        console.log('sign in error: ', e)
    }

    // res.status(200).send('ok');

});




router.post('/childcareCode', async (req, res) => {
    let phone = req.body.phone
    let code = Number(req.body.code)
    let stripped_phone = phone.replace(/[^0-9]/g, "")

    console.log('userrrr:', phone)

    user = await db__.collection('users').findOne({ phone: stripped_phone })

    if (code === user.confirmationCode) {
        console.log('OK!')
        user = await db__.collection('users').findOneAndUpdate({ phone: stripped_phone }, { $set: { confirmedWithCode: true } }, { returnDocument: "after" });
        console.log('code user: ', user)
        res.status(200).send({ status: 'ok', user: user })
        return
    }

    console.log('signin NOT OK!')
    res.status(200).send({ status: 'incorrect' });

});





router.post('/driverCode', async (req, res) => {
    console.log('data: ', req.body)
    let phone = req.body.phone
    let code = Number(req.body.code)

    driver = await db__.collection('drivers').findOne({ phone: phone })

    if (code === driver.confirmationCode) {
        console.log('OK!')
        driver = await db__.collection('users').findOneAndUpdate({ phone: phone }, { $set: { confirmedWithCode: true } }, { returnDocument: "after" });
        console.log('code user: ', driver)
        res.status(200).send({ status: 'ok', })
        return
    }

    console.log('signin NOT OK!')
    res.status(200).send({ status: 'incorrect' });

});


router.post('/driverSignIn', async (req, res) => {
    const code = Math.floor(1000 + Math.random() * 9000);
    let phone = req.body.phone
    console.log('code: ', code, 'sign in driver: ', phone)
    try {
        driver = await db__.collection('drivers').findOneAndUpdate({ phone: phone }, { $set: { confirmationCode: code, confirmedWithCode: false, } }, { returnDocument: "after" })
        if (!driver) {
            res.status(200).send(false);
        } else {
            sendCode(phone, code)
            res.status(200).send(true);
        }
    } catch (e) {
        console.log('driver sign in error: ', e)
    }

});


router.post('/saveExpoPushToken', async (req, res) => {
    try {
        let userId = req.body.userId
        let push_token = req.body.push_token
        console.log('push token: ', push_token, 'userUUID: ', userId)
        let update = db__.collection('users').updateOne({ _id: new ObjectId(String(userId)) }, { $set: { expoPushToken: push_token } },);
        // console.log('update: ', update)
        res.status(200).send('ok');
    } catch (e) {
        console.log('push token save error: ', e)
    }
});

router.post('/saveDriverToken', async (req, res) => {
    try {
        let driverId = req.body.driverId
        let push_token = req.body.push_token
        console.log('push token: ', push_token, 'driverId: ', driverId)
        let update = db__.collection('drivers').updateOne({ _id: new ObjectId(String(driverId)) }, { $set: { expoPushToken: push_token } },);
        // console.log('update: ', update)
        res.status(200).send('ok');
    } catch (e) {
        console.log('driver push token save error: ', e)
    }
});


router.delete('/deleteUser', async (req, res) => {
    try {
        let userId = req.body.userId
        let user = await db__.collection('users').findOne({ _id: new ObjectId(String(userId)) });
        console.log('user - dete: ', user)
        if (user.activeRides.length) {
            //don't permit account deletion if they have an active ride
            res.status(200).send(false);
        } else {
            res.status(200).send('ok');
        }
    } catch (e) {
        console.log('driver push token save error: ', e)
    }
});

module.exports = router;


