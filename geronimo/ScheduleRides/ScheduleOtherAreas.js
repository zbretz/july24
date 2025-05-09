import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated, LayoutAnimation, Modal, Alert, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Entypo, Feather, Octicons, FontAwesome6, Ionicons, AntDesign } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import axios from 'axios';
import { socket } from '../CoreNav/socket';
import * as Animatable from 'react-native-animatable';
import { formatInTimeZone } from "date-fns-tz";
import { url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default OtherAreas = ({ isConnected, masterState, setMasterState, navigation, address }) => {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const { user } = masterState

    const [rideType, setRideType] = useState(1)
    const [date, setDate] = useState(new Date());
    const carouselRef = useRef(null)
    const [destination, setDestination] = useState('')
    const [pickupLocation, setPickupLocation] = useState('')
    const [fare, setFare] = useState(0)
    const [carouselIndex, setCarouselIndex] = useState(0)

    const [pickupAddressNotRecognized, setPickupAddressNotRecognized] = useState(true)
    const [dropoffAddressNotRecognized, setDropoffAddressNotRecognized] = useState(true)
    const [addressError, setAddressError] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const errorTimeout = () => {
        setAddressError(true)
        setTimeout(() => {
            setAddressError(false)
        }, 3000)
    }

    const nextPage = () => {
        if (destination.length === 0 || pickupLocation.length === 0) {
            errorTimeout()
            return
        }
        setCarouselIndex(carouselIndex => carouselIndex + 1)
        console.log(carouselRef.current.getCurrentIndex());
        carouselRef.current.next()
    }

    const prevPage = () => {
        setCarouselIndex(carouselIndex => carouselIndex - 1)
        console.log(carouselRef.current.getCurrentIndex());
        carouselRef.current.prev()
    }


    let rideRequest = {
        pickupDateTime: date,
        pickupDateTimeEpoch: date.valueOf(),
        driver: null,
        pickupAddress: pickupLocation,
        dropoffAddress: destination,
        rideType: rideType,
        fare: fare[rideType],
        note: null,
    }

    rideRequest = {
        ...rideRequest,
        rideCompleted: false,
        rideCanceledByDriver: false,
        rideCanceledByRider: false,
        driverEnroute: false,
        driverHasArrived: false,
        paid: false,
        datetimeOfRequest: Date.now(),
        user: user ? { _id: masterState.user._id, firstName: masterState.user.firstName, lastName: masterState.user.lastName, phone: masterState.user.phone } : null,
        chatLog: []
    }



    const [complete, setComplete] = useState(false)
    const [countdown, setCountdown] = useState(10)

    let completActionTimeout
    let completeActionCountdown

    const completeAction = () => {
        setComplete(true)

        completActionTimeout = setTimeout(() => {
            navigation.navigate('RideType')
            setComplete(false)
        }, 10000)

        completeActionCountdown = setInterval(() => {
            setCountdown(countdown => countdown - 1)
        }, 1000)
    }

    const closeAcceptance = () => {
        navigation.navigate('RideType')
        setComplete(false)
    }


    const requestSchedule = async () => {

        if (!user) {
            setModalVisible(true);
            return
        }

        console.log('request ride: ', rideRequest)
        socket.emit('request_scheduled_ride', rideRequest, (rideid) => {

            rideRequest = { ...rideRequest, _id: rideid }
            let activeRides = masterState.user.activeRides.length ? [...masterState.user.activeRides, rideRequest] : [rideRequest]
            setMasterState(masterState => { return { ...masterState, user: { ...masterState.user, activeRides } } })
            completeAction()
        })

    }

    useEffect(() => {
        //MAKE THIS USE CALLBACK INSTEAD..NO NEED TO RUN BEFORE DATA
        if (carouselIndex !== 1) return
        console.log('schedule airport useEffect')

        axios.get(`${url}/determineFare?pickup=${rideRequest.pickupAddress}&dropoff=${rideRequest.dropoffAddress}&rideType=${rideType}`)
            .then(fare => {
                if (!fare.data) {
                    fare = null
                    return
                }
                setFare(fare.data)
            })
            .catch(e => console.log('error: ', e))

        return () => clearTimeout(completActionTimeout)

    }, [carouselIndex])

    console.log('carousel index: ', carouselIndex)

    return (

        <>



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


            {complete &&
                <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent' }}>

                    <Animatable.View
                        style={{ zIndex: 1 }}
                        animation={{
                            from: { left: '-150%' }, // Start position
                            to: { left: '0%' }, // End position
                        }}
                        delay={0}
                    >


                        <View style={{ backgroundColor: 'rgba(255,255,255,1)', height: windowHeight, width: '100%', alignItems: 'center', }}>


                            <TouchableOpacity style={{ alignSelf: 'flex-end', paddingRight: 25, position: 'absolute', top: 40, right: 0 }} onPress={() => closeAcceptance()}>
                                <AntDesign name="closecircleo" size={24} color="#353431" />
                            </TouchableOpacity>

                            <Image style={{ width: windowWidth * .5, height: windowWidth * .5, borderRadius: 30, marginTop: 10 }} resizeMode='contain' source={require('../assets/airplane.png')} />

                            {/* <LottieView speed={.4} style={{ height: 120, width: 120, marginTop: 50 }} source={require('../assets/lottie-complete.json')} autoPlay /> */}
                            <View style={{ padding: 20, paddingTop: 10, }}>
                                <Text style={{ fontSize: 24, fontWeight: '400', width: '100%', fontFamily: 'Aristotelica-Regular' }}>Ride Scheduled</Text>
                            </View>

                            <View style={{ padding: 8, paddingTop: 0, backgroundColor: '#f2f2f2', width: '80%', borderRadius: 20 }}>
                                <View style={{ padding: 10, borderRadius: 10, marginTop: 0, }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular', color: '#595959', marginTop: 14 }}>Your driver</Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular' }}>Your ride will be confirmed with a driver assignment shortly.</Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular', color: '#595959', marginTop: 14 }}>Communication</Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular' }}>After assignment, you can message with your driver directly.</Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular', marginTop: 6 }}>You can call our support number around the clock.</Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular', color: '#595959', marginTop: 14 }}>Thank You</Text>
                                    <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular' }}>For suppporting our local Park City business.</Text>
                                </View>

                            </View>

                            <Text style={{ position: 'absolute', bottom: windowHeight * .08, fontSize: 18, }}>{countdown}</Text>

                        </View>

                    </Animatable.View>

                </View>

            }


            <View style={{ height: '100%', backgroundColor: '#fff', zIndex: -1 }}>

                <View style={{ backgroundColor: '#fff', padding: 32, }}>
                    <TouchableOpacity onPress={() => { carouselIndex === 1 ? prevPage() : navigation.goBack() }}><Ionicons name="chevron-back-outline" size={24} color="black" /></TouchableOpacity>
                </View>

                <View style={{ position: 'absolute', top: 24, right: 24, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', }} name="arrow-back-ios" size={24} color="black" >
                    <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                </View>


                <View style={{ marginTop: -10, paddingBottom: 76, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1, shadowColor: '#000', }}>

                    <Carousel
                        ref={carouselRef}
                        enabled={false}
                        loop={false}
                        width={windowWidth}
                        // height={windowWidth / 2}
                        // autoPlay={true}
                        data={[...new Array(4).keys()]}
                        scrollAnimationDuration={1000}
                        onSnapToItem={(index) => console.log('current index:', index)}
                        renderItem={({ index }) => {
                            if (index == 0) return <Tab0 date={date} setDate={setDate} nextPage={nextPage} pickupLocation={pickupLocation} setPickupLocation={setPickupLocation} destination={destination} setDestination={setDestination} addressError={addressError} setAddressError={setAddressError} />
                            if (index == 1) return <Tab3 nextPage={nextPage} date={date} pickupLocation={pickupLocation} destination={destination} fare={fare} rideType={rideType} setRideType={setRideType} />

                        }}
                    />

                </View>

                {
                    <TouchableOpacity onPress={() => {
                        carouselIndex == 1 ? requestSchedule() : nextPage()
                    }} style={{ backgroundColor: '#ffcf56', height: 56, width: '85%', alignSelf: 'center', position: 'absolute', bottom: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} >
                        <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>{carouselIndex == 1 ? 'Book Ride' : 'Next'}</Text>
                    </TouchableOpacity>
                }

            </View>
        </>
    );
}


const Tab0 = ({ date, setDate, pickupLocation, setPickupLocation, destination, setDestination, addressError }) => {

    const [pickupAddressNotRecognized, setPickupAddressNotRecognized] = useState(true)
    const [dropoffAddressNotRecognized, setDropoffAddressNotRecognized] = useState(true)
    const [inputFocused, setInputFocused] = useState(false)

    const [addressModal, setAddressModal] = useState(false)





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






    const pickupRef = useRef(null);
    const dropoffRef = useRef(null);
    const [searchResults, setSearchResults] = useState([])

    const validateAddress = (param) => {
        param = param.toLowerCase().replaceAll(' ', '+')
        console.log('param: ', param)
        axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/geocode/json?address=${param}&key=AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI`,
            })
            .then((response) => {
                console.log('address recognized?: ', !!response.data.results.length);

                if (!response.data.results.length) setPickupAddressNotRecognized(true)
                else setPickupAddressNotRecognized(false)

            })
            .catch((e) => {
                console.log('catch: ', e.response);
            })
    }

    const API_KEY = 'AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI';
    const searchLocation = async (text) => {
        if (!text.length) { setSearchResults([]); return }
        console.log(text)
        axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${text}&location=40.6856%111.5563&radius=50000&region=US`,
            })
            .then((response) => {
                setSearchResults(response.data.predictions)
            })
            .catch((e) => {
                console.log(e.response);
            })

    };


    return (
        <>


            <Modal visible={addressModal}
                animationType='slide'
                transparent={true}
                style={{ flex: 1, zIndex: 11 }}>
                <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: '100%', alignItems: 'center', }} onPress={() => setAddressModal(false)}>
                        <View style={{ width: '90%', backgroundColor: '#fff', padding: 10, borderRadius: 20 }}>
                            <View style={{ marginBottom: 0, padding: 10 }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18 }}>Please select an address from the dropdown options.</Text>
                            </View>
                            <View style={{ borderBottomWidth: 1, width: '100%', }} />
                            <TouchableOpacity onPress={() => setAddressModal(false)} style={{ padding: 14 }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18 }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            {!inputFocused &&

                <>
                    <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                        <Image style={{ marginHorizontal: 0, flex: 1, marginRight: 10, height: windowHeight * .15, width: windowHeight * .15, flex: 2 }} source={require('../assets/car-schedule.png')} />
                        <View style={{ flex: 4, justifyContent: 'center' }}>
                            <Text style={{ flexWrap: 'wrap', fontSize: 28, padding: 0, fontFamily: 'Aristotelica-Regular', }} adjustsFontSizeToFit={true} numberOfLines={1}>Schedule a Ride</Text>
                            <Text style={{ flexWrap: 'wrap', fontSize: 18, padding: 0, fontFamily: 'Aristotelica-Regular', }} adjustsFontSizeToFit={true} numberOfLines={3}>Restaurants, Main Street, Heber, Kamas, and More.</Text>
                        </View>
                    </View>



                    {Platform.OS == 'ios' &&
                        <View style={{ marginTop: 0, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20 }}>
                            <Text style={{ marginLeft: 10, fontSize: 24, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Pickup Time</Text>
                            <View style={{ borderRadius: 20, backgroundColor: '#f2f2f2', }}>
                                <DateTimePicker
                                    timeZoneName={'America/Denver'}
                                    style={{ marginTop: -10, backgroundColor: '#f2f2f2', transform: [{ scale: .84 }], alignSelf: 'center', height: windowHeight < 800 ? 150 : 180 }}
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

                </>

            }

            <View style={{ marginTop: 20, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, padding: 20, paddingBottom: 20 }}>


                {(!inputFocused || inputFocused == 'pickup') &&
                    <>
                        <Text style={{ marginLeft: 10, fontSize: 24, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Pickup</Text>

                        <TextInput style={{ height: 40, borderRadius: 16, backgroundColor: '#f2f2f2', paddingHorizontal: 8, fontSize: 16, fontFamily: 'PointSoftSemiBold' }}
                            ref={pickupRef}
                            autoCapitalize={'none'}
                            placeholderTextColor={'#77756e'}
                            onFocus={() => setInputFocused('pickup')}
                            onBlur={() => { setInputFocused(false); setSearchResults([]) }}
                            // placeholder={'Pickup Address'}
                            value={pickupLocation}
                            onChangeText={(text) => { searchLocation(text); setPickupLocation(text); if (text.length === 0) setPickupAddressNotRecognized(true) }}

                            blurOnSubmit={false}
                            onSubmitEditing={() => { setAddressModal(true) }}
                        />
                    </>
                }


                {(!inputFocused || inputFocused == 'dropoff') &&
                    <>
                        <Text style={{ marginTop: 10, marginLeft: 10, fontSize: 24, fontWeight: '600', textAlign: 'left', fontFamily: 'Aristotelica-Regular' }}>Dropoff</Text>

                        <TextInput style={{ height: 40, borderRadius: 16, backgroundColor: '#f2f2f2', paddingHorizontal: 8, fontSize: 16, fontFamily: 'PointSoftSemiBold' }}
                            ref={dropoffRef}
                            autoCapitalize={'none'}
                            placeholderTextColor={'#77756e'}
                            onFocus={() => setInputFocused('dropoff')}
                            onBlur={() => { setInputFocused(false); setSearchResults([]) }}
                            // placeholder={'Pickup Address'}
                            value={destination}
                            onChangeText={(text) => { searchLocation(text); setDestination(text); if (text.length === 0) setDropoffAddressNotRecognized(true) }}

                            blurOnSubmit={false}
                            onSubmitEditing={() => { setAddressModal(true) }}
                        />
                    </>
                }

            </View>

            <View style={{ marginHorizontal: 20 }}>
                {
                    searchResults.map((item, index) => {
                        return (
                            <View style={{ borderTopWidth: index == 0 ? 0 : 1, borderTopColor: '#e6e6e6', }} key={item.place_id}>
                                <TouchableHighlight
                                    underlayColor="#DDDDDD"
                                    style={{ zIndex: 10, flexDirection: 'row', paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' }}
                                    onPress={() => {
                                        if (inputFocused == 'pickup') {
                                            setPickupLocation(item.description); setPickupAddressNotRecognized(false); pickupRef.current.blur();// setSearchResults([])
                                        } else {
                                            setDestination(item.description); setDropoffAddressNotRecognized(false); dropoffRef.current.blur();// setSearchResults([])
                                        }
                                    }
                                    }
                                >
                                    <View>
                                        <FontAwesome6 name="location-dot" size={14} color="#e6e6e6" />
                                        <Text numberOfLines={2} style={{ marginLeft: 10, padding: 6, fontSize: 16, color: '#000', fontFamily: 'PointSoftSemiBold' }}>{item.description}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        );
                    })
                }
            </View>



            {addressError &&
                <View style={{ position: 'absolute', bottom: 80, zIndex: 3, backgroundColor: '#ffb3c2', borderRadius: 20, marginHorizontal: 20, alignSelf: 'center', padding: 16, paddingHorizontal: 20, borderWidth: 2, borderColor: '#cc0029' }}>
                    <Text style={{ fontSize: 20, fontFamily: 'LexendMedium', color: '#cc0029', textAlign: 'center' }}>Address not recognized.</Text>
                    <Text style={{ fontSize: 18, fontFamily: 'LexendRegular', color: '#cc0029', textAlign: 'center', marginTop:6 }}>Please re-input your location.</Text>
                </View>
            }
        </>
    )
}





const Tab3 = ({ rideType, date, destination, pickupLocation, fare, setRideType }) => {

    console.log('fare: ', fare)

    const [infoModal, setInfoModal] = useState(false)

    return (
        <View style={{ height: '100%', }}>

            <Modal visible={infoModal}
                animationType='slide'
                transparent={true}
                style={{ flex: 1, zIndex: 11 }}>
                <View style={{ backgroundColor: 'rgba(0,0,0,.2)', width: '100%', height: '100%', paddingHorizontal: 20, paddingVertical: 60, }}>
                    <ScrollView style={{ width: '100%', height: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20 }} onPress={() => setAddressModal(false)}>

                        <View style={{ marginTop: 10 }}>
                            <TouchableOpacity style={{ zIndex: 12, position: 'absolute', right: 0 }} onPress={() => setInfoModal(false)}>
                                <Feather style={{ marginBottom: 0 }} name="x" size={30} color="#000" />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: 'LexendMedium', fontSize: 20 }}>Vehicle Categories</Text>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, marginVertical: 4, marginTop: 10 }}>Check out our vehicle categories for a better sense of the size and style each category offers. If you still have questions, no worries -- just give us a call!</Text>
                        </View>

                        <View style={{ flex: 1, width: '100%', borderRadius: 10, padding: 0, marginVertical: 16, }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 20 }}>Standard</Text>
                            <Image resizeMode='cover' style={{ width: '100%', height: 200, backgroundColor: '#ecf6f8', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={require('../assets/rav4.webp')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, marginVertical: 4, marginTop: 0 }}>Our most popular option. Room for four adults. Two or three passengers with a suitcase each.</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '100%', borderRadius: 10, padding: 0 }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 20 }}>Premium</Text>
                            <Image resizeMode='cover' style={{ width: '100%', height: 200, backgroundColor: '#ecf6f8', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={require('../assets/tesla.avif')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, marginVertical: 4, marginTop: 0 }}>A ride in a more upscale car. Expect a newer model year or more premium materials. Typically roomier than a standard.</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1, width: '100%', borderRadius: 10, marginVertical: 16, padding: 0 }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 20 }}>XL</Text>
                            <Image resizeMode='cover' style={{ width: '100%', height: 200, backgroundColor: '#ecf6f8', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={require('../assets/Pacifica.webp')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, marginVertical: 4, marginTop: 0 }}>You'll find a third row of seating in these vehicles. If you have oversized luggage, or a larger group with moderate luggage, this might be the right option.</Text>
                            </View>
                        </View>


                        <View style={{ flex: 1, width: '100%', borderRadius: 10, marginBottom: 16, padding: 0 }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 20 }}>Premium XL</Text>
                            <Image resizeMode='cover' style={{ width: '100%', height: 200, backgroundColor: '#ecf6f8', padding: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} source={require('../assets/suburban.avif')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, marginVertical: 4, marginTop: 0 }}>Executive travel or larger groups. These SUVs offer the 'black car' or 'limo' experience.</Text>
                            </View>
                        </View>

                    </ScrollView>
                </View>
            </Modal >


            <View style={{ padding: 8, paddingTop: 0, }}>
                <View style={{ alignItems: 'center', marginBottom: 0, marginTop: 0, backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 24, fontWeight: '600', width: '100%', fontFamily: 'PointSoftSemiBold' }}>{formatInTimeZone(date, 'America/Denver', "eeee',' MMMM do")}</Text>
                    <Text style={{ fontSize: 24, fontWeight: '600', width: '100%', fontFamily: 'PointSoftSemiBold' }}>{formatInTimeZone(date, 'America/Denver', "h':'mm aa")}</Text>
                </View>


                <View style={{ backgroundColor: '#e6e6e6', padding: 0, borderRadius: 20, marginTop: 0, }}>
                    <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 14, marginTop: 0, }}>

                        <Text numberOfLines={1} style={{ fontSize: 15, fontFamily: 'PointSoftSemiBold' }}>Pickup</Text>
                        <Text numberOfLines={1} style={{ fontSize: 19, fontFamily: 'PointSoftSemiBold' }}>{pickupLocation}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 15, fontFamily: 'PointSoftSemiBold' }}>Dropoff</Text>
                        <Text numberOfLines={1} style={{ fontSize: 19, fontFamily: 'PointSoftSemiBold' }}>{destination}</Text>
                    </View>
                </View>

            </View>


            <View>

                <TouchableOpacity onPress={() => setRideType(1)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 1 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={{ height: 36, width: 70, }} source={require('../assets/cr-v.png')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>Standard</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>4</Text>
                                <Ionicons name="person" size={16} color="black" />
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['1']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRideType(2)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 2 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={{ height: 40, width: 70, }} source={require('../assets/tesla.webp')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>Premium</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>4</Text>
                                <Ionicons name="person" size={16} color="black" />
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['2']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRideType(3)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 3 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={{ height: 40, width: 76, marginHorizontal: -3 }} source={require('../assets/kia.png')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontWeight: 500, color: rideType === 1 ? '#000' : '#504e49' }}>XL</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontWeight: 500, color: rideType === 1 ? '#000' : '#504e49' }}>5</Text>
                                <Ionicons name="person" size={16} color="black" />
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['3']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRideType(4)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 4 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image style={{ height: 40, width: 90, marginHorizontal: -10 }} source={require('../assets/suburban.png')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>Premium XL</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>6</Text>
                                <Ionicons name="person" size={16} color="black" />
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['4']}</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}