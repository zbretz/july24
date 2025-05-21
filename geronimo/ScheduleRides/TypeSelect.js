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


export default TypeSelect = ({ navigation, route, destination, setDestination, pickupLocation, setPickupLocation, setFare, flightNumber, setFlightNumber }) => {

    const { type } = route.params;

    useEffect(() => {
        if (type == 'Arrivals') setPickupLocation('SLC Airport')
        if (type == 'Departures') setDestination('SLC Airport')
    }, [type])

    const [pickupDateTime, setPickupDateTime] = useState(new Date())

    const [rideType, setRideType] = useState(1)
    const [date, setDate] = useState(new Date());

    const [addressError, setAddressError] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef(null);
    const flightNumberRef = useRef(null);



    const determineFare = () => {
        axios.get(`${url}/determineFare?pickup=${pickupLocation}&dropoff=${destination}&rideType=${rideType}&dateTime=${pickupDateTime}`)
            .then(fare => {
                if (!fare.data) {
                    fare = null
                    return
                }
                setFare(fare.data)
            })
            .catch(e => console.log('error: ', e))
    }

    const errorTimeout = () => {
        setAddressError(true)
        setTimeout(() => {
            setAddressError(false)
        }, 3000)
    }

    const nextPage = () => {
        if ((type == 'Arrivals' && destination.length === 0) || (type == 'Departures' && pickupLocation.length === 0)) {
            errorTimeout()
            return
        }
        determineFare()
        navigation.navigate('Book')
    }

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


    useEffect(() => {
        if (type == 'Arrivals') setPickupLocation('SLC Airport')
        if (type == 'Departures') setDestination('SLC Airport')
    }, [type])




    return (

        <View style={{ paddingBottom: 6, backgroundColor: '#fff', flex: 1, }}>


            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.6)', }}>

                    <TouchableOpacity onPress={() => { console.log('close modal'); setModalVisible(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                    <View style={{ height: windowHeight * .4, width: windowWidth * .9, backgroundColor: '#ffcf56', alignItems: 'center', justifyContent: 'center', top: windowHeight * .1, alignSelf: 'center', borderRadius: 40, padding: 20 }}>

                        <View style={{ backgroundColor: '#fff', flex: 1, width: '100%', borderRadius: 30 }}>

                            <View style={{ marginTop: 0, padding: 0, borderRadius: 30, alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                                <View style={{ height: '30%', width: '100%', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', }}>
                                    <Image style={{ flex: 1, marginRight: 10, }} resizeMode='contain' source={require('../assets/traffic-lights.png')} />
                                    <Text style={{ color: '#000', fontSize: 25, fontFamily: 'Aristotelica-Regular', flexWrap: 'wrap', flex: 3 }} adjustsFontSizeToFit={true} numberOfLines={2}>Please sign in to book this ride. Thanks!</Text>
                                </View>

                                <TouchableOpacity style={{ padding: 16, borderWidth: 0, borderRadius: 20, marginTop: 20, backgroundColor: '#ffcf56' }} onPress={() => { setModalVisible(false); navigation.navigate('Account') }}><Text style={{ fontFamily: 'Aristotelica-Regular', marginBottom: -6, fontSize: 22 }}>Sign In</Text></TouchableOpacity>
                            </View>
                        </View>

                    </View>

                </View>
            </Modal>


            <View style={{ backgroundColor: '#fff', padding: 32, }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}><Ionicons name="chevron-back-outline" size={24} color="black" /></TouchableOpacity>
            </View>

            <View style={{ position: 'absolute', top: 24, right: 24, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            {type == 'Arrivals' ?
                <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                    <Image style={{ marginHorizontal: 0, marginRight: 10, height: windowHeight < 800 ? windowHeight * .1 : windowHeight * .15, width: windowHeight < 800 ? windowHeight * .1 : windowHeight * .15 }} source={require('../assets/landing.png')} />
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <Text style={{ flexWrap: 'wrap', fontSize: 28, padding: 0, fontFamily: 'Aristotelica-Regular', }} adjustsFontSizeToFit={true} numberOfLines={1}>{type}</Text>
                        <Text style={{ flexWrap: 'wrap', fontSize: 18, padding: 0, fontFamily: 'Aristotelica-Regular', }} adjustsFontSizeToFit={true} numberOfLines={3}>Your driver will track your arriving flight.</Text>
                    </View>
                </View>
                :
                <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                    <Image style={{ marginHorizontal: 0, marginRight: 10, height: windowHeight < 800 ? windowHeight * .1 : windowHeight * .15, width: windowHeight < 800 ? windowHeight * .1 : windowHeight * .15 }} source={require('../assets/takeoff.png')} />
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <Text style={{ flexWrap: 'wrap', fontSize: 28, padding: 0, fontFamily: 'Aristotelica-Regular', }} adjustsFontSizeToFit={true} numberOfLines={1}>Departures</Text>
                        <Text style={{ flexWrap: 'wrap', fontSize: 18, padding: 0, fontFamily: 'Aristotelica-Regular', }} adjustsFontSizeToFit={true} numberOfLines={3}>We will get you to your flight in good time.</Text>
                    </View>
                </View>

            }


            <View style={{ marginTop: 0, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20, paddingBottom: 0 }}>


                <View style={{ paddingVertical: 0, }}>
                    <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>{type == 'Arrivals' ? 'Dropoff Address' : 'Pickup Address'}</Text>

                    <TextInput style={{ height: 40, borderRadius: 16, backgroundColor: '#f2f2f2', paddingHorizontal: 8, fontSize: 16, fontFamily: 'PointSoftSemiBold', marginBottom: 10 }}
                        ref={inputRef}
                        autoCapitalize={'none'}
                        placeholderTextColor={'#77756e'}
                        showSoftInputOnFocus={false} //disables keyboard 
                        onFocus={() => navigation.navigate('AddressInput', { type })}
                        // onBlur={() => { setInputFocused(false);setSearchResults([]) }}
                        value={type == 'Arrivals' ? destination : pickupLocation}
                        blurOnSubmit={false}
                        onSubmitEditing={() => {  }}
                    />
                </View>
            </View>


            {type == 'Arrivals' ?
                <View style={{ marginTop: 10, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20, paddingBottom: 0 }}>
                    <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Airline and Flight Number</Text>

                    <TextInput style={{ height: 40, borderRadius: 16, backgroundColor: '#f2f2f2', paddingHorizontal: 8, fontSize: 16, fontFamily: 'PointSoftSemiBold', marginBottom: 10 }}
                        ref={flightNumberRef}
                        autoCapitalize={'none'}
                        placeholderTextColor={'#77756e'}
                        // onFocus={() => setInputFocused('pickup')}
                        // onBlur={() => { setInputFocused(false); setSearchResults([]) }}
                        value={flightNumber}
                        onChangeText={(text) => { setFlightNumber(text) }}
                    />
                </View>
                :
                null
            }

            {Platform.OS == 'ios' &&
                <View>
                    {!type && <View style={{ backgroundColor: 'rgba(255,255,255,.7)', height: '100%', width: '100%', position: 'absolute', borderRadius: 20, zIndex: 1, margin: 0 }} />}
                    <View style={{ marginTop: 10, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20 }}>
                        <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>{type == 'Arrivals' ? 'Arrival Time' : 'Pickup Time'}</Text>
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

            {addressError &&
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 80, zIndex: 3, }}>
                    <View style={{ width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18 }}>Address not recognized.</Text>
                        <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18, marginTop: 8 }}>Please re-input your location.</Text>
                    </View>
                </View>
            }

            {/* {destination && */}
            <TouchableOpacity onPress={() => { nextPage() }} style={{ backgroundColor: '#ffcf56', height: 56, width: '85%', alignSelf: 'center', zIndex: 1, position: 'absolute', bottom: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Next</Text>
            </TouchableOpacity>
            {/* } */}

        </View>
    )
}



