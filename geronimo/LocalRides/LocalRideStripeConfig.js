import { useState, useEffect } from 'react';
import { Platform, Text, View, Dimensions, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import axios from 'axios';
import {url} from '../url_toggle'

import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


console.log('BONG BONG BONG BONG')


export default function LocalRideStripeConfig({user, fare=0, requestLocal, setLoadingPayForm,}) {

    // console.log('userrrr: ', user)
    // console.log('local ride fare: ', fare)

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    if (fare == 0 || !fare ) return
    fare = fare.toFixed(2)

    const fetchPaymentSheetParams = async () => {
        console.log('payment sheet params -- fare', fare)

        const response = await fetch(`${url}/local-payment-sheet?fare=${fare}&user=${JSON.stringify(user)}`, {
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
        // console.log('ting ting ting')

        const { error } = await presentPaymentSheet();

        if (error) {
            if (error.code !== 'Canceled') Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            // socket.emit('payment_complete_scheduled_ride', { ...rideDetail, paid: "card", tipAmount })

            requestLocal()

            // Alert.alert('Success', 'Your payment was successful. Thank you!');


            // setMasterState(masterState => {
            //     //the approach here is to remove the ride altogether and replace with same ride with single updated property
            //     let activeRides = masterState.user.activeRides.filter(ride => ride._id !== rideDetail._id)
            //     rideDetail = { ...rideDetail, paid: "card" }
            //     activeRides = [...activeRides, rideDetail]
            //     return ({ ...masterState, user: { ...masterState.user, activeRides } })
            // })

            // navigation.goBack()

        }
    };



    // return initialize payment sheet AND openpayment sheet...this will prevent from triggerng a payment attempt every time that page is opened
    return initializePaymentSheet

}