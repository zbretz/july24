import { useState, useEffect } from 'react';
import { Platform, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { socket } from '../CoreNav/socket';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import {url} from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ScheduleRideStripeConfig(rideDetail, setLoadingPayForm, masterState, setMasterState, navigation) {

    console.log('stripe config ride detail', rideDetail)

    let charge = rideDetail.fare + rideDetail.tipAmount
    charge = charge.toFixed(2)

    let { tipAmount } = rideDetail

    console.log('scheduled rides checkout charge: ', charge)
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const fetchPaymentSheetParams = async () => {
        // console.log('payment sheet params -- ride detail', rideDetail)

        const response = await fetch(`${url}/payment-sheet?charge=${charge}&ride=${JSON.stringify(rideDetail)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
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

        const { error } = await presentPaymentSheet();

        if (error) {
            if (error.code !== 'Canceled') Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            socket.emit('payment_complete_scheduled_ride', { ...rideDetail, paid: "card", tipAmount })
            Alert.alert('Success', 'Your payment was successful. Thank you!');

            setMasterState(masterState => {
                //the approach here is to remove the ride altogether and replace with same ride with single updated property
                let activeRides = masterState.user.activeRides.filter(ride => ride._id !== rideDetail._id)
                rideDetail = { ...rideDetail, paid: "card" }
                activeRides = [...activeRides, rideDetail]
                return ({ ...masterState, user: { ...masterState.user, activeRides } })
            })

            navigation.goBack()

        }
    };



    // return initialize payment sheet AND openpayment sheet...this will prevent from triggerng a payment attempt every time that page is opened
    return initializePaymentSheet

}