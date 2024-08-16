import * as Location from 'expo-location';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AppState, Text, View, StyleSheet, TouchableOpacity, Dimensions, LayoutAnimation, TouchableHighlight, Platform, TextInput, ActivityIndicator, Animated, Modal, Image } from 'react-native';
import axios from 'axios';
import { Feather, FontAwesome5, FontAwesome6, MaterialIcons, AntDesign } from '@expo/vector-icons';
import LocalRideStripeConfig from './LocalRideStripeConfig';
import { formatInTimeZone } from "date-fns-tz";
import { add } from "date-fns";
import { socket } from "../CoreNav/socket";
import { Alert } from 'react-native';

import MapComponent from './Map';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import useKeyboard from '../useKeyboard';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function MapWrapper({ navigation, masterState, setMasterState, }) {

    if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const [scheduleStep, setScheduleStep] = useState('pickup')
    const [pickupAddress, setPickupAddress] = useState('Current Address')
    const [dropoffAddress, setDropoffAddress] = useState(true)
    const [requestTime, setRequestTime] = useState(add(new Date(), { minutes: 20 })) // const [requestTime,setRequestTime] = useState(null)
    const [pinAddress, setPinAddress] = useState('Current Location')
    const [fareParams, setFareParams] = useState({ distance: null, eta: null, fare: null })
    const pickupRef = useRef(null);
    const [pickupSearchResults, setPickupSearchResults] = useState([])
    const [dropoffSearchResults, setDropoffSearchResults] = useState([])
    const [location, setLocation] = useState('')
    const [loadingPayForm, setLoadingPayForm] = useState(false)
    const API_KEY = 'AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI';

    let keyboardHeight = useKeyboard()
    const [keyboardFocused, setKeyboardFocused] = useState(false)

    console.log('keyboard height: ', keyboardHeight)
    console.log('current address: ', pickupAddress)


    const searchLocation = async (text) => {

        console.log('SEARCHING LOCATION')

        if (!text.length) {

            // scheduleStep == 'pickup' && setPickupSearchResults([1, 1, 1, 1, 1]);
            // scheduleStep == 'dropoff' && setDropoffSearchResults([1, 1, 1, 1, 1]);

            scheduleStep == 'pickup' && setPickupSearchResults([]);
            scheduleStep == 'dropoff' && setDropoffSearchResults([]);
            return

        }

        console.log(text)
        axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${text}&location=40.6856%-111.5563&radius=5000&region=US`,
            })
            .then((response) => {
                scheduleStep == 'pickup' && setPickupSearchResults(response.data.predictions)
                scheduleStep == 'dropoff' && setDropoffSearchResults(response.data.predictions)
            })
            .catch((e) => {
                console.log(e.response);
            })
            .finally(() => {
                console.log('finally')
            })
    };


    const calcFare = async ({ pickupAddress, dropoffAddress }) => {

        console.log('calculating fare', pickupAddress, dropoffAddress)

        axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/distancematrix/json?key=${API_KEY}&destinations=${dropoffAddress}&origins=${pickupAddress}&units=imperial`,
            })
            .then((response) => {
                let res = response.data.rows[0].elements[0]
                console.log('distance amtric response: ', res)
                let distance = res.distance.text
                distance = Number(distance.slice(0, distance.length - 3))
                let eta = res.duration.text
                eta = Number(eta.slice(0, eta.length - 5))
                //    let fare = eta + (.041)*distance*distance - (.35*distance) + 5
                // need to measure greater distance of either location from core PC, otherwise eg a midway to heber is way undervalued etc
                let fare = eta + (.029) * distance * distance - (.4 * distance) + 5
                fare = Math.floor(fare)
                fare = fare < 10 ? 10 : fare

                setFareParams({ distance, eta, fare })
            })
            .catch((e) => {
                console.log('calc fare error', e);
            })

    };


    const [userLocation, setUserLocation] = useState(null);

    let locationFunc = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied')
            // setErrorMsg('Permission to access location was denied');
            return;
        }

        let userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced, });
        setUserLocation(userLocation);
        console.log(userLocation)
    };



    // const requestLocal = async ({ pickupAddress, dropoffAddress }) => {
    const requestLocal = async () => {
        console.log('requesting local ride: ', pickupAddress, dropoffAddress)
        socket.emit('request_local_ride', { user: masterState.user, fare: fareParams.fare, pickupAddress, dropoffAddress, createdAt: new Date(), })
        setMasterState(masterState => {
            return ({ ...masterState, user: { ...masterState.user, localRide: { fare: fareParams.fare, pickupAddress, dropoffAddress, createdAt: new Date(), } } })
        })
    }

    let openPaymentSheet = LocalRideStripeConfig({ user: masterState.user, fare: fareParams.fare, pickupAddress, dropoffAddress, requestLocal, setLoadingPayForm })



    const dropoffInput = (dropoffAddress) => {
        setDropoffAddress(dropoffAddress)
        // setRequestTime(
        //     add(new Date(), {minutes:20})
        // )
        // console.log('new date: ', new Date())
        calcFare({ pickupAddress, dropoffAddress })
    }

    useEffect(() => {
        const asyncWrapper = async () => {
            locationFunc()
        }
        asyncWrapper()
    }, [])


    useEffect(() => {
        let rideTime = setInterval(
            () => setRequestTime(
                add(new Date(), { minutes: 20 })
            ),
            2 * 60 * 1000)

        return () => clearInterval(rideTime)
    }, [])


    const [slideValue] = useState(new Animated.Value(180));
    const slideUp = (selection) => {
        Animated.spring(slideValue, {
            toValue: selection == 'up' ? 250 : 180,
            useNativeDriver: false,
            friction: 10
        }).start();
    }

    // const [mapHeightValue] = useState(new Animated.Value(windowHeight-220));
    // const mapHeight = (selection) => {
    //     Animated.spring(mapHeightValue, {
    //         toValue: selection == 'up' ? windowHeight-410 : windowHeight-220,
    //         useNativeDriver: false,
    //         friction: 10
    //     }).start();
    // }

    const submitRequest = () => {
        if (!masterState.user) {
            Alert.alert("Please Sign In", "Please sign in before ordering your ride. Thank you!", [
                {
                    text: 'OK',
                    onPress: () => { navigation.navigate('Account') },
                },
            ])
        } else {
            setLoadingPayForm(true); openPaymentSheet()
        }
    }

    useFocusEffect(
        useCallback(() => {
            slideUp('up')
            // mapHeight('up')
            return () => {
                slideUp('down')
            }
        }, [])
    )

    const [modalVisible, setModalVisible] = useState(false)

    useFocusEffect(
        useCallback(() => {
            //    console.log('KJNASDF;KJNASK;JDFN S;KJDNFK;AJSNDF;KJNASD;KJNASDV;KJNASD LKNSDFK;JNASD;KJFN A;KSJDNF;KSAJDFN;SDKAJFN')
            let modalTimeout = setTimeout(() => setModalVisible(!masterState.onDemandActive), 1000)
            return () => clearTimeout(modalTimeout)

        }, [])
    )

    return (
        <>
            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.6)', }}>
                    <TouchableOpacity onPress={() => { setModalVisible(false); navigation.goBack() }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />
                    <View style={{ width: windowWidth * .9, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', top: windowHeight * .1, alignSelf: 'center', borderRadius: 40, padding: 20, }}>
                        <View style={{ marginTop: 0, padding: 30, backgroundColor: '#e6e6e6', borderRadius: 30, alignItems: 'center', }}>
                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', marginBottom: 20 }}>No drivers in range right now.</Text>
                            <Image source={require('../assets/telescope.png')} style={{ height: windowWidth * .5, width: windowWidth * .5, marginTop: -30, backgroundColor: null }} />
                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', }}>This is a brand new feature and will only get better. Thanks for trying again soon!</Text>
                            <TouchableOpacity style={{ padding: 14, backgroundColor: '#ffcf56', borderRadius: 20, marginTop: 30 }} onPress={() => { setModalVisible(false); navigation.goBack() }}>
                                <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Go Back</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>

            <StripeProvider
                // publishableKey='pk_test_51Ov1U9JhmMKAiBpVk0Yi4caz54y15SeJmshn5treNiYIEK5hB9z5z0CoOcqTUccG6pSifKP3cvLThjXJKzwq7egw00zhn8XsAI' // pc payments
                // publishableKey="pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT"  //pc app
                publishableKey="pk_live_51Nj9WRAUREUmtjLCliIgWk6tgmUXBHSOGsmmaNIC6Tb9UT4BVNEAK40DNXsrljEJHLHxJsj0CyU0qdU5ozO4I1Eb00SdEyvrQ9"  //pc app
                urlScheme="your-url-scheme"
            >

                <View style={{ height: '100%', width: '100%', backgroundColor: '#fff' }}>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 70, left: 16, backgroundColor: '#fff', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                        <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={24} color="black" />
                    </TouchableOpacity>

                    <View style={{ position: 'absolute', top: 70, right: 16, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                        <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                    </View>

                    {scheduleStep === 'pickup' &&

                        <Animated.View style={{ position: 'absolute', backgroundColor: '#fff', height: keyboardFocused ? (Platform.OS == 'ios' ? keyboardHeight ? '80%' : 250 : 250) : slideValue, width: windowWidth, bottom: 0, zIndex: 99, borderRadius: 40, width: '100%', }}>

                            <View style={{ backgroundColor: '#e6e6e6', margin: 20, borderRadius: 30, paddingVertical: 20 }}>
                                <Text style={{ marginHorizontal: 20, marginBottom: 10, fontSize: 24, fontFamily: 'Aristotelica-Regular' }}>Select Pickup</Text>

                                {!keyboardFocused ?
                                    <TouchableOpacity onPress={() => setKeyboardFocused(true)} style={{ padding: 8, backgroundColor: '#f2f2f2', borderRadius: 20, paddingLeft: 10, fontSize: 15, flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }}  >
                                        <Feather name="arrow-up-right" size={24} color="black" />
                                        <View style={{ paddingLeft: 10, flex: 7 }}>
                                            <Text style={{ fontWeight: 500, fontSize: 18, fontFamily: 'PointSoftSemiBold' }} numberOfLines={1}>{pickupAddress}</Text>
                                            <Text style={{ fontWeight: 400, color: '#4f4f4f', fontSize: 16, fontFamily: 'Aristotelica-Regular' }}>Pickup Location</Text>
                                        </View>

                                    </TouchableOpacity>


                                    :
                                    <View style={{ height: 50, backgroundColor: '#f2f2f2', borderRadius: 20, paddingLeft: 10, fontSize: 15, marginHorizontal: 20, marginBottom: 10, alignItems: 'center', flexDirection: 'row', }}>
                                        <Feather name="arrow-down-right" size={24} color="black" />
                                        <TextInput style={{ paddingLeft: 10, backgroundColor: null, height: '100%', width: '100%', fontFamily: 'PointSoftSemiBold' }} autoFocus={true} ref={pickupRef} onChangeText={(text) => { searchLocation(text); setLocation(text) }}
                                            placeholder='Pickup Location' placeholderTextColor={'#737373'} value={location} onFocus={() => setKeyboardFocused(true)} onBlur={() => setKeyboardFocused(false)} />
                                    </View>

                                }

                            </View>
                            <View style={{ marginLeft: 20, }}>

                                {
                                    keyboardFocused &&

                                    <View>
                                        <Text>
                                            Search Results
                                        </Text>
                                        {

                                            pickupSearchResults.map((item, index) => {
                                                return (


                                                    <>


                                                        <View style={{ borderTopWidth: index == 0 ? 0 : 1, borderTopColor: '#b2b9ac', }} key={item.place_id}>
                                                            <TouchableHighlight
                                                                underlayColor="#DDDDDD"
                                                                style={{ zIndex: 10, flexDirection: 'row', paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' }}
                                                                onPress={() => { setPickupAddress(item.description);; pickupRef.current.blur(); }}
                                                            >
                                                                <>
                                                                    <FontAwesome6 name="location-dot" size={14} color="#999" />
                                                                    <Text numberOfLines={1} style={{ padding: 6, fontSize: 16, flex: 1, color: '#000', fontWeight: 500, fontFamily: 'PointSoftSemiBold' }}>{item.description}</Text>
                                                                </>
                                                            </TouchableHighlight>
                                                        </View>


                                                    </>
                                                );

                                            })

                                        }
                                    </View>
                                }

                            </View>

                            {!keyboardFocused &&
                                <TouchableOpacity onPress={() => { setScheduleStep('dropoff'); }} style={{ bottom: 10, position: 'absolute', flex: 1, width: '100%', padding: 20 }}>
                                    <View style={{ backgroundColor: '#FFCF56', padding: 14, borderRadius: 42, alignItems: 'center' }}>
                                        <Text style={{ color: '#000', fontSize: 26, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Continue</Text>
                                    </View>
                                </TouchableOpacity>
                            }


                        </Animated.View>



                    }




                    {scheduleStep === 'dropoff' &&




                        <View style={{ position: 'absolute', backgroundColor: '#fff', height: keyboardFocused ? (Platform.OS == 'ios' ? keyboardHeight ? '80%' : 360 : 360) : 360, width: windowWidth, bottom: 0, zIndex: 99, borderRadius: 40, width: '100%', }}>

                            <View style={{ backgroundColor: '#e6e6e6', margin: 20, borderRadius: 30, paddingVertical: 20, }}>

                                {keyboardFocused && <Text style={{ marginHorizontal: 20, marginBottom: 10, fontSize: 24, fontFamily: 'Aristotelica-Regular' }}>Select Dropoff</Text>}

                                {!keyboardFocused &&
                                    <>
                                        <View style={{ margin: 20, marginBottom: 0, paddingHorizontal: 0, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -20, }}>
                                                {/* <FontAwesome5 name="car" size={50} color="#a2a2a2" style={{ marginRight: 4 }} /> */}
                                                <Image style={{ height: 60, width: 60, marginTop: -10 }} resizeMode='contain' source={require('../assets/car-location.png')} />
                                                <View style={{}}>
                                                    <Text style={{ fontSize: 20, marginBottom: 0, color: '#404040', fontFamily: 'PointSoftLight' }}>10-20 min</Text>
                                                    <Text style={{ fontSize: 16, color: '#404040', alignSelf: 'flex-start', marginTop: -2, fontFamily: 'PointSoftLight' }}>to pickup</Text>
                                                </View>
                                            </View>
                                            {requestTime && <Text style={{ fontSize: 35, color: '#404040', fontFamily: 'PointSoftSemiBold' }}>{formatInTimeZone(requestTime, 'America/Denver', "h':'mm aaa")}</Text>}
                                        </View>

                                        <View style={{ height: 50, backgroundColor: '#f2f2f2', borderRadius: 20, paddingLeft: 10, fontSize: 15, flexDirection: 'row', alignItems: 'center', margin: 20 }}  >
                                            <Feather name="arrow-up-right" size={24} color="black" />
                                            <View style={{ paddingLeft: 10, flex: 7 }}>
                                                <Text style={{ fontWeight: 500, fontFamily: 'PointSoftSemiBold' }} numberOfLines={1}>{pickupAddress}</Text>
                                                <Text style={{ fontWeight: 400, color: '#4f4f4f', fontFamily: 'PointSoftSemiBold' }}>Pickup Location</Text>
                                            </View>
                                            <TouchableOpacity style={{ flex: 3, textAlign: 'center', }} onPress={() => { setScheduleStep('pickup'); setKeyboardFocused(false) }} >
                                                <Text style={{ color: '#3366ff', fontWeight: 500, fontFamily: 'PointSoftSemiBold' }}>Change</Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* <View style={{ borderBottomWidth: 1, borderBottomColor: '#e6e6e6' }} /> */}
                                    </>
                                }



                                <View style={{ height: 50, backgroundColor: '#f2f2f2', borderRadius: 20, paddingLeft: 10, fontSize: 15, marginHorizontal: 20, marginBottom: 10, alignItems: 'center', flexDirection: 'row', }}>
                                    <Feather name="arrow-down-right" size={24} color="black" />
                                    <TextInput style={{ paddingLeft: 10, backgroundColor: null, height: '100%', width: '100%', flex: 1, fontFamily: 'PointSoftSemiBold' }} autoFocus={true} ref={pickupRef} onChangeText={(text) => { searchLocation(text); dropoffInput(text) }}
                                        placeholder='Dropoff Location' placeholderTextColor={'#737373'} value={dropoffAddress} onFocus={() => setKeyboardFocused(true)} onBlur={() => setKeyboardFocused(false)} />
                                </View>
                            </View>

                            <View style={{ marginLeft: 20, }}>


                                {

                                    keyboardFocused &&

                                    <View>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular' }}>
                                            Search Results
                                        </Text>
                                        {

                                            dropoffSearchResults.map((item, index) => {
                                                return (
                                                    <>
                                                        <View style={{ borderTopWidth: index == 0 ? 0 : 1, borderTopColor: '#b2b9ac', }} key={item.place_id}>
                                                            <TouchableHighlight
                                                                underlayColor="#DDDDDD"
                                                                style={{ zIndex: 10, flexDirection: 'row', paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' }}
                                                                onPress={() => { console.log('yes yes yes yes'); dropoffInput(item.description); pickupRef.current.blur(); }}
                                                            >
                                                                <>
                                                                    <FontAwesome6 name="location-dot" size={14} color="#999" />
                                                                    <Text numberOfLines={1} style={{ padding: 6, fontSize: 16, flex: 1, color: '#000', fontWeight: 500 }}>{item.description}</Text>
                                                                </>
                                                            </TouchableHighlight>
                                                        </View>
                                                    </>
                                                );
                                            })
                                        }
                                    </View>
                                }
                            </View>

                            {!keyboardFocused &&
                                <>
                                    {
                                        loadingPayForm ?
                                            <View style={{ bottom: 10, position: 'absolute', flex: 1, width: '100%', padding: 10, paddingHorizontal: 20 }}>
                                                <View style={{ backgroundColor: '#FFCF56', padding: 14, borderRadius: 42, alignItems: 'center', }}>
                                                    <ActivityIndicator size={'large'} color={'white'} />
                                                </View>
                                            </View>
                                            :
                                            <TouchableOpacity onPress={submitRequest} style={{ bottom: 10, position: 'absolute', flex: 1, width: '100%', padding: 10, paddingHorizontal: 20 }}>
                                                <View style={{ backgroundColor: '#FFCF56', padding: 14, borderRadius: 42, alignItems: 'center' }}>
                                                    <Text style={{ fontSize: 24 }}>${fareParams.fare}  <Text style={{ color: '#000', fontSize: 26, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Book Ride</Text></Text>
                                                </View>
                                            </TouchableOpacity>
                                    }
                                </>
                            }


                        </View>

                    }
                    <Animated.View style={{}}>
                        {userLocation && <MapComponent pinAddress={pinAddress} setPinAddress={setPinAddress} scheduleStep={scheduleStep} setScheduleStep={setScheduleStep} setPickupAddress={setPickupAddress} setUserLocation={setUserLocation} userLocation={userLocation} />}
                    </Animated.View>
                </View >

            </StripeProvider >

        </>
    )

}

