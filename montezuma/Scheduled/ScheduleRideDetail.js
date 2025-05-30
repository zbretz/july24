import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, Linking, Modal, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { socket } from '../socket';
import { useFocusEffect } from '@react-navigation/native';
import CallDriverButton from './CallDriverButton';

import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ScheduleRideDetail = ({ navigation, route, isConnected, masterState, setMasterState, rideTakenModal, setRideTakenModal }) => {


    // let driver = { identifier:'DriverName', rating:'5million', firstName:'Zach', lastName:'Bretz', plateNumber:'123ABC',Vehicle:'Chevy Suburban', color:'White'}
    const { user } = masterState
    const { requestType, rideId } = route.params;

    // console.log('schedule ride detail: ', requestType, rideId)
    // console.log('new scheduled rides: ', masterState.newScheduledRides)

    let rideDetail = requestType == 'open' ? masterState.newScheduledRides.find(ride => ride._id == rideId) : masterState.myScheduledRides.find(ride => ride._id == rideId)

    const enRouteScheduledRide = async () => {
        socket.emit('en_route_scheduled_ride', { ...rideDetail, enRoute: true })
        setMasterState(masterState => {
            let myScheduledRides = [...masterState.myScheduledRides]
            for (const ride of myScheduledRides) {
                if (ride._id === rideDetail._id) {
                    ride.enRoute = true
                }
            }
            return ({
                ...masterState, myScheduledRides,
            })
        })
    }

    const acceptScheduleRide = async () => {
        socket.emit('accept_scheduled_ride', { ...rideDetail, driver: { _id: user._id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, venmo: user.venmo, vehicleMake: user.vehicleMake, vehicleModel: user.vehicleModel, licensePlate: user.licensePlate, expoPushToken: user.expoPushToken, stripe_transfers_enabled: user.stripe_transfers_enabled, stripe_account: user.stripe_account } })
        setMasterState(masterState => {
            let newScheduledRides = masterState.newScheduledRides.filter(ride => ride._id !== rideDetail._id)
            let myScheduledRides = [...masterState.myScheduledRides, { ...rideDetail, driver: user }]
            return ({
                ...masterState, myScheduledRides, newScheduledRides
            })
        })
        navigation.navigate('My Rides')
    }

    const completeScheduledRide = async () => {
        Alert.alert('Ride Complete', 'This ride ended with a successful dropoff.', [
            {
                text: 'Go Back',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Yes, Completed', onPress: () => {
                    socket.emit('complete_scheduled_ride', { ...rideDetail, rideCompleted: true })
                    setMasterState(masterState => {
                        let myScheduledRides = [...masterState.myScheduledRides]
                        myScheduledRides = myScheduledRides.filter(ride => ride._id !== rideDetail._id)
                        return ({
                            ...masterState, myScheduledRides,
                        })
                    })
                }
            },
        ]);
    }

    const checkIn = async () => {

        const currentTime = new Date()

        setMasterState(masterState => {
            let myScheduledRides = [...masterState.myScheduledRides]
            for (const ride of myScheduledRides) {
                if (ride._id === rideDetail._id) {
                    ride.checkedIn = currentTime
                }
            }
            return ({
                ...masterState, myScheduledRides,
            })
        })

        //use a calback and a loading indicator for confidence that this works
        socket.emit('driver_check_in', { checkedIn: currentTime, rideDetail })
    }

    //if ride canceled, close out of detail view
    useEffect(() => {
        if (!rideDetail) navigation.goBack()
    }, [rideDetail])
    if (!rideDetail) { return null }




    // display 'en route' button to driver
    let timeDiff = new Date(rideDetail.pickupDateTime).getTime() - new Date()
    let hoursUntilPickup = Math.floor(timeDiff / 1000 / 60 / 60)
    let displayEnRoute = hoursUntilPickup < 3

    let minutesUntilPickup = Math.floor(timeDiff / 1000 / 60)
    let displayCheckIn = minutesUntilPickup < 90 && !rideDetail.checkedIn

    let request = rideDetail
    let chatLog = rideDetail.chatLog

    let rideTypes = {
        1: 'Standard',
        2: 'Premium',
        3: 'XL',
        4: 'Premium XL'
    }

    let rideTypeText = rideTypes[request.rideType]




    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            {request.driver && displayCheckIn &&
                <View style={{
                    zIndex: 1, right: 10, top: 10, borderColor: '#ff99ad', borderWidth: 4, position: 'absolute', alignSelf: 'flex-start', alignItems: 'center', padding: 8, backgroundColor: '#fff5f7', borderRadius: 18,
                    shadowOpacity: 0.38,
                    shadowRadius: 8,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                }} >
                    <Text style={{ fontSize: 22, fontWeight: 500, color: '#000', marginLeft: 0 }}>Check-In</Text>
                    <View style={{ borderBottomWidth: 1, width: '100%', borderBottomColor: '#ff99ad', }} />
                    <Text style={{ fontSize: 18, fontWeight: 400, color: '#000', margin: 8 }}>Ride is On Track</Text>
                    <TouchableOpacity onPress={checkIn} style={{ backgroundColor: '#d2d2d2', margin: 4, padding: 12, paddingHorizontal: 20, borderRadius: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 500 }}>Yes</Text>
                    </TouchableOpacity>
                </View>

            }

            <Modal
                transparent={true}
                visible={rideTakenModal}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', alignSelf: 'center', }}>

                    <TouchableOpacity onPress={() => { setRideTakenModal(false); navigation.goBack() }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                    <View style={{ padding: 20, margin: 20, backgroundColor: '#ddd', alignItems: 'center', borderRadius: 20 }}>
                        {/* <Text>sdkjnkjsdfnjkdsf</Text> */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end', paddingRight: 25, position: 'absolute', top: 20, right: -10 }} onPress={() => { setRideTakenModal(false); navigation.goBack() }}>
                            <AntDesign name="closecircleo" size={24} color="#353431" />
                        </TouchableOpacity>
                        <View style={{ marginTop: 0, padding: 30, borderRadius: 30 }}>
                            <Text style={{ color: '#000', fontSize: 16, fontWeight: '400', textAlign: 'center' }}>Sorry, this ride has been removed.</Text>
                        </View>

                    </View>

                </View>
            </Modal>


            <TouchableOpacity style={{ top: 40, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
                <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={36} color="black" />
            </TouchableOpacity>

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", margin: 10, textAlign: 'center' }}>Detail</Text>

            <View style={{ backgroundColor: '#e6e6e6', borderRadius: 20, margin: 10, padding: 20 }}>

                {request.checkedIn &&
                    <View style={{ position: 'absolute', top: 0, right: 10, padding: 8, borderRadius: 18, marginTop: 10, backgroundColor: '#fff' }} >
                        <Feather name="check-circle" size={24} color="#ff99ad" />
                    </View>
                }

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

                {request.flightNumber &&
                    <Text style={{ marginTop: 10 }}>Flight number: <Text style={{ fontWeight: '600' }}>{request.flightNumber}</Text> </Text>
                }
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{}}>Fare: ${request.fare} ({rideTypeText})</Text>
                    {request.paid &&
                        <View style={{ backgroundColor: '#000', flexDirection: 'row', borderRadius: 10, padding: 2, top: -2, paddingLeft: 6, marginLeft: 6, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff' }}>paid</Text>
                            <FontAwesome5 name="check" size={16} style={{ marginRight: 6, marginLeft: 6 }} color="#fff" />
                        </View>
                    }
                </View>
            </View>

            {(request.rideCanceledByDriver || request.rideCanceledByRider) ?
                <View style={{ backgroundColor: 'red', borderWidth: 0, borderRadius: 10, margin: 10, padding: 10, alignItems: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 18, }}>Ride Canceled</Text>
                </View>


                :

                <>


                    {!request.driver &&
                        <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 10, padding: 10, alignItems: 'center' }}>

                            <View style={{}}>
                                <TouchableOpacity onPress={acceptScheduleRide} style={{ backgroundColor: '#ddd', padding: 10, margin: 10, borderRadius: 10 }}>
                                    <Text>Accept Ride</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    }

                    {request.driver &&
                        <>

                            {chatLog.length ?
                                <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId }) }} style={{ backgroundColor: '#f2f2f2', borderRadius: 10, borderWidth: 0, borderColor: '#c4a73b', margin: 10, padding: 10 }} >


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
                                <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId }) }} style={{ backgroundColor: '#f2f2f2', height: 56, borderRadius: 10, borderWidth: 0, margin: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                                    <Entypo name="chat" size={24} color="black" style={{ marginRight: 20 }} />
                                    <Text style={{ color: '#000', fontSize: 18, }}>Message User...</Text>
                                </TouchableOpacity>
                            }
                        </>
                    }

                    {/* <Text>{hoursUntilPickup}</Text> */}

                    {request.driver &&

                        <>
                            {displayEnRoute &&
                                <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 0, padding: 10, alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        {request.enRoute ?
                                            <View style={{ alignItems: 'center' }}>
                                                <Text>En Route</Text>
                                                <View style={{ backgroundColor: '#fff', padding: 10, margin: 0, borderRadius: 10, flexDirection: 'row' }}>
                                                    <FontAwesome5 name="check-circle" size={16} style={{ marginRight: 6 }} color="black" />
                                                    <Text>Notified</Text>
                                                </View>
                                            </View>
                                            :
                                            <TouchableOpacity onPress={enRouteScheduledRide} style={{ backgroundColor: '#ffcf56', padding: 10, margin: 10, borderRadius: 10, }}>
                                                <Text style={{ fontSize: 20, }}>En Route</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            }


                            {request.paid &&
                                <View style={{ borderColor: '#000', borderWidth: 0, borderRadius: 20, margin: 0, padding: 10, alignItems: 'center' }}>
                                    <Text>Ride Complete</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {request.rideCompleted ?
                                            <View style={{ backgroundColor: '#fff', padding: 10, margin: 10, borderRadius: 10, flexDirection: 'row' }}>
                                                <FontAwesome5 name="check-circle" size={16} style={{ marginRight: 6 }} color="black" />
                                                <Text>Completed</Text>
                                            </View>
                                            :
                                            <TouchableOpacity onPress={completeScheduledRide} style={{ backgroundColor: '#ddd', padding: 10, margin: 10, borderRadius: 10 }}>
                                                <Text>Complete</Text>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            }

                            {request.paid &&
                                <View style={{ backgroundColor: '#fff', padding: 10, margin: 10, borderRadius: 10, flexDirection: 'row' }}>
                                    <FontAwesome5 name="check-circle" size={16} style={{ marginRight: 6 }} color="black" />
                                    <Text>Ride Paid</Text>
                                </View>
                            }

                        </>
                    }

                </>



            }

            {request.driver &&
                <CallDriverButton style={{ position: 'absolute', borderRadius: 20, bottom: 90, right: 20, }}
                    rideId={rideId}
                    pickupDateTime={rideDetail.pickupDateTime}
                />
            }

        </SafeAreaView>

    );
}






