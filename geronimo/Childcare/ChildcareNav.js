import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, Dimensions } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigationContainerRef, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChildcareHome from './ChildcareHome';
import Booking from './Booking';
import SitterPage from './SitterPage';
import SitterList from './SitterList';
import { StripeProvider } from '@stripe/stripe-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default ChildcareNav = ({ isConnected, masterState, setMasterState, chatLog, setChatLog, navigation }) => {

    // const [basket, setBasket] = useState({
    //     partner: null, items: [], pickupTime: '20 mins'
    // })

    const [booking, setBooking] = useState(true)
    const bookNow = () => {
        setBooking(true)
        // axios.post(`${locals_url}/locals/placeOrder`, { user: masterState.user, basket, timeOfOrder: timeOfOrder, useWallet })
        // .then(res => {
        //     console.log('DATA: ', res.data)
        //     if (res.data[0]) {
        //         console.log('count: ', res.data[0].count)

        //         Alert.alert('Order Placed', 'Your order will be ready for pickup shortly. Just give your name at the counter!');
        //         navigation.navigate('LocalsHome')
        //         setBasket({ partner: null, items: [], pickupTime: '20 mins' })

        //        useWallet && setMasterState(masterState => {
        //             return {...masterState, user: {...masterState.user, wallet: {...masterState.user.wallet, balance: res.data[1] }}}
        //         })
        //     } else {
        //         console.log('nada')
        //     }
        // })
        // .catch(e => console.log('order  error: ', e))    }


        Alert.alert('Order Placed', 'Your order will be ready for pickup shortly. Just give your name at the counter!');

    }

    return (
        <StripeProvider
            // publishableKey="pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT"
            publishableKey="pk_live_51Nj9WRAUREUmtjLCliIgWk6tgmUXBHSOGsmmaNIC6Tb9UT4BVNEAK40DNXsrljEJHLHxJsj0CyU0qdU5ozO4I1Eb00SdEyvrQ9"
        >

            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >

                {!booking ?
                    <Stack.Screen name="ChildcareHome">
                        {props => <ChildcareHome {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>
                    :
                    <Stack.Screen name="Booking">
                        {props => <Booking {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>
                }

                <Stack.Screen name="SitterList" options={{ presentation: "modal" }}>
                    {props => <SitterList {...props} masterState={masterState} setMasterState={setMasterState} />}
                </Stack.Screen>

                <Stack.Screen name="SitterPage" options={{ presentation: "modal" }}>
                    {props => <SitterPage {...props} masterState={masterState} setMasterState={setMasterState} />}
                </Stack.Screen>

                <Stack.Screen name="EasyBook" options={{ presentation: "modal" }}>
                    {props => <EasyBook {...props} masterState={masterState} setMasterState={setMasterState} />}
                </Stack.Screen>

            </Stack.Navigator>
        </StripeProvider>
    )
}