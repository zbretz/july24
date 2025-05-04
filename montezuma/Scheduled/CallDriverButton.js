import React, { useState, useEffect } from 'react';

const CallDriverButton = ({ rideId, pickupDateTime }) => {
    const [canCall, setCanCall] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const checkTimeWindow = () => {
            const now = new Date();
            const pickup = new Date(pickupDateTime);
            const minutesUntilPickup = (pickup - now) / 60000;

            setCanCall(minutesUntilPickup <= 60 && minutesUntilPickup >= -30);
        };

        checkTimeWindow();
        const interval = setInterval(checkTimeWindow, 60 * 1000); // update every minute

        return () => clearInterval(interval);
    }, [pickupDateTime]);




    const handleCall = async () => {

        console.log('mask')
        setLoading(true);


        let proxyNumber

        axios.post(`${url}/calling/create-proxy-session`, { rideId })
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
        <div>
            <button onClick={handleCall} disabled={loading}>
                {loading ? 'Connecting…' : 'Call Driver'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CallDriverButton;
