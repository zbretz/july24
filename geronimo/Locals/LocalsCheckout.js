import { useState, useEffect } from 'react';
import { Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { formatInTimeZone } from "date-fns-tz";

import { useStripe } from '@stripe/stripe-react-native';


export default function LocalsCheckout(basket, setBasket, masterState, navigation) {

    let checkoutTotal = Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty * currentItem.price, 0)
    checkoutTotal = (Math.round(checkoutTotal * 100) / 100).toFixed(2);

    console.log('locals checkout prrrice: ', checkoutTotal)
    console.log('locals checkout masterState: ', masterState)

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const fetchPaymentSheetParams = async () => {
        console.log('INITTT', basket)

        const response = await fetch(`https://summer.theparkcityapp.com:7100/locals/payment-sheet2?price=${checkoutTotal}&user=${JSON.stringify(masterState.user)}`, {
        // const response = await fetch(`http://10.0.0.135:7100/locals/payment-sheet2?price=${checkoutTotal}&user=${JSON.stringify(masterState.user)}`, {
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
        const { error } = await presentPaymentSheet();

        if (error) {
            if (error.code !== 'Canceled') Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            console.log('bong bong')

        let timeOfOrder = formatInTimeZone(new Date(), 'America/Denver', "eee',' MMMM do h':'mm aa")
        console.log('timeOfOrder: ', timeOfOrder)

        axios.post(`https://summer.theparkcityapp.com:7100/locals/placeOrder`, { user: masterState.user, basket, timeOfOrder: timeOfOrder })
        // axios.post(`http://10.0.0.135:7100/locals/placeOrder`, { user: masterState.user, basket, timeOfOrder: timeOfOrder })
            .then(res => {
                console.log('DATA: ', res.data)
                if (res.data) {
                    console.log('count: ', res.data.count)

                    Alert.alert('Order Placed', 'Your order will be ready for pickup shortly. Just give your name at the counter!');
                    navigation.navigate('LocalsHome')
                    setBasket({ partner: null, items: [] })

                } else {
                    console.log('nada')
                }
            })
            .catch(e => console.log('order  error: ', e))

        }
    };

    // useEffect(() => {
    //     initializePaymentSheet();
    // }, []);


    // return [openPaymentSheet, initializePaymentSheet]

    return initializePaymentSheet


    // initializePaymentSheet()
    // .then(() => {
    //     openPaymentSheet()
    // })
}



// return initialize payment sheet AND openpayment sheet...this will prevent from triggerng a payment attempt every time that page is opened