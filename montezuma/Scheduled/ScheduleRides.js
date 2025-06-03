import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScheduleRideOpenRequests from './ScheduleRideOpenRequests';
import ScheduleRideMyRides from './ScheduleRideMyRides';
import ScheduleRideHistory from './ScheduleRideHistory';
import ScheduleRideDetail from './ScheduleRideDetail';
import DirectBookingDetail from './DirectBookingDetail';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from '../Chat';



const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export default ScheduleRides = ({ navigation, isConnected, masterState, setMasterState, newScheduledRides, setNewScheduledRides, myScheduledRides, setMyScheduledRides, rideTakenModal, setRideTakenModal }) => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="ScheduleTabs"
                options={{
                    animationEnabled: true,
                }}
            >
                {props => <ScheduleTabs {...props} isConnected={isConnected} masterState={masterState} newScheduledRides={newScheduledRides} myScheduledRides={myScheduledRides} setMyScheduledRides={setMyScheduledRides} />}
            </Stack.Screen>

            <Stack.Screen name="ScheduleRideDetail"
                options={{
                    presentation: "modal",
                }}
            >
                {props => <ScheduleRideDetail {...props} isConnected={isConnected} masterState={masterState} setMasterState={setMasterState} rideTakenModal={rideTakenModal} setRideTakenModal={setRideTakenModal} />}
            </Stack.Screen>

            <Stack.Screen name="DirectBookingDetail"
                options={{
                    presentation: "modal",
                }}
            >
                {props => <DirectBookingDetail {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="Chat"
                options={{
                    presentation: "modal",
                }}
            >
                {props => <Chat {...props} isConnected={isConnected} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

        </Stack.Navigator>

    )

}



const ScheduleTabs = ({ navigation, isConnected, masterState, newScheduledRides, setNewScheduledRides, myScheduledRides, setMyScheduledRides }) => {

    return (

        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    marginBottom: Platform.OS == 'ios' ? -20 : 0,
                    paddingTop: 8,
                    backgroundColor: '#ddd',
                }
            }}
        >
            <Tab.Screen name="Open Requests"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12, bottom: 0 }}>Open Requests</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <Feather name="circle" size={22} color="#666" />
                        )
                    }
                }}
            >
                {props => <ScheduleRideOpenRequests {...props} masterState={masterState} isConnected={isConnected} newScheduledRides={newScheduledRides} setNewScheduledRides={setNewScheduledRides} myScheduledRides={myScheduledRides} setMyScheduledRides={setMyScheduledRides} />}
            </Tab.Screen>

            <Tab.Screen name="My Rides"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12 }}>My Rides</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <Feather name="check-circle" size={22} color="#666" />)
                    }
                }}
            >
                {props => <ScheduleRideMyRides {...props} masterState={masterState} isConnected={isConnected} newScheduledRides={newScheduledRides} setNewScheduledRides={setNewScheduledRides} myScheduledRides={myScheduledRides} setMyScheduledRides={setMyScheduledRides} />}
            </Tab.Screen>

            <Tab.Screen name="History"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12 }}>History</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <MaterialIcons name="history" size={27} marginBottom={-2} color="#666" />)
                    }
                }}
            >
                {props => <ScheduleRideHistory {...props} masterState={masterState} isConnected={isConnected} newScheduledRides={newScheduledRides} setNewScheduledRides={setNewScheduledRides} />}
            </Tab.Screen>




        </Tab.Navigator>

    )
}