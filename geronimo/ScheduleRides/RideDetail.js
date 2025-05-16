import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, SafeAreaView, Alert, Linking } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, Octicons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import CallDriverButton from './CallDriverButton';
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

    const types = { 1: ['Standard', 4], 2: ['Premium', 4], 3: ['XL', 5], 4: ['Premium XL', 6] }

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


    const setReminder = async () => {
        console.log('setReminder')
        socket.emit('setReminder', rideDetail, (rideid) => {

        })
    }



    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>


            <TouchableOpacity onPress={setReminder} style={{
                position: 'absolute', top: 0, zIndex: 100, right: 0, backgroundColor: '#fff5f7',//'#fff1cc'
                borderColor: '#ff99ad',//#ffcf56
                borderBottomWidth: 8,
                borderTopRightRadius: 20, borderBottomRightRadius: 20,
                alignSelf: 'flex-start',
                padding: 20,
                shadowColor: '#000',
                shadowOpacity: 0.48,
                shadowRadius: 8,
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
            }}>
                <Text>Set Reminder</Text>

            </TouchableOpacity>



            <Text style={{ marginTop: 30, fontSize: 18, fontFamily: 'LexendMedium', textAlign: 'center' }}>Ride</Text>


            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, zIndex: 11, padding: 20, }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <View style={{ paddingHorizontal: 10, width: '100%', marginTop: 20 }}>

                <View style={{
                    marginVertical: 10,
                    // backgroundColor: '#e6e6e6',
                    borderRadius: 30,
                    // padding: 10
                }}>


                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View>
                            {rideDetail.enRoute ?
                                // <View style={{ alignItems: 'center', }}>
                                //     <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontSize: 20, fontFamily: 'LexendRegular', textAlign: 'center' }}>Status: Driver En Route</Text>
                                // </View>
                                <View style={{ marginBottom: 0, marginHorizontal: 0, padding: 10, backgroundColor: '#ffccd6', borderRadius: 16 }}>
                                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', color: '#99001f' }}>Ride Status</Text>
                                    <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'LexendRegular', color: '#000' }}>Driver En Route</Text>
                                </View>
                                :
                                <View style={{ marginBottom: 0, marginHorizontal: 10 }}>
                                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "eeee")}</Text>
                                    <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'LexendMedium', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "MMMM d")}</Text>
                                    <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>
                                </View>
                            }
                        </View>
                        {/* <View style={{ backgroundColor: '#f2f2f2' }}> */}
                        <View style={{ marginBottom: 0, marginHorizontal: 10, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#f2f2f2', padding: 10, borderRadius: 16 }}>
                            <Text style={{ marginVertical: 0, fontSize: 14, fontFamily: 'LexendMedium', }}>{types[rideDetail.rideType][0]}</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginVertical: 0, fontSize: 14, fontFamily: 'LexendRegular', color: '#737373' }}>{types[rideDetail.rideType][1]}</Text>
                                <Ionicons name="person" size={16} color="#737373" />
                            </View>
                        </View>
                        {/* </View> */}
                    </View>

                    {rideDetail.driver &&
                        <View style={{ borderRadius: 30, marginBottom: 10, borderWidth: 7, borderColor: '#e6e6e6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 28, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text numberOfLines={1} style={{ fontSize: 18, fontFamily: 'LexendRegular', }}>Driver Assigned  </Text>
                                    <Image style={{ height: 26, width: 26, marginTop: 0 }} source={require('../assets/verified.png')} />
                                </View>
                                <View style={{}}>
                                    <Text style={{ fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.driver.firstName}</Text>
                                </View>
                            </View>

                            <>
                                {type !== "history" &&
                                    <CallDriverButton style={{}}
                                        rideId={rideId}
                                        // pickupDateTime={new Date()}
                                        pickupDateTime={rideDetail.pickupDateTime}
                                    />}
                            </>

                        </View>
                    }


                    <View style={{ borderRadius: 30, justifyContent: 'center', marginVertical: 0, borderWidth: 7, borderColor: '#e6e6e6' }}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 16, }}>
                            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'LexendRegular', }}>Pickup</Text>
                            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.pickupAddress}</Text>
                            <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'LexendRegular', }}>Dropoff</Text>
                            <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.dropoffAddress}</Text>
                        </View>
                    </View>



                    <View style={{ marginTop: 10, }}>




                        {rideDetail.driver && type !== "history" ?
                            <>
                                {chatLog.length ?
                                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 10, }} >
                                        <Text style={{ marginHorizontal: 10, fontSize: 18, color: "#000", fontFamily: 'LexendRegular' }}>Driver Chat</Text>
                                        <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'PointSoftLight', fontSize: 18, backgroundColor: '#fff', }} numberOfLines={2}>{chatLog[chatLog.length - 1].text}</Text>
                                            <Entypo name="chat" size={32} color="black" style={{ position: 'absolute', right: 20 }} />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 20, }} >
                                        <Text style={{ marginHorizontal: 10, fontSize: 18, color: "#000", fontFamily: 'LexendRegular' }}>Driver Chat</Text>
                                        <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 20, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ color: '#a1a1a1', fontSize: 18, fontFamily: 'LexendRegular', }}>Message Driver ...</Text>
                                            <Entypo name="chat" size={32} color="black" style={{ marginRight: 20 }} />
                                        </View>
                                    </TouchableOpacity>
                                }
                            </>
                            :
                            null
                        }


                        {!rideDetail.paid ?
                            <TouchableOpacity onPress={() => { navigation.navigate('PaymentPage', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', padding: 20, borderRadius: 20, borderWidth: 0, marginTop: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }} >
                                <Text style={{ color: '#000', fontSize: 18, fontFamily: 'LexendRegular', marginBottom: 0 }}>Complete Payment</Text>
                                <FontAwesome5 name="money-check" size={24} style={{ marginRight: 20 }} color="black" />
                            </TouchableOpacity>
                            :
                            <View style={{ backgroundColor: '#e6e6e6', padding: 20, borderRadius: 20, borderWidth: 0, marginTop: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}  >
                                <FontAwesome5 name="check-circle" size={24} style={{ marginRight: 4 }} color="black" />
                                <Text style={{ color: '#000', fontSize: 18, fontFamily: 'LexendRegular', marginBottom: 0 }}>Ride Paid</Text>
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



