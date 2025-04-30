import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, SafeAreaView, Alert, Linking } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, Octicons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import { socket } from '../CoreNav/socket';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default RideDetail = ({ route, isConnected, masterState, navigation, rideHistory }) => {

    const { rideId, type } = route.params;
    let rideDetail;

    if (type == "history") {
        rideDetail = rideHistory.find(ride => ride._id == rideId)
    } else {
        rideDetail = masterState.user.activeRides.length ? masterState.user.activeRides.find(ride => ride._id == rideId) : null
    }

    const chatLog = rideDetail?.chatLog


    // const cancelRide = () => {
    //     Alert.alert('Cancel Ride',
    //         `
    // Please call or text Zach
    // 917-575-1955
    // and he will handle your cancellation.
    // Thank you!`, [
    //         {
    //             text: 'Accept', onPress: () => {
    //             }
    //         },
    //     ])
    // }


    // const cancelRide = () => {
    //     socket.emit('cancel_scheduled_ride', { ...rideDetail, rideCanceledByRider: true }, (status) => {
    //         if (status === 'success') {
    //             console.log('success cancel')
    //             Alert.alert('Ride Canceled', 'Your ride has been canceled successfully. See you the next time.');
    //         }
    //     })
    // }


    // (rideid) => {

    //     rideRequest = { ...rideRequest, _id: rideid }
    //     let activeRides = masterState.user.activeRides.length ? [...masterState.user.activeRides, rideRequest] : [rideRequest]
    //     setMasterState(masterState => { return { ...masterState, user: { ...masterState.user, activeRides } } })
    //     completeAction()
    // }

    const needHelp = () => {
        Alert.alert('Phone Support',
            `Press "Call" for phone support!`, [
            {
                text: 'Back', onPress: () => {
                }
            },
            {
                text: 'Call', onPress: () => {
                    Linking.openURL(`tel:${9175751955}`)
                }
            },
        ])
    }

    console.log('ride detail screen: ', rideDetail)

    if (!rideDetail) { navigation.goBack(); return null }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            <TouchableOpacity style={{ position: 'absolute', top: -10, right: -10, zIndex: 11, padding: 30, }} onPress={() => navigation.goBack()}>
                <Feather style={{ marginBottom: 0 }} name="x" size={24} color="black" />
            </TouchableOpacity>



            <View style={{ paddingHorizontal: 20, width: '100%', marginTop: 40 }}>

                <View style={{
                    marginVertical: 10,
                    backgroundColor: '#e6e6e6',
                    borderRadius: 30,
                    padding: 20
                }}>


                    {rideDetail.enRoute ?
                        <View style={{ alignItems: 'center', }}>
                            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontSize: 36, fontFamily: 'LexendRegular', textAlign: 'center' }}>Status: Driver En Route</Text>
                        </View>
                        :
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ marginVertical: 0, fontSize: 26, fontFamily: 'LexendMedium', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "eee',' MMMM d")}</Text>
                            <Text style={{ marginVertical: 0, fontSize: 26, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>
                        </View>
                    }


                    {rideDetail.driver &&
                        <View style={{ borderTopRightRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center', marginVertical: 10 }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text numberOfLines={1} style={{ fontSize: 18, fontFamily: 'LexendRegular', }}>Driver Assigned  </Text>
                                    <Image style={{ height: 26, width: 26, marginTop: -10 }} source={require('../assets/verified.png')} />
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.driver.firstName}</Text>
                                </View>
                            </View>
                        </View>
                    }


                    <View style={{ borderTopRightRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center' }}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, }}>
                            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'LexendRegular', }}>Pickup</Text>
                            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.pickupAddress}</Text>
                            <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'LexendRegular', }}>Dropoff</Text>
                            <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.dropoffAddress}</Text>
                        </View>
                    </View>



                    <View style={{ marginTop: 10, }}>




                        {rideDetail.driver && type !== "history"?
                            <>
                                {chatLog.length ?
                                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffcf56', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 20, }} >
                                        <Text style={{ marginHorizontal: 10, fontSize: 24, color: "#000", fontFamily: 'Aristotelica-SmallCaps' }}>Driver Chat</Text>
                                        <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 20, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'PointSoftLight', fontSize: 18, backgroundColor: '#fff', }} numberOfLines={2}>{chatLog[chatLog.length - 1].text}</Text>
                                            <Entypo name="chat" size={32} color="black" style={{ marginRight: 20 }} />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffcf56', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 20, }} >
                                        <Text style={{ marginHorizontal: 10, fontSize: 24, color: "#000", fontFamily: 'Aristotelica-SmallCaps' }}>Driver Chat</Text>
                                        <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 20, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: '#a1a1a1', fontSize: 18, fontFamily: 'LexendMedium', }}>Message Driver ...</Text>
                                            <Entypo name="chat" size={32} color="black" style={{ marginRight: 20 }} />
                                        </View>
                                    </TouchableOpacity>
                                }
                            </>
                            :
                            null
                        }


                        {!rideDetail.paid ?
                            <TouchableOpacity onPress={() => { navigation.navigate('PaymentPage', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffcf56', padding: 20, borderRadius: 20, borderWidth: 0, marginTop: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }} >
                                <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-SmallCaps', marginBottom: -6 }}>Complete Payment</Text>
                                <FontAwesome5 name="money-check" size={24} style={{ marginRight: 20 }} color="black" />
                            </TouchableOpacity>
                            :
                            <View style={{ backgroundColor: '#e6e6e6', padding: 20, borderRadius: 20, borderWidth: 0, margin: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}  >
                                <FontAwesome5 name="check-circle" size={24} style={{ marginRight: 4 }} color="black" />
                                <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-SmallCaps', marginBottom: -6 }}>Ride Paid</Text>
                            </View>
                        }




                    </View>



                </View>





            </View>





            {/* {!rideDetail.enRoute &&
                <TouchableOpacity onPress={cancelRide} style={{ position: 'absolute', borderRadius: 1, borderWidth: 0, borderRadius: 10, bottom: 20, right: 20, flexDirection: 'row', padding: 6, margin: 10, alignItems: 'center', backgroundColor: '#ddd' }}>
                    <MaterialCommunityIcons name="close-circle-outline" size={17} color="black" />
                    <Text>Cancel Ride</Text>
                </TouchableOpacity>
            } */}

            <TouchableOpacity onPress={needHelp} style={{ position: 'absolute', borderRadius: 20, bottom: 30, right: 20, padding: 16, alignItems: 'center', backgroundColor: '#e6e6e6' }}>
                <Text style={{ fontFamily: 'Aristotelica-SmallCaps', fontSize: 19, marginBottom: -5, }}>Need Help?</Text>
            </TouchableOpacity>



        </SafeAreaView>

    );
}



