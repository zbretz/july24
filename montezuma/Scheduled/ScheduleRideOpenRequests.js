import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';

import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ScheduleRideOpenRequests = ({ navigation, isConnected, masterState,  }) => {


    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            {/* <TouchableOpacity style={{ top: 40, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
                <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={36} color="black" />
            </TouchableOpacity> */}

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", margin: 20, textAlign: 'center' }}>Open Requests</Text>



            {/* {[1].map(request => { */}
            {masterState.newScheduledRides.map((request, idx) => {
               console.log('blurgh: ', request)
                return (
                    <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', {requestType:'open', rideId: request._id}) }} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                        <Text>From: {request.pickupAddress}</Text>
                        <Text>To: {request.dropoffAddress}</Text>
                        {/* <Text>Requested: {formatInTimeZone(request.createdAt,'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text> */}
                        {/* <TouchableOpacity  style={{backgroundColor:'#ddd', padding:10, margin:10}}>
                <Text>Accept ride</Text>
            </TouchableOpacity> */}
                    </TouchableOpacity>
                )
            })}



        </SafeAreaView>

    );

}