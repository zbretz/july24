import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Entypo } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default FutureRides = ({ navigation, masterState, setMasterState, rideDetail, setRideDetail }) => {


    const { activeRides } = masterState.user
    console.log('activeRides: ', activeRides)

    //maybe reuse detail compoent with update ride

    return (

        <View>
            <View style={{ margin:20,height: 60, borderRadius:20, backgroundColor: '#ffcf56', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <View style={{}} >
                    <Text style={{ fontSize: 26, color: '#000', fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Upcoming Rides</Text>
                </View>
                <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: 20 }}>
                {
                    activeRides.map((ride, idx) => {
                        console.log('active ride list: ', ride)
                        return (

                            <TouchableOpacity key={idx} onPress={() => { navigation.navigate('RideDetail', { rideId: ride._id, type:'future' }) }} style={{ backgroundColor:'#e6e6e6', borderRadius: 20, padding: 30, marginBottom:10 }}>
                                <Text style={{ fontWeight: '600', fontSize: 16,fontFamily: 'PointSoftSemiBold' }}>{formatInTimeZone(ride.pickupDateTime, 'America/Denver', "eee',' MMMM do h':'mm aa")}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ marginRight: -4, marginTop: -3 }}>
                                        <Entypo style={{ marginLeft: -8, marginRight: 8 }} name="dot-single" size={24} color="black" />
                                        <Feather style={{}} name="corner-down-right" size={17} color="black" />
                                    </View>
                                    <View>
                                        <Text style={{fontFamily: 'PointSoftLight'}}>{ride.pickupAddress}</Text>
                                        <Text style={{ marginTop: 6, fontFamily: 'PointSoftLight' }}>{ride.dropoffAddress}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        )
                    })
                }
            </View>
        </View>

    );
}