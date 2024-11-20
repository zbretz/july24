import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import MyAccount from '../Account/MyAccount'

const Tab = createBottomTabNavigator();

export default BottomTabs = ({ isConnected, masterState, setMasterState, chatLog, setChatLog, localRideRequest, setLocalRideRequest }) => {

    return (

        <Tab.Navigator
            screenOptions={({ route }) => {
                return {
                    headerShown: false,
                    tabBarStyle: {
                        // paddingTop: 8,
                        // backgroundColor: route.name === 'Account' && !masterState.user ? '#ffcf56' : '#fff',
                        // borderTopWidth: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Adjust the transparency as needed
                        position: 'absolute', // Important for the translucent effect
                        bottom: 0,
                        left: 0,
                        right: 0,
                        elevation: 0,
                        borderTopWidth: 0,
                    }

                }
            }}
        >

            <Tab.Screen name="AppContent"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{fontFamily:'Aristotelica-SmallCaps', marginBottom:-6, color: focused ? '#55c1ff' : '#1E201F', fontWeight: 500, fontSize: 14 }}>Home</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <AntDesign name="home" size={32} color="#1E201F" />
                            // <Ionicons name="home" size={32} tabBarIconStyle={{ margin: 16 }} color={"#666"} />
                        )
                    }
                }}
            >
                {props => <Home {...props} isConnected={isConnected} masterState={masterState} setMasterState={setMasterState} chatLog={chatLog} setChatLog={setChatLog} localRideRequest={localRideRequest} setLocalRideRequest={setLocalRideRequest} />}
            </Tab.Screen>

            <Tab.Screen name="Account"
                options={{
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{fontFamily:'Aristotelica-SmallCaps', marginBottom:-6, color: focused ? '#55c1ff' : '#1E201F', fontWeight: 500, fontSize: 14 }}>Account</Text>
                        )
                    }, tabBarIcon: () => {
                        return (
                            <Ionicons name="person-outline" size={32} tabBarIconStyle={{ margin: 16 }} color={"#1E201F"} />
                        )
                    }
                }}
            >
                {props => <MyAccount {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} />}
            </Tab.Screen>

        </Tab.Navigator>

    )
}