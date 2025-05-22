import { useState, useEffect } from 'react';
import { Platform, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { socket } from '../CoreNav/socket';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ScheduleRideStripeConfig(rideDetail, setLoadingPayForm, masterState, setMasterState, navigation) {

    console.log('____________________ stripe config rideDetail _____________________:\n\n ', rideDetail)

    let charge = rideDetail.fare + rideDetail.tipAmount
    charge = charge.toFixed(2)

    let { tipAmount } = rideDetail

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const fetchPaymentSheetParams = async () => {

        const response = await fetch(`${url}/payment-sheet`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                charge,
                rideDetail,
            }),
        });

        const { paymentIntent, ephemeralKey, customer } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
        };
    };


    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
        } = await fetchPaymentSheetParams();

        const { error } = await initPaymentSheet({

            returnURL: 'your-app://stripe-redirect',

            merchantDisplayName: "Park City Payments, Inc.",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,

        });
        if (error) {
            console.log('error: ', error)
        } else {
            openPaymentSheet()
        }
    };

    const openPaymentSheet = async () => {

        setLoadingPayForm(false)
        console.log('openPaymentSheet - tipAmount: ', tipAmount)
        console.log('post pay ride detail: ', rideDetail)

        const { error } = await presentPaymentSheet();

        if (error) {
            if (error.code !== 'Canceled') Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            socket.emit('payment_complete_scheduled_ride', { ...rideDetail, paid: "card", tipAmount })
            Alert.alert('Success', 'Your payment was successful. Thank you!');

            setMasterState(masterState => {
                const activeRides = masterState.user.activeRides.map(ride =>
                    ride._id === rideDetail._id ? { ...ride, paid: "card" } : ride
                );
                return ({ ...masterState, user: { ...masterState.user, activeRides } });
            });

            navigation.goBack()

        }
    };



    // return initialize payment sheet AND openpayment sheet...this will prevent from triggerng a payment attempt every time that page is opened
    return initializePaymentSheet

}