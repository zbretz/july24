import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';

import { formatInTimeZone } from "date-fns-tz";

import { socket } from '../socket';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ScheduleRideOpenRequests = ({ navigation, isConnected, masterState, }) => {

    const wallet = async (inc_dec) => {
        socket.emit('wallet_test', { inc_dec, amount: 12 })
        // setMasterState(masterState => {
        //     let myScheduledRides = [...masterState.myScheduledRides]
        //     myScheduledRides = myScheduledRides.filter(ride => ride._id !== rideDetail._id)
        //     return ({
        //         ...masterState, myScheduledRides,
        //     })
        // })
    }

    const { _id } = masterState.user

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            {/* <View>

                <TouchableOpacity onPress={() => { wallet('inc')}} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                    <Text>Wallet Test Inc</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { wallet('dec')}} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                    <Text>Wallet Test Dec</Text>
                </TouchableOpacity>

            </View> */}

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", textAlign: 'center', alignSelf: 'center' }}>Open Requests</Text>

            <ScrollView style={{ paddingTop: 0, paddingBottom: 70 }}>



                {/* <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ borderRadius: 40, padding: 8, paddingHorizontal: 10, marginHorizontal: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe5ea', justifyContent: 'space-around', alignSelf: 'flex-start', flexDirection: 'row' }} >
                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', marginRight: 10, fontWeight: '600' }}>Sign In</Text>
                    <AntDesign name="rightcircle" size={17} color="#ff99ad" />
                </TouchableOpacity> */}

                {masterState.directBookings.map((request, idx) => {
                    console.log('direct booking request: ', request._id)
                    return (
                        <TouchableOpacity key={idx} onPress={() => { navigation.navigate('DirectBookingDetail', {  bookingId: request._id }) }}
                            style={{
                                backgroundColor: '#ffe5ea', borderRadius: 40, margin: 10, padding: 20, paddingHorizontal:30,
                                shadowOpacity: 0.22,
                                shadowRadius: 8,
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                }
                            }}>
                            <Text style={{ fontSize: 20, color: '#99001f', fontWeight: '600', textAlign: 'center', marginBottom:10 }}>Direct Request</Text>
                            <Text style={{ fontSize: 18, }}>{request.user.firstName}</Text>
                            <Text style={{ fontSize: 18, }}>{formatInTimeZone(request.pickupDateTime, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                            <Text style={{ fontSize: 18, }}>From: {request.pickupAddress}</Text>
                            <Text style={{ fontSize: 18, }}>To: {request.dropoffAddress}</Text>
                        </TouchableOpacity>
                    )
                })}

                {masterState.newScheduledRides.map((request, idx) => {
                    return (
                        <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', { requestType: 'open', rideId: request._id }) }} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                            <Text>From: {request.pickupAddress}</Text>
                            <Text>To: {request.dropoffAddress}</Text>
                            {/* <Text>Requested: {formatInTimeZone(request.createdAt,'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text> */}
                        </TouchableOpacity>
                    )
                })}
                <View style={{ height: 70 }}></View>
            </ScrollView>


        </SafeAreaView>

    );

}