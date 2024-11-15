import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, Dimensions } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigationContainerRef, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChildcareHome from './ChildcareHome';
import Booking from './Booking';
import SitterPage from './SitterPage';
import SitterList from './SitterList';
import { StripeProvider } from '@stripe/stripe-react-native';
import axios from 'axios';
import { url } from '../url_toggle'
import { MaterialIcons } from '@expo/vector-icons';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default ChildcareNav = ({ isConnected, masterState, setMasterState, chatLog, setChatLog, navigation }) => {

    const [providers, setProviders] = useState([])

    let booking = masterState.user?.childcareBookings?.length ? masterState.user.childcareBookings[0] : null

    const fetchProviders = () => {
        axios.get(`${url}/childcare/fetchProviders`)
            .then(res => {
                console.log('providers: ', res.data)
                setProviders(res.data)
            })
            .catch(e => console.log('order  error: ', e))
    }

    useEffect(() => {
        fetchProviders()
    }, [])

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
                        {props => <ChildcareHome {...props} masterState={masterState} setMasterState={setMasterState} providers={providers} />}
                    </Stack.Screen>
                    :
                    <Stack.Screen name="Booking">
                        {props => <Booking {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>
                }

                <Stack.Screen name="SitterList" options={{ presentation: "modal" }}>
                    {props => <SitterList {...props} masterState={masterState} setMasterState={setMasterState} providers={providers} />}
                </Stack.Screen>

                <Stack.Screen name="SitterPage" options={{ presentation: "modal" }}>
                    {props => <SitterPage {...props} masterState={masterState} setMasterState={setMasterState} providers={providers} />}
                </Stack.Screen>

                <Stack.Screen name="EasyBook" options={{ presentation: "modal" }}>

                    {props =>
                        <View>
                            <TouchableOpacity onPress={() => navigation.navigate('Booking')} style={{ backgroundColor: '#f2f2f2', height: 34, width: 34, zIndex: 98, borderRadius: 20, position: 'absolute', top: 45, left: 40, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                                <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={20} color="black" />
                            </TouchableOpacity>
                            <EasyBook {...props} masterState={masterState} setMasterState={setMasterState} />
                        </View>
                    }
                </Stack.Screen>

            </Stack.Navigator>
        </StripeProvider>
    )
}