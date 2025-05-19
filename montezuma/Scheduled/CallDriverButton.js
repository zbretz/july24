import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, Linking, TouchableOpacity } from 'react-native';
import  url  from '../url_toggle'
import axios from 'axios';

const CallDriverButton = ({ rideId, pickupDateTime }) => {
    const [canCall, setCanCall] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkTimeWindow = () => {
            const now = new Date();
            const pickup = new Date(pickupDateTime);
            const minutesUntilPickup = (pickup - now) / 60000;

            setCanCall(minutesUntilPickup <= 20 && minutesUntilPickup >= -30);
            // setCanCall(true);
        };

        checkTimeWindow();
        const interval = setInterval(checkTimeWindow, 60 * 1000); // update every minute

        return () => clearInterval(interval);
    }, [pickupDateTime]);


    const callAlert = () => {
        Alert.alert(`Critical Calls Only`, `
     Please use strong discretion when deciding to call the passenger. Calls should only be used to clarify pickup location or similar urgent details.
        `, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Accept', onPress: () => {
                    handleCall()
                }
            },
        ]);

    }



    const handleCall = async () => {

        console.log('mask')
        setLoading(true);

        let proxyNumber

        axios.post(`${url}/comms/create-proxy-session`, { rideId, userType: 'driver' })
            .then(res => {
                if (res.data) {
                    proxyNumber = res.data.proxyNumber
                    console.log('proxy number: ', proxyNumber)
                }
                const supported = Linking.canOpenURL(`tel:${proxyNumber}`);
                if (supported) {
                    console.log('number2: ', proxyNumber)
                    Linking.openURL(`tel:${proxyNumber}`);
                } else {
                    Alert.alert('Error', 'Device does not support phone calls.');


                }
            })
            .catch(e => {
                console.log('order  error: ', e)
                Alert.alert('Error', e.message || 'Failed to initiate call.');
            })
            .finally(() => {
                setLoading(false);
            })





    };

    if (!canCall) return null;

    return (
        <View style={{ position: 'absolute', borderRadius: 20, bottom: 30, right: 20, }}>
            {loading ? (
                <ActivityIndicator />
            ) : (
                <View>
                    <TouchableOpacity onPress={callAlert} style={{ borderRadius: 20, padding: 16, alignItems: 'center', backgroundColor: '#e6e6e6' }}>
                        <Text style={{ fontFamily: 'Aristotelica-SmallCaps', fontSize: 19, marginBottom: -5, }}>Call</Text>
                    </TouchableOpacity>
                  
                </View>
            )}
        </View>
    );
};

export default CallDriverButton;
