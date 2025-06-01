import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Dimensions, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { formatInTimeZone } from "date-fns-tz";
import { AntDesign, Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default RideType = ({ isConnected, masterState, navigation }) => {

    const upcomingRide = masterState.user?.activeRides?.length ? masterState.user.activeRides[0] : null
    // console.log('ride type -- active ride: ', upcomingRide)

    // const [driverBooking, setDriverBooking] = useState(true)
    const driverBooking = masterState.user.driverBooking
    console.log('driver booking: ', driverBooking)

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

    useEffect(() => {
        // comingSoonAlert()
    }, [])

    return (

        <>

            <TouchableOpacity style={{ position: 'absolute', zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <ScrollView style={{ height: '100%', backgroundColor: '#fff', paddingTop: 80 }}>



                <Text style={{ fontSize: 32, color: '#000', fontFamily: 'LexendMedium', marginHorizontal: 10 }}>Schedule</Text>
                <Text style={{ fontSize: 32, color: '#000', fontFamily: 'LexendMedium', marginHorizontal: 10 }}>Ride</Text>



                <View style={{}}>

                    {/* {!upcomingRide && 
                    <View style={{
                        flexDirection: 'row',
                        margin: 24, marginBottom: 0, padding: 0, borderRadius: 30, borderColor: '#666', borderWidth: 0, justifyContent: 'center', alignItems: 'center',
                    }}>
                        <Image style={{ height: '100%', width: '30%', marginHorizontal: 0, }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                        <Text style={{ flexWrap: 'wrap', flex: 3, fontSize: 16, padding: 0, fontFamily: 'LexendRegular', }}>Park City drivers are dedicated to great service and punctual pickups.</Text>

                    </View>
                } */}

                    {/* {masterState.user &&
                    <TouchableOpacity onPress={() => navigation.navigate('PreferredDrivers')} style={{ borderRadius: 40, padding: 4, paddingHorizontal: 10, marginHorizontal: 20, marginTop: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe5ea', justifyContent: 'space-around', alignSelf: 'flex-start', flexDirection: 'row' }} >
                        <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Aristotelica-Regular', marginBottom: -8, marginRight: 10 }}>My Drivers</Text>
                        <AntDesign name="rightcircle" size={17} color="#ff99ad" />
                    </TouchableOpacity>
                } */}

                    {masterState.user &&
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('FutureRides')} style={{ backgroundColor: '#f2f2f2', marginTop: 10, marginHorizontal: 20, borderRadius: 40, padding: 10, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', }} >
                                <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Lexend-Regular', marginRight: 10 }}>Future Rides</Text>
                                <AntDesign name="rightcircle" size={17} color="#5a5a5a" />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('RideHistory')} style={{ backgroundColor: '#f2f2f2', marginTop: 10, marginHorizontal: 20, borderRadius: 40, padding: 10, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', }} >
                                <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Lexend-Regular', marginRight: 10 }}>Ride History</Text>
                                <AntDesign name="rightcircle" size={17} color="#5a5a5a" />
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{ zIndex: 100, width: '100%', }}>
                        {upcomingRide &&
                            <>
                                <View style={{ flexDirection: 'row', padding: 10, paddingHorizontal: 20, }}>
                                    <Text style={{ fontWeight: 600, fontSize: 22, marginBottom: 0, paddingBottom: 0, fontFamily: 'LexendRegular', marginBottom: 0 }}>Upcoming Ride</Text>
                                </View>

                                <View style={{ paddingHorizontal: 20, width: '100%', marginBottom: 0, }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('RideDetail', { rideId: upcomingRide._id })} style={{
                                        flexDirection: 'row',
                                        backgroundColor: '#e6e6e6',
                                        borderRadius: 30,
                                    }}>
                                        <View style={{ padding: 10, flex: 1, borderTopRightRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center' }}>
                                            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 10, paddingHorizontal: 20 }}>
                                                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftSemiBold', }}>{formatInTimeZone(upcomingRide.pickupDateTime, 'America/Denver', "eee',' MMMM d")}</Text>
                                                <Text style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(upcomingRide.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>
                                                <Text numberOfLines={1} style={{ marginTop: 10, fontSize: 13, fontFamily: 'PointSoftLight', }}>{upcomingRide.pickupAddress}</Text>
                                                <Text numberOfLines={1} style={{ marginVertical: 0, fontSize: 13, fontFamily: 'PointSoftLight', }}>{upcomingRide.dropoffAddress}</Text>

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
                            </>
                        }



                        {driverBooking &&
                            <>
                                <View style={{ flexDirection: 'row', padding: 10, paddingHorizontal: 20, }}>
                                    <Text style={{ fontWeight: 600, fontSize: 22, marginBottom: 0, paddingBottom: 0, fontFamily: 'LexendRegular', marginBottom: 0 }}>Driver Booking</Text>
                                </View>

                                <View style={{ paddingHorizontal: 20, width: '100%', marginBottom: 0, }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('RideDetail', { rideId: upcomingRide._id })} style={{
                                        flexDirection: 'row',
                                        // backgroundColor: '#e6e6e6',
                                        borderRadius: 30,
                                    }}>
                                        {/* <View style={{ padding: 10, flex: 1, borderTopRightRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center' }}> */}
                                        <View style={{ backgroundColor: '#f2f2f2', borderRadius: 20, padding: 10, width: '100%' }}>

                                            <View style={{ flexDirection: 'row', }}>
                                                <Image style={{ zIndex: 22, width: 100, height: 100, borderRadius: 60, borderWidth: 3, borderColor: '#fff', marginRight: 20 }} resizeMode='cover' source={require('../assets/denette2.webp')} />

                                                <View>
                                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftSemiBold', }}>Denette</Text>
                                                    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftSemiBold', }}>{formatInTimeZone(upcomingRide.pickupDateTime, 'America/Denver', "eee',' MMMM d")}</Text>
                                                    <Text style={{ marginVertical: 0, fontSize: 21, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(upcomingRide.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>

                                                    {upcomingRide.driver ?
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Text numberOfLines={1} style={{ marginVertical: 10, marginBottom: 10, fontSize: 12, fontFamily: 'PointSoftSemiBold', marginRight: 6 }}>Booking Confirmed</Text>
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

                                        </View>
                                        {/* </View> */}
                                    </TouchableOpacity>
                                </View>
                            </>
                        }



                        {!masterState.user &&

                            <View style={{ backgroundColor: '#fff5f7', margin: 20, marginBottom: 0, borderRadius: 20 }}>
                                <TouchableOpacity onPress={() => navigation.navigate('Account')} style={{ borderRadius: 40, padding: 8, paddingHorizontal: 10, marginHorizontal: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe5ea', justifyContent: 'space-around', alignSelf: 'flex-start', flexDirection: 'row' }} >
                                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', marginRight: 10, fontWeight: '600' }}>Sign In</Text>
                                    <AntDesign name="rightcircle" size={17} color="#ff99ad" />
                                </TouchableOpacity>

                                <Text style={{ fontSize: 16, padding: 20, paddingTop: 10, fontFamily: 'LexendRegular', }}>In order to request a ride, you'll need to sign in. But you can check out our rates using the options below.</Text>

                            </View>
                        }


                        <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 0, marginBottom: -10, padding: 20, paddingBottom: 0, fontFamily: 'LexendRegular', }}>Book Ride</Text>

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

                        <TouchableOpacity onPress={() => navigation.navigate('DriverPages')} style={{ backgroundColor: '#f2f2f2', height: windowHeight * .22, borderRadius: 30, marginHorizontal: 20, marginBottom: 20, alignItems: 'center', paddingVertical: 20 }}>
                            <Image style={{ flex: 1, }} resizeMode='contain' source={require('../assets/airport.png')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Find Driver</Text>
                            </View>
                        </TouchableOpacity>






                    </View>
                </View >

            </ScrollView>





        </>

    );
}

