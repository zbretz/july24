import { useState, useEffect } from 'react';
import { Dimensions, Alert } from 'react-native';
import axios from 'axios';
import { formatInTimeZone } from "date-fns-tz";
import { locals_url } from '../url_toggle';

import { useStripe } from '@stripe/stripe-react-native';


export default function LocalsCheckout(basket, setBasket, masterState, setMasterState, navigation) {

    console.log('locals checkout user: ', masterState.user)

    let checkoutTotal = Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty * currentItem.price, 0)
    checkoutTotal = (Math.round(checkoutTotal * 100) / 100).toFixed(2);

    masterState.user?.wallet && console.log(` comp: ${masterState.user.wallet.balance > checkoutTotal}`)

    // console.log('locals checkout prrrice: ', checkoutTotal)
    // console.log('locals checkout masterState: ', masterState)

    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const fetchPaymentSheetParams = async () => {

        const response = await fetch(`${locals_url}/locals/payment-sheet2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                price:checkoutTotal,
                user:masterState.user
            }),
        });

        const { paymentIntent, ephemeralKey, customer, useWallet } = await response.json();

        return {
            paymentIntent,
            ephemeralKey,
            customer,
            useWallet
        };
    };


    const initializePaymentSheet = async () => {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
            publishableKey,
            useWallet,
        } = await fetchPaymentSheetParams();

        console.log('useWallet: ', useWallet)

        if (useWallet?.amount !== "in_full") {
            //don't deduct from wallet -- just charge user's card
            const { error } = await initPaymentSheet({
                returnURL: 'your-app://stripe-redirect',
                merchantDisplayName: "Park City Payments, Inc.",
                customerId: customer,
                customerEphemeralKeySecret: ephemeralKey,
                paymentIntentClientSecret: paymentIntent,
            });
            if (error) {
                console.log('error: ', error)
                return
            }
        }



        openPaymentSheet(useWallet)

    };

    const openPaymentSheet = async (useWallet = false) => {

        if (useWallet?.amount !== "in_full") {
            //charge card whether there is no wallet (or wallet balance) or for partial wallet payment
            const { error } = await presentPaymentSheet();
            if (error) {
                Alert.alert(`Error code: ${error.code}`, error.message);
                return
            } else {
null
            }
        }

        let timeOfOrder = formatInTimeZone(new Date(), 'America/Denver', "eee',' MMMM do h':'mm aa")
        console.log('timeOfOrder: ', timeOfOrder)

        axios.post(`${locals_url}/locals/placeOrder`, { user: masterState.user, basket, timeOfOrder: timeOfOrder, useWallet })
            .then(res => {
                console.log('DATA: ', res.data)
                if (res.data[0]) {
                    console.log('count: ', res.data[0].count)

                    Alert.alert('Order Placed', 'Your order will be ready for pickup shortly. Just give your name at the counter!');
                    navigation.navigate('LocalsHome')
                    setBasket({ partner: null, items: [], pickupTime: '20 mins' })
                   
                   useWallet && setMasterState(masterState => {
                        return {...masterState, user: {...masterState.user, wallet: {...masterState.user.wallet, balance: res.data[1] }}}
                    })
                } else {
                    console.log('nada')
                }
            })
            .catch(e => console.log('order  error: ', e))


    }

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