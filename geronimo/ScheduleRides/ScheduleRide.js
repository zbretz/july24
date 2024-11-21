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
import PaymentPage from './PaymentPage';
import RideDetail from './RideDetail';
import ScheduleAirport from './ScheduleAirport';


const Stack = createStackNavigator();

export default ScheduleRide = ({ isConnected, masterState, setMasterState, chatLog, setChatLog }) => {

    const [rideDetail, setRideDetail] = useState(null)

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="RideType">
                {props => <RideType {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} />}
            </Stack.Screen>
            <Stack.Screen name="Airport">
                {props => <ScheduleAirport {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} />}
            </Stack.Screen>
            <Stack.Screen name="OtherAreas">
                {props => <ScheduleOtherAreas {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} />}
            </Stack.Screen>
            <Stack.Screen name="RideDetail" options={{ presentation: "modal" }}>
                {props => <RideDetail {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} />}
            </Stack.Screen>
            <Stack.Screen name="PaymentPage" options={{ presentation: "modal" }}>
                {props => <PaymentPage {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} />}
            </Stack.Screen>
            <Stack.Screen name="FutureRides" options={{ presentation: "modal" }}>
                {props => <FutureRides {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} rideDetail={rideDetail} setRideDetail={setRideDetail} />}
            </Stack.Screen>
            <Stack.Screen name="RideHistory" options={{ presentation: "modal" }}>
                {props => <RideHistory {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} rideDetail={rideDetail} setRideDetail={setRideDetail} />}
            </Stack.Screen>
            <Stack.Screen name="Chat" options={{ presentation: "modal" }}>
                {props => <Chat {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} chatLog={chatLog} setChatLog={setChatLog} />}
            </Stack.Screen>

        </Stack.Navigator>
    );
}