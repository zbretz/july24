import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { formatInTimeZone } from "date-fns-tz";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default RideType = ({ isConnected, masterState, navigation }) => {

    const upcomingRide = masterState.user?.activeRides?.length ? masterState.user.activeRides[0] : null
    // console.log('ride type -- active ride: ', upcomingRide)

    const comingSoonAlert = (type) => {
        const text = `This feature is not yet active. We're working on it!`
        const title = `Coming Soon!`
        Alert.alert(title, text, [
            {
                text: 'Ok', onPress: () => {
                }
            },
        ])
    }

    return (

        <View style={{ backgroundColor: '#fff', height: '100%' }}>


            <View style={{ backgroundColor: '#FFCF56', margin: 20, marginBottom: 0, borderRadius: 40, padding: 10, paddingVertical: 30 }}>

                <View style={{ zIndex: 11 }}>
                    <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, }} onPress={() => navigation.goBack()}>
                        <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{}}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .078, marginVertical: windowHeight < 800 ? -6 : 0, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>Scheduled Rides</Text>
                </View>





            </View>


            <View style={{}}>

                {!upcomingRide &&
                    <View style={{
                        flexDirection: 'row',
                        // backgroundColor: '#9adfc2',
                        margin: 20, marginBottom: -10, padding: 0, borderRadius: 30, borderColor: '#666', borderWidth: 0, justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Image style={{ height: '100%', width: '30%', marginHorizontal: 0, }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                        <Text style={{ flexWrap: 'wrap', flex: 3, fontSize: 18, padding: 0, fontFamily: 'Aristotelica-Regular', }}>Park City drivers are dedicated to great service and punctual pickups.</Text>

                    </View>
                }


                {masterState.user &&
                    <TouchableOpacity onPress={() => navigation.navigate('RideHistory')} style={{ borderRadius: 40, padding:4, paddingHorizontal: 10, marginHorizontal:20, marginTop:10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe5ea', justifyContent: 'space-around', alignSelf: 'flex-start', flexDirection:'row' }} >
                        <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Aristotelica-Regular', marginBottom: -8, marginRight:10 }}>My Drivers</Text> 
                        <AntDesign name="rightcircle" size={17} color="#ff99ad" />

                    </TouchableOpacity>
                }


                <View style={{ zIndex: 100, width: '100%', }}>
                    {upcomingRide &&
                        <>
                            <View style={{ flexDirection: 'row', padding: 10, paddingHorizontal: 20, }}>
                                <Text style={{ fontWeight: 600, fontSize: 26, marginBottom: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', marginBottom: 0 }}>Upcoming Ride</Text>
                                {/* <TouchableOpacity onPress={() => navigation.navigate('FutureRides')} style={{ backgroundColor: '#f2f2f2', borderRadius: 40, padding: 10, flexDirection: 'row', }} >
                                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Lexend-Regular', marginRight: 10 }}>Future Rides</Text>
                                    <AntDesign name="rightcircle" size={17} color="#5a5a5a" />
                                </TouchableOpacity> */}
                            </View>

                            <View style={{ paddingHorizontal: 20, width: '100%', marginBottom: 0, }}>
                                <TouchableOpacity onPress={() => navigation.navigate('RideDetail', { rideId: upcomingRide._id })} style={{
                                    flexDirection: 'row',
                                    backgroundColor: '#e6e6e6',
                                    // height: windowHeight * .22,
                                    borderRadius: 30,
                                }}>
                                    {/* <Image style={{ height: '100%', width: '30%', marginHorizontal: 10 }} resizeMode='contain' source={require('../assets/car-schedule.png')} /> */}

                                    <View style={{ padding: 10, flex: 1, borderTopRightRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center' }}>

                                        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 10, paddingHorizontal: 20 }}>
                                            <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftSemiBold', }}>{formatInTimeZone(upcomingRide.pickupDateTime, 'America/Denver', "eee',' MMMM d")}</Text>
                                            <Text style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(upcomingRide.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>
                                            <Text numberOfLines={1} style={{ marginTop: 10, fontSize: 12, fontFamily: 'PointSoftLight', }}>{upcomingRide.pickupAddress}</Text>
                                            <Text numberOfLines={1} style={{ marginVertical: 0, fontSize: 12, fontFamily: 'PointSoftLight', }}>{upcomingRide.dropoffAddress}</Text>

                                            {upcomingRide.driver ?
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text numberOfLines={1} style={{ marginVertical: 10, marginBottom: 10, fontSize: 12, fontFamily: 'PointSoftSemiBold', marginRight: 6 }}>Driver Assigned</Text>
                                                    <Image style={{ height: 20, width: 20, }} source={require('../assets/verified.png')} />
                                                </View>

                                                :

                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text numberOfLines={1} style={{ marginVertical: 10, marginBottom: 10, fontSize: 14, fontFamily: 'PointSoftSemiBold', marginRight: 6 }}>View more</Text>
                                                    <AntDesign name="rightcircle" size={17} color="#00d0ff" />
                                                </View>

                                            }
                                        </View>




                                    </View>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('FutureRides')} style={{ backgroundColor: '#f2f2f2', marginTop: 10, marginHorizontal: 20, borderRadius: 40, padding: 10, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', }} >
                                <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Lexend-Regular', marginRight: 10 }}>Future Rides</Text>
                                <AntDesign name="rightcircle" size={17} color="#5a5a5a" />
                            </TouchableOpacity>

                        </>
                    }

                    <Text style={{ fontWeight: 600, fontSize: 26, marginTop: 0, marginBottom: -10, padding: 20, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Book Ride</Text>

                    <View style={{ flexDirection: 'row', margin: 20 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Airport')} style={{ backgroundColor: '#f2f2f2', flex: 1, height: windowHeight * .22, borderRadius: 30, marginRight: 20, alignItems: 'center', paddingVertical: 20 }}>
                            <Image style={{ flex: 1, }} resizeMode='contain' source={require('../assets/airport.png')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Airport</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('OtherAreas')} style={{ backgroundColor: '#f2f2f2', flex: 1, height: windowHeight * .22, borderRadius: 30, alignItems: 'center', paddingVertical: 20 }}>
                            <Image style={{ width: '50%', height: '50%', position: 'absolute', left: 10, top: 10 }} resizeMode='contain' source={require('../assets/restaurant.png')} />
                            <Image style={{ width: '50%', height: '50%', position: 'absolute', right: 10, top: 30 }} resizeMode='contain' source={require('../assets/hospital.png')} />
                            <Image style={{ width: '50%', height: '50%', position: 'absolute', left: 20, top: 60 }} resizeMode='contain' source={require('../assets/lake.png')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'center', marginLeft: 0, justifyContent: 'center', position: 'absolute', bottom: 20 }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>More Places</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={{ paddingHorizontal: 20, width: '100%', }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Airport')} style={{
                            marginVertical: 10,
                            flexDirection: 'row',
                            backgroundColor: '#fff', height: 130, borderRadius: 30,
                            shadowColor: '#000',
                            shadowOpacity: 0.38,
                            shadowRadius: 2,
                            shadowOffset: {
                                width: 1,
                                height: 1,
                            },
                        }}>
                            <Image style={{ height: '100%', width: '50%', borderRadius: 30, }} resizeMode='contain' source={require('../assets/passport3d.png')} />
                            <View style={{ padding: 20 }}>
                                <Text style={{ marginVertical: 0, fontSize: 23, fontWeight: '500' }}>Airport</Text>
                                <Text style={{ marginVertical: 0, fontSize: 16 }}>Pickups &</Text>
                                <Text style={{ marginVertical: 0, fontSize: 16 }}>Dropoffs</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('OtherAreas')}
                            style={{
                                marginHorizontal: 0,
                                flexDirection: 'row',
                                backgroundColor: '#fff', height: 130, borderRadius: 20,
                                shadowColor: '#000',
                                shadowOpacity: 0.38,
                                shadowRadius: 6,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                            }}>
                            <View style={{ height: '100%', width: '50%', overflow: 'hidden', borderRadius: 20, }}>
                                <Image style={{ left: -25, width: '140%', borderRadius: 20, backgroundColor: 'blue', flex: 1, }} resizeMode='cover' source={require('../assets/10.png')} />
                            </View>
                            <View style={{ padding: 20 }}>
                                <Text style={{ marginVertical: 0, fontSize: 23, fontWeight: '500' }}>Other Areas</Text>
                                <Text style={{ marginVertical: 0, fontSize: 16 }}>Main Street</Text>
                                <Text style={{ marginVertical: 0, fontSize: 16 }}>SLC</Text>
                                <Text style={{ marginVertical: 0, fontSize: 16 }}>Heber</Text>
                                <Text style={{ marginVertical: 0, fontSize: 16 }}>Midway and more</Text>
                            </View>
                        </TouchableOpacity>

                    </View> */}








                </View>
            </View >

        </View>







    );
}

