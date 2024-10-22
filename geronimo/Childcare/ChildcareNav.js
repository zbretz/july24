import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, Dimensions } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigationContainerRef, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChildcareHome from './ChildcareHome';
import Partner from './Partner';
import { StripeProvider } from '@stripe/stripe-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default ChildcareNav = ({ isConnected, masterState, setMasterState, chatLog, setChatLog, navigation }) => {

    const [basket, setBasket] = useState({
        partner: null, items: [], pickupTime: '20 mins'
    })

    const [item, setItem] = useState(null)
    const [partner, setPartner] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)
    useFocusEffect(
        useCallback(() => {
            let modalTimeout = setTimeout(() => setModalVisible(!!masterState.localsDisabled), 500)
            return () => clearTimeout(modalTimeout)
        }, [])
    )

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
                <Stack.Screen name="ChildcareHome">
                    {props => <ChildcareHome {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
             
                <Stack.Screen name="Partner" options={{ presentation: "modal" }}>
                    {props => <Partner {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
               
            </Stack.Navigator>
        </StripeProvider>
    )
}