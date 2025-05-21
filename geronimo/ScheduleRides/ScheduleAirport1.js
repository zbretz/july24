import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated, LayoutAnimation, Modal, Alert, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RideType from './RideType';
// import { DateTimePicker, DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import { Feather, FontAwesome6, Ionicons, AntDesign } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
import { socket } from '../CoreNav/socket';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';
import { formatInTimeZone } from "date-fns-tz";
import { url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default Airport1 = ({ isConnected, masterState, setMasterState, navigation, address, setDestination, setPickupLocation, date, setDate, flightNumber, setFlightNumber }) => {


    const { user } = masterState

    console.log('user: ', user)

    useFocusEffect(
        useCallback(() => {
            setDestination(''); setPickupLocation('');
        }, [])
    )

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
            value: date,
            onChange,
            mode: currentMode,
            is24Hour: false,
        });
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };


    return (

        <>

            <View style={{ flex: 1, backgroundColor: '#fff', }}>

                <View style={{ backgroundColor: '#fff', padding: 32, }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}><Ionicons name="chevron-back-outline" size={24} color="black" /></TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', top: 24, right: 24, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', }} name="arrow-back-ios" size={24} color="black" >
                    <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                </View>



                <View style={{ flex: 1, }}>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                        <Image style={{ marginHorizontal: 0, flex: 1, marginRight: 10, height: windowHeight * .15, width: windowHeight * .15, flex: 2 }} source={require('../assets/airport.png')} />
                        <View style={{ flex: 4, justifyContent: 'center' }}>
                            <Text style={{ flexWrap: 'wrap', fontSize: 28, padding: 0, fontFamily: 'Aristotelica-Regular', }} >Airport Rides</Text>
                            <Text style={{ flexWrap: 'wrap', fontSize: 18, padding: 0, fontFamily: 'Aristotelica-Regular', }} >Pickups and Dropoffs to SLC.</Text>
                            <Text style={{ flexWrap: 'wrap', fontSize: 14, padding: 0, fontFamily: 'Aristotelica-Regular', }} >For Provo and Heber airport,</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('OtherAreas')} style={{ backgroundColor: '#55c1ff', borderRadius: 10, padding: 4, alignSelf: 'flex-start' }}><Text style={{ color: '#fff', fontFamily: 'Aristotelica-Regular', marginBottom: -3 }}>click here</Text></TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ marginTop: 0, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20, paddingBottom: 0 }}>

                        <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Select</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('TypeSelect', { type: 'Arrivals' })} style={{ alignItems: 'center' }}>
                                <Image style={{ marginHorizontal: 0, marginRight: 10, height: windowHeight * .15, width: windowHeight * .15, }} source={require('../assets/landing.png')} />
                                <Text style={{ fontFamily: 'Aristotelica-Regular', textAlign: 'center', fontSize: 18, margin: 4 }}>Arrivals</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('TypeSelect', { type: 'Departures' })} style={{ justifyContent: 'center' }}>
                                <Image style={{ marginHorizontal: 0, marginRight: 0, height: windowHeight * .15, width: windowHeight * .15, }} source={require('../assets/takeoff.png')} />
                                <Text style={{ fontFamily: 'Aristotelica-Regular', textAlign: 'center', fontSize: 18, margin: 4 }}>Departures</Text>
                            </TouchableOpacity>
                        </View>

                    </View>


                    {Platform.OS == 'ios' &&

                        <View>
                            {<View style={{ backgroundColor: 'rgba(255,255,255,.7)', height: '100%', width: '100%', position: 'absolute', borderRadius: 20, zIndex: 1, margin: 0 }} />}
                            <View style={{ marginTop: 10, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20 }}>
                                <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Time</Text>
                                <View style={{ borderRadius: 20, backgroundColor: '#f2f2f2', }}>
                                    <DateTimePicker
                                        timeZoneName={'America/Denver'}
                                        style={{ margin: -10, backgroundColor: '#f2f2f2', transform: [{ scale: .84 }], alignSelf: 'center' }}
                                        testID="dateTimePicker"
                                        value={date}
                                        mode={'datetime'}
                                        is24Hour={true}
                                        onChange={(event, date) => { setDate(date); console.log(date) }}
                                        display='spinner'
                                        minuteInterval={5}
                                    />
                                </View>
                            </View>
                        </View>


                    }


                    {Platform.OS == 'android' &&

                        <View style={{ marginTop: 10, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20, }}>
                            <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Date and Time</Text>
                            <View style={{ borderRadius: 20, backgroundColor: '#f2f2f2', }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', borderRadius: 20, backgroundColor: '#f2f2f2', }}>
                                    <TouchableOpacity onPress={showDatepicker}>
                                        <Image style={{ marginHorizontal: 0, marginRight: 0, height: windowHeight * .1, width: windowHeight * .1, }} source={require('../assets/android-calendar.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={showTimepicker} >
                                        <Image style={{ marginHorizontal: 0, marginRight: 0, height: windowHeight * .1, width: windowHeight * .1, }} source={require('../assets/android-clock.png')} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={{ fontSize: 18, width: '100%', fontFamily: 'PointSoftSemiBold', textAlign: 'center', marginVertical: 6 }}>{formatInTimeZone(date, 'America/Denver', "eeee',' MMMM do h':'mm aa")}</Text>
                            </View>
                        </View>

                    }

                </View>

            </View>
        </>
    );
}

