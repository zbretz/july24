import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Entypo, Feather, Octicons, FontAwesome6, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { socket } from '../socket';

import { formatInTimeZone } from "date-fns-tz";
import { add } from "date-fns";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default LocalRidesDetail = ({ navigation, isConnected, masterState, setMasterState, newLocalRides, setNewLocalRides, rideDetail, setRideDetail, myLocalRides, setMyLocalRides, removeLocalRide }) => {

    // console.log('local ride detail :', removeLocalRide)
    console.log('local ride detail: ', rideDetail)

    let { user } = masterState

    const acceptLocalRide = (eta) => {
        let driver = { _id: user._id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, venmo: user.venmo, vehicleMake: user.vehicleMake, vehicleModel: user.vehicleModel, licensePlate: user.licensePlate, expoPushToken: user.expoPushToken, stripe_transfers_enabled: user.stripe_transfers_enabled, stripe_account: user.stripe_account }
        let updateRideDetail = { ...rideDetail, driver: driver }

        setRideDetail({ ...rideDetail, driver: driver })
        setMasterState(masterState => {
            let myLocalRides = [...masterState.myLocalRides, updateRideDetail]
            return {
                ...masterState, myLocalRides
            }
        })

        arrival_time = eta == 10 ? add(new Date(), { minutes: 10 }) : add(new Date(), { minutes: 20 })

        socket.emit('accept_local_ride', { ...updateRideDetail, eta: arrival_time })
    }

    const completeLocalRide = async () => {
        socket.emit('complete_local_ride', { ...rideDetail }, () => {
            setMasterState(masterState => {
                let myLocalRides = masterState.myLocalRides.filter(ride => ride._id !== rideDetail._id)//[...masterState.myLocalRides, rideDetail]
                return {
                    ...masterState, myLocalRides
                }
            })
            navigation.goBack()
        })
    }

    useFocusEffect(

        () => {
            if (removeLocalRide?.driver?._id !== user._id && removeLocalRide?._id === rideDetail._id) {
                // if (  removeLocalRide?._id === rideDetail._id){
                console.log('THONG: ', removeLocalRide?.driver?._id, user._id)
                navigation.goBack()
            }
        }

    );

    return (

        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            <TouchableOpacity style={{ top: 40, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
                <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={36} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", margin: 20, textAlign: 'center' }}>Detail</Text>

            <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 10, padding: 10 }}>
                <Text>From: {rideDetail.pickupAddress}</Text>
                <Text>To: {rideDetail.dropoffAddress}</Text>
                <Text>Requested: {formatInTimeZone(rideDetail.createdAt, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                {/* <Text>rideDetail._id: {rideDetail._id}</Text> */}
                {rideDetail.driver &&
                    <>
                        <Text>Passenger: {rideDetail.user.firstName}</Text>
                        <Text>Phone: {rideDetail.user.phone}</Text>
                        
                    </>
                }
            </View>

            {!rideDetail.driver ?

                <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 10, padding: 10, alignItems: 'center' }}>


                    <Text>Accept Ride</Text>
                    <Text>The absolute maximum arrival time to pickup is 20 minutes. A pickup later than that will be a free ride at driver's expense.</Text>


                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => acceptLocalRide(10)} style={{ backgroundColor: '#ddd', padding: 10, margin: 10, borderRadius: 10 }}>
                            <Text>10 mins</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => acceptLocalRide(20)} style={{ backgroundColor: '#ddd', padding: 10, margin: 10, borderRadius: 10 }}>
                            <Text>20 mins</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                :
                <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 10, padding: 10, alignItems: 'center' }}>

                    <Text>Ride Complete</Text>


                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => completeLocalRide()} style={{ backgroundColor: '#ddd', padding: 10, margin: 10, borderRadius: 10 }}>
                            <Text>Complete</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            }






        </SafeAreaView>

    );
}

