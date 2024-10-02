import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocalsHome from './LocalsHome';
import OrderHistory from './OrderHistory'
import DailyRise from './DailyRise';
import Partner from './Partner';
import Item from './Item';
import { StripeProvider } from '@stripe/stripe-react-native';

const Stack = createStackNavigator();

export default LocalsNav = ({ isConnected, masterState, setMasterState, chatLog, setChatLog }) => {

    const [basket, setBasket] = useState({
        partner: null, items: [], pickupTime: '20 mins'
    })

    const [item, setItem] = useState(null)
    const [partner, setPartner] = useState(null)

    return (
        <StripeProvider
            publishableKey="pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT"
            // publishableKey="pk_live_51Nj9WRAUREUmtjLCliIgWk6tgmUXBHSOGsmmaNIC6Tb9UT4BVNEAK40DNXsrljEJHLHxJsj0CyU0qdU5ozO4I1Eb00SdEyvrQ9"
        >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="LocalsHome">
                    {props => <LocalsHome {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
                <Stack.Screen name="OrderHistory" options={{ presentation: "modal" }}>
                    {props => <OrderHistory {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} />}
                </Stack.Screen>
                <Stack.Screen name="DailyRise" options={{ presentation: "modal" }}>
                    {props => <DailyRise {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
                <Stack.Screen name="Partner" options={{ presentation: "modal" }}>
                    {props => <Partner {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
                <Stack.Screen name="Item" options={{ presentation: "modal" }}>
                    {props => <Item {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} />}
                </Stack.Screen>


            </Stack.Navigator>
        </StripeProvider>
    )
}