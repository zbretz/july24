import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocalRidesNew from './LocalRidesNew';
import LocalRideDetail from './LocalRideDetail';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



const Stack = createStackNavigator();


export default LocalRidesStack = ({ isConnected, masterState, setMasterState, newLocalRides, setNewLocalRides, myLocalRides, setMyLocalRides, removeLocalRide }) => {

    const [rideDetail, setRideDetail] = useState(null)

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

            <Stack.Screen name="LocalRidesNew"
                options={{
                    animationEnabled: false,
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#DDB3B4' : '#666', fontWeight: 500, fontSize: 12 }}>Schedule Ride</Text>
                        )
                    },
                    tabBarIcon: () => {
                        return (
                            <Ionicons name="fast-food-outline" size={32} tabBarIconStyle={{ margin: 16 }} color={"#666"} />
                        )
                    }
                }}
            >
                {props => <LocalRidesNew {...props} isConnected={isConnected} masterState={masterState} newLocalRides={newLocalRides} setNewLocalRides={setNewLocalRides} myLocalRides={myLocalRides} setMyLocalRides={setMyLocalRides} rideDetail={rideDetail} setRideDetail={setRideDetail}/>}
            </Stack.Screen>


            <Stack.Screen name="LocalRideDetail"
                options={{
                    presentation: "modal",
                    tabBarLabel: ({ focused }) => {
                        return (
                            <Text style={{ color: focused ? '#DDB3B4' : '#666', fontWeight: 500, fontSize: 12 }}>Rides</Text>
                        )
                    }, tabBarIcon: () => {
                        return (
                            <Ionicons name="list" size={32} tabBarIconStyle={{ margin: 16 }} color={"#666"} />
                        )
                    }
                }}
            >
                {props => <LocalRideDetail {...props} isConnected={isConnected} masterState={masterState} setMasterState={setMasterState} myLocalRides={myLocalRides} setMyLocalRides={setMyLocalRides} removeLocalRide={removeLocalRide} rideDetail={rideDetail} setRideDetail={setRideDetail} />}
            </Stack.Screen>



        </Stack.Navigator>
    );
}


