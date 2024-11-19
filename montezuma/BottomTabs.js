import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LocalRidesStack from './Local/LocalRidesStack';
import ScheduleRides from './Scheduled/ScheduleRides';
import Childcare from './Childcare';
import MyAccount from './MyAccount';

const Tab = createBottomTabNavigator();

export default BottomTabs = ({ navigation, isConnected, masterState, setMasterState, newLocalRides, setNewLocalRides, myLocalRides, setMyLocalRides, newScheduledRides, setNewScheduledRides, myScheduledRides, setMyScheduledRides, rideTakenModal, setRideTakenModal, removeLocalRide }) => {

    let showChildcare = masterState.user.firstName == "Zach"

    return (

        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    paddingTop: 8,
                    backgroundColor: '#bfbfbf',
                }
            }}
        >



            <Tab.Screen name="LocalRides"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12 }}>Local</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <Entypo name="location" size={24} color="#666" />
                        )
                    }
                }}
            >
                {props => <LocalRidesStack {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} newLocalRides={newLocalRides} setNewLocalRides={setNewLocalRides} myLocalRides={myLocalRides} setMyLocalRides={setMyLocalRides} removeLocalRide={removeLocalRide} />}
            </Tab.Screen>


            <Tab.Screen name="ScheduleRides"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12 }}>Scheduled</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <FontAwesome name="calendar-o" size={24} color={"#666"} />
                        )
                    }
                }}
            >
                {props => <ScheduleRides {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} newScheduledRides={newScheduledRides} setNewScheduledRides={setNewScheduledRides} myScheduledRides={myScheduledRides} setMyScheduledRides={setMyScheduledRides} rideTakenModal={rideTakenModal} setRideTakenModal={setRideTakenModal} />}
            </Tab.Screen>




            <Tab.Screen name="Account"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12 }}>Account</Text>
                        )
                    }, tabBarIcon: () => {
                        return (
                            <Ionicons name="person-outline" size={32} tabBarIconStyle={{ margin: 16 }} color={"#666"} />
                        )
                    }
                }}
            >
                {props => <MyAccount {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Tab.Screen>


            {showChildcare &&
                <Tab.Screen name="Childcare"
                    options={{
                        tabBarLabel: ({ focused }) => {
                            return (
                                <Text style={{ color: focused ? '#fff' : '#666', fontWeight: 500, fontSize: 12 }}>Childcare</Text>
                            )
                        }, tabBarIcon: () => {
                            return (
                                <MaterialCommunityIcons name="baby-bottle-outline" size={28} tabBarIconStyle={{ margin: 16 }} color={"#666"} />
                            )
                        }
                    }}
                >
                    {props => <Childcare {...props} masterState={masterState} setMasterState={setMasterState} />}
                </Tab.Screen>
            }


        </Tab.Navigator>

    )
}