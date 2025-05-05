import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';

import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ScheduleRideListView = ({ navigation, isConnected, masterState }) => {

    // console.log('my scheduled rides: ', masterState.myScheduledRides)

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", textAlign: 'center', position: 'absolute', top: 80, alignSelf: 'center', zIndex: 1 }}>My Rides</Text>
            <ScrollView style={{ paddingTop: 60 }}>
                {/* {[1].map(request => { */}
                {masterState.myScheduledRides?.map((request, idx) => {

                    // display 'en route' button to driver
                    let timeDiff = new Date(request.pickupDateTime).getTime() - new Date()
                    let hoursUntilPickup = Math.floor(timeDiff / 1000 / 60 / 60)
                    let displayClock = hoursUntilPickup < 24

                    return (
                        <TouchableOpacity key={idx} onPress={() => { navigation.navigate('ScheduleRideDetail', { requestType: 'assigned', rideId: request._id }) }} style={{ borderColor: '#ffb700', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30, backgroundColor: '#ffcf56' }}>
                         

                         {request.unreadMessageFromUser && <Text style={{color:'blue'}}>Unread Message</Text>}
                         
                            <View>

                                {displayClock &&
                                    <View style={{ position: 'absolute', top: 6, right: -10 }} >
                                        <Feather name="clock" size={44} color="green" />
                                        <Text style={{fontSize:8, fontWeight:600, color:'green', right:-34, top:-8}}>soon</Text>
                                    </View>
                                    // :
                                    // <AntDesign style={{ position: 'absolute', top: -10, right: -4 }} name="checkcircle" size={24} color="#e6a400" />
                                }

                                <Text>From: {request.pickupAddress}</Text>
                                <Text>To: {request.dropoffAddress}</Text>
                                <Text>Date: {formatInTimeZone(request.pickupDateTime, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
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