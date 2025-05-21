import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RideType from './RideType';
import ScheduleOtherAreas from './ScheduleOtherAreas';
import Chat from './Chat';
import FutureRides from './FutureRides'
import RideHistory from './RideHistory'
import PreferredDrivers from './PreferredDrivers'
import PaymentPage from './PaymentPage';
import RideDetail from './RideDetail';

import ScheduleAirport from './ScheduleAirport';
import TypeSelect from './TypeSelect'
import AddressInput from './AddressInput';
import BookRide from './BookRide';

const Stack = createStackNavigator();

export default ScheduleRide = ({ isConnected, masterState, setMasterState, chatLog, setChatLog }) => {

    const [rideDetail, setRideDetail] = useState(null)
    const [rideHistory, setRideHistory] = useState(null)

    const [destination, setDestination] = useState('')
    const [pickupLocation, setPickupLocation] = useState('')

    const [fare, setFare] = useState(0)
    const [date, setDate] = useState(new Date())

    const [flightNumber, setFlightNumber] = useState('')


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="RideType">
                {props => <RideType {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="Airport">
                {props => <ScheduleAirport {...props} masterState={masterState} setMasterState={setMasterState} setDestination={setDestination} setPickupLocation={setPickupLocation} date={date} setDate={setDate} flightNumber={flightNumber} setFlightNumber={setFlightNumber} />}
            </Stack.Screen>


            <Stack.Screen name="TypeSelect" options={{ animationEnabled: false, }}  >
                {props => <TypeSelect {...props} masterState={masterState} setMasterState={setMasterState} destination={destination} setDestination={setDestination} pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} setFare={setFare} date={date} setDate={setDate} flightNumber={flightNumber} setFlightNumber={setFlightNumber} />}
            </Stack.Screen>

            <Stack.Screen name="AddressInput" options={{ presentation: 'modal' }}>
                {props => <AddressInput {...props} masterState={masterState} setMasterState={setMasterState} destination={destination} setDestination={setDestination} pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} />}
            </Stack.Screen>

            <Stack.Screen name="Book" >
                {props => <BookRide {...props} masterState={masterState} setMasterState={setMasterState} destination={destination} setDestination={setDestination} pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} fare={fare} date={date} flightNumber={flightNumber} />}
            </Stack.Screen>



            <Stack.Screen name="OtherAreas">
                {props => <ScheduleOtherAreas {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>
            <Stack.Screen name="RideDetail" options={{ presentation: "modal" }}>
                {props => <RideDetail {...props} masterState={masterState} setMasterState={setMasterState} rideDetail={rideDetail} rideHistory={rideHistory} />}
            </Stack.Screen>
            <Stack.Screen name="PaymentPage" options={{ presentation: "modal" }}>
                {props => <PaymentPage {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>
            <Stack.Screen name="FutureRides" options={{ presentation: "modal" }}>
                {props => <FutureRides {...props} masterState={masterState} setMasterState={setMasterState} rideDetail={rideDetail} setRideDetail={setRideDetail} />}
            </Stack.Screen>
            <Stack.Screen name="RideHistory" options={{ presentation: "modal" }}>
                {props => <RideHistory {...props} masterState={masterState} setMasterState={setMasterState} rideHistory={rideHistory} setRideHistory={setRideHistory} />}
            </Stack.Screen>
            <Stack.Screen name="PreferredDrivers" options={{ presentation: "modal" }}>
                {props => <PreferredDrivers {...props} masterState={masterState} setMasterState={setMasterState} rideDetail={rideDetail} setRideDetail={setRideDetail} />}
            </Stack.Screen>
            <Stack.Screen name="Chat" options={{ presentation: "modal" }}>
                {props => <Chat {...props} masterState={masterState} setMasterState={setMasterState} chatLog={chatLog} setChatLog={setChatLog} />}
            </Stack.Screen>

        </Stack.Navigator>
    );
}