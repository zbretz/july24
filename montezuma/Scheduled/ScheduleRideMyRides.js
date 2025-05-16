import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';

import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ScheduleRideListView = ({ navigation, isConnected, masterState }) => {

    // console.log('my scheduled rides: ', masterState.myScheduledRides)



    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", textAlign: 'center', alignSelf: 'center', zIndex: 1 }}>My Rides</Text>
            <ScrollView style={{ paddingTop: 10 }}>
                {/* {[1].map(request => { */}
                {masterState.myScheduledRides?.map((request, idx) => {

                    // display 'en route' button to driver
                    let timeDiff = new Date(request.pickupDateTime).getTime() - new Date()
                    let hoursUntilPickup = Math.floor(timeDiff / 1000 / 60 / 60)
                    let displayClock = hoursUntilPickup < 24

                    let minutesUntilPickup = Math.floor(timeDiff / 1000 / 60)
                    let displayCheckIn = minutesUntilPickup < 90

                    return (
                        <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', { requestType: 'assigned', rideId: request._id }) }} style={{ borderColor: '#ffb700', borderWidth: 1, borderRadius: 20, margin: 10, padding: 20, backgroundColor: '#ffe299', }}>


                            {request.unreadMessageFromUser &&
                                <View style={{
                                    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 4, backgroundColor: '#fff5f7', borderRadius: 8, position: 'absolute', bottom: 10, right: 10, zIndex: 1, shadowColor: '#000',
                                    shadowOpacity: 0.38,
                                    shadowRadius: 8,
                                    shadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                }}>
                                    <AntDesign name="mail" size={38} color="#ff99ad" />
                                </View>
                            }

                            <View>


                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600' }}>{formatInTimeZone(request.pickupDateTime, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>

                                    {displayClock &&
                                        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 4, backgroundColor: '#fff', borderRadius: 8, }} >
                                            <Feather name="clock" size={24} color="#ffb700" />
                                            <Text style={{ fontSize: 12, fontWeight: 600, color: '#000', marginLeft: 8 }}>Soon</Text>
                                        </View>
                                        // :
                                        // <AntDesign style={{ position: 'absolute', top: -10, right: -4 }} name="checkcircle" size={24} color="#e6a400" />
                                    }
                                </View>

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

                                {displayCheckIn &&
                                    <>
                                        {request.checkedIn ?
                                            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 18, marginTop: 10 }} >
                                                <Feather name="check-circle" size={24} color="black" />
                                                <Text style={{ fontSize: 22, fontWeight: 500, color: '#000', marginLeft: 8 }}>Checked-In</Text>
                                            </View>
                                            :
                                            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#fff', borderRadius: 18, marginTop: 10 }} >
                                                <Feather name="circle" size={24} color="black" />
                                                <Text style={{ fontSize: 22, fontWeight: 500, color: '#000', marginLeft: 8 }}>Check-In Required</Text>
                                            </View>
                                        }
                                    </>
                                }

                                {(request.rideCanceledByDriver || request.rideCanceledByRider) &&
                                    <View style={{ backgroundColor: 'red', borderWidth: 0, borderRadius: 10, padding: 4, alignItems: 'center' }}>
                                        <Text style={{ color: '#fff', fontSize: 18, }}>Ride Canceled</Text>
                                    </View>}
                            </View>

                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </SafeAreaView>

    );

}