import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, Linking, Modal, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { socket } from '../socket';
import { useFocusEffect } from '@react-navigation/native';
import CallDriverButton from './CallDriverButton';

import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default DirectBookingDetail = ({ navigation, route, masterState, setMasterState }) => {

    // return null

    const { user } = masterState
    const { bookingId } = route.params;

    console.log('booking: ', bookingId)


    let booking = masterState.directBookings.find(booking => booking._id == bookingId)


    const acceptBooking = async () => {
        socket.emit('accept_scheduled_ride', { ...booking, driver: { _id: user._id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, venmo: user.venmo, vehicleMake: user.vehicleMake, vehicleModel: user.vehicleModel, licensePlate: user.licensePlate, expoPushToken: user.expoPushToken, stripe_transfers_enabled: user.stripe_transfers_enabled, stripe_account: user.stripe_account } })
        setMasterState(masterState => {
            let newScheduledRides = masterState.newScheduledRides.filter(ride => ride._id !== booking._id)
            let myScheduledRides = [...masterState.myScheduledRides, { ...booking, driver: user }]
            return ({
                ...masterState, myScheduledRides, newScheduledRides
            })
        })
    }

    // const completeScheduledRide = async () => {
    //     Alert.alert('Ride Complete', 'This ride ended with a successful dropoff.', [
    //         {
    //             text: 'Go Back',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel',
    //         },
    //         {
    //             text: 'Yes, Completed', onPress: () => {
    //                 socket.emit('complete_scheduled_ride', { ...booking, rideCompleted: true })
    //                 setMasterState(masterState => {
    //                     let myScheduledRides = [...masterState.myScheduledRides]
    //                     myScheduledRides = myScheduledRides.filter(ride => ride._id !== booking._id)
    //                     return ({
    //                         ...masterState, myScheduledRides,
    //                     })
    //                 })
    //             }
    //         },
    //     ]);
    // }

    // const checkIn = async () => {

    //     const currentTime = new Date()

    //     setMasterState(masterState => {
    //         let myScheduledRides = [...masterState.myScheduledRides]
    //         for (const ride of myScheduledRides) {
    //             if (ride._id === booking._id) {
    //                 ride.checkedIn = currentTime
    //             }
    //         }
    //         return ({
    //             ...masterState, myScheduledRides,
    //         })
    //     })

    //     //use a calback and a loading indicator for confidence that this works
    //     socket.emit('driver_check_in', { checkedIn: currentTime, booking })
    // }

    //if ride canceled, close out of detail view
    useEffect(() => {
        if (!booking) navigation.goBack()
    }, [booking])
    if (!booking) { return null }





    let request = booking
    let chatLog = booking.chatLog


    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>


            <TouchableOpacity style={{ top: 40, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
                <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={36} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", margin: 10, textAlign: 'center' }}>Detail</Text>

            <View style={{ backgroundColor: '#e6e6e6', borderRadius: 20, margin: 10, padding: 10 }}>



                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 6 }}>{request.user.firstName}</Text>
                <Text style={{ fontSize: 16, fontWeight: '600' }}>{formatInTimeZone(request.pickupDateTime, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>

                <View style={{ flexDirection: 'row', marginTop: 10, }}>
                    <View style={{ marginRight: -4, marginTop: -3 }}>
                        <Entypo style={{ marginLeft: -8, marginRight: 8 }} name="dot-single" size={24} color="black" />
                        <Feather style={{}} name="corner-down-right" size={17} color="black" />
                    </View>
                    <View>
                        <Text style={{ fontFamily: 'PointSoftLight' }}>{request.pickupAddress}</Text>
                        <Text style={{ marginTop: 6, fontFamily: 'PointSoftLight' }}>{request.dropoffAddress}</Text>
                    </View>
                </View>

                <View style={{ marginTop: 16 }}>
                    <Text style={{ fontWeight: '600', fontFamily: 'PointSoftLight' }}>Additional Info</Text>
                    <Text style={{ fontFamily: 'PointSoftLight' }}>{request.note}</Text>
                </View>


            </View>


            <>



                <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 10, padding: 10, alignItems: 'center' }}>

                    <View style={{}}>
                        <TouchableOpacity onPress={acceptBooking} style={{ backgroundColor: '#ddd', padding: 10, margin: 10, borderRadius: 10 }}>
                            <Text>Accept Ride</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                {chatLog.length ?
                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { bookingId }) }} style={{ backgroundColor: '#f2f2f2', borderRadius: 10, borderWidth: 0, borderColor: '#c4a73b', margin: 10, padding: 10 }} >


                        {/* {request.unreadMessageFromUser && <Text style={{ color: 'blue' }}>Unread Message</Text>} */}

                        {request.unreadMessageFromUser &&
                            <View style={{ marginTop: 0, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 4, backgroundColor: '#fff', borderRadius: 8, marginBottom: 14 }} >
                                <AntDesign name="mail" size={27} color="#ffb700" />
                                <Text style={{ fontSize: 16, fontWeight: 600, color: '#000', marginLeft: 8 }}>Unread Message</Text>
                            </View>
                        }

                        <View style={{ alignItems: 'center', flexDirection: 'row', padding: 10 }}>
                            <Entypo name="chat" size={24} color="black" style={{ marginRight: 20 }} />
                            <Text style={{ fontSize: 16, fontWeight: '600', color: "#000", marginBottom: 4 }}>User Chat</Text>
                        </View>
                        <View style={{ borderRadius: 20, borderWidth: 1, backgroundColor: '#fff' }}>
                            {/* <Text style={{ margin: 10 }} numberOfLines={2}>test test test test</Text> */}
                            <Text style={{ margin: 10 }} numberOfLines={2}>{chatLog[chatLog.length - 1].text}</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { bookingId }) }} style={{ backgroundColor: '#f2f2f2', height: 56, borderRadius: 10, borderWidth: 0, margin: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                        <Entypo name="chat" size={24} color="black" style={{ marginRight: 20 }} />
                        <Text style={{ color: '#000', fontSize: 18, }}>Message User...</Text>
                    </TouchableOpacity>

                }



            </>



            <CallDriverButton style={{ position: 'absolute', borderRadius: 20, bottom: 90, right: 20, }}
                bookingId={bookingId}
                pickupDateTime={booking.pickupDateTime}
            />


        </SafeAreaView>

    );
}






