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

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", textAlign: 'center', position: 'absolute', top: 80, alignSelf: 'center' }}>Open Requests</Text>

            <ScrollView style={{ paddingTop: 60, paddingBottom: 70 }}>
                {/* {[1].map(request => { */}
                {masterState.newScheduledRides.map((request, idx) => {
                    const preferredDrivers = request.preferredDrivers.map(driver => driver._id)
                    console.log('blurgh: ', preferredDrivers)

                    // let timeDiff = new Date(request.datetimeOfRequest).getTime() - new Date()
                    let timeDiff = new Date() - new Date(request.datetimeOfRequest).getTime() // 1732645683000
                    let timeDiffHours = Math.floor(timeDiff / 1000 / 60 / 60)
                    let displayToAll = timeDiffHours > 2

                    if (preferredDrivers.includes(_id) || displayToAll) {

                        return (
                            <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', { requestType: 'open', rideId: request._id }) }} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                                <Text>From: {request.pickupAddress}</Text>
                                <Text>To: {request.dropoffAddress}</Text>
                                {preferredDrivers.includes(_id) &&
                                    <View style={{ backgroundColor: '#5686ff', padding: '4', alignSelf: 'flex-start', borderRadius: 4, marginTop: 4 }}>
                                        <Text style={{ color: '#fff', fontWeight: 600 }}>You're preferred</Text>
                                    </View>
                                }
                                <Text>Requested: {formatInTimeZone(request.datetimeOfRequest, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                            </TouchableOpacity>
                        )
                    }

                    else {
                        return null
                    }


                    // return (
                    //     <>
                    //         {

                    //             (preferredDrivers.includes(_id) || displayToAll) &&


                    //             <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', { requestType: 'open', rideId: request._id }) }} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                    //                 <Text>From: {request.pickupAddress}</Text>
                    //                 <Text>To: {request.dropoffAddress}</Text>
                    //                 {preferredDrivers.includes(_id) &&
                    //                     <View style={{ backgroundColor: '#5686ff', padding: '4', alignSelf: 'flex-start', borderRadius: 4, marginTop: 4 }}>
                    //                         <Text style={{ color: '#fff', fontWeight: 600 }}>You're preferred</Text>
                    //                     </View>
                    //                 }
                    //                 <Text>Requested: {formatInTimeZone(request.datetimeOfRequest, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                    //             </TouchableOpacity>
                    //         }
                    //     </>

                    // )
                })}
                <View style={{ height: 70 }}></View>
            </ScrollView>




            {/* <ScrollView style={{ paddingTop: 60, paddingBottom: 70 }}>
                {masterState.newScheduledRides.map((request, idx) => {
                    const preferredDrivers = request.preferredDrivers.map(driver => driver._id)
                    console.log('blurgh: ', preferredDrivers)




                    // let timeDiff = new Date(request.datetimeOfRequest).getTime() - new Date()
                    let timeDiff = new Date(1732560514000).getTime() - new Date()
                    let hoursUntilPickup = Math.floor(timeDiff / 1000 / 60 / 60)
                    let displayClock = hoursUntilPickup < 2

                    return (
                        <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', { requestType: 'open', rideId: request._id }) }} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                            <Text>From: {request.pickupAddress}</Text>
                            <Text>To: {request.dropoffAddress}</Text>
                            {preferredDrivers.includes(_id) && displayClock &&
                                <View style={{ backgroundColor: '#5686ff', padding: '4', alignSelf: 'flex-start', borderRadius: 4, marginTop: 4 }}>
                                    <Text style={{ color: '#fff', fontWeight: 600 }}>You're preferred</Text>
                                </View>
                            }
                            <Text>Requested: {formatInTimeZone(request.datetimeOfRequest, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                        </TouchableOpacity>
                    )
                })}
                <View style={{ height: 70 }}></View>
            </ScrollView> */}



        </SafeAreaView>

    );

}