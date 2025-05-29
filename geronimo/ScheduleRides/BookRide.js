import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated, LayoutAnimation, Modal, Alert, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, FontAwesome6, Ionicons, AntDesign } from '@expo/vector-icons';
import { socket } from '../CoreNav/socket';
import { formatInTimeZone } from "date-fns-tz";
import * as Animatable from 'react-native-animatable';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default BookRide = ({ navigation, masterState, setMasterState, date, destination, pickupLocation, flightNumber, fare }) => {

    console.log('flight number: ', flightNumber)
    const { user } = masterState

    const [rideType, setRideType] = useState(1)
    const [infoModal, setInfoModal] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    console.log('date: ', date)

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

    if (flightNumber) {
        rideRequest = {
            ...rideRequest,
            flightNumber,
        }
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
        user: user ? { _id: user._id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, stripe_customer_id: user.stripe_customer_id, email: user.email, autoReceipts: user.autoReceipts } : null,
        chatLog: [],
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

        console.log('request ride: ', rideRequest)

        if (!user) {
            setModalVisible(true);
            return
        }

        socket.emit('request_scheduled_ride', rideRequest, (rideid) => {
            rideRequest = { ...rideRequest, _id: rideid }
            let activeRides = masterState.user.activeRides.length ? [...masterState.user.activeRides, rideRequest] : [rideRequest]
            setMasterState(masterState => { return { ...masterState, user: { ...masterState.user, activeRides } } })
            completeAction()
        })

    }

    useEffect(() => {
        return () => clearTimeout(completActionTimeout)
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            {complete &&
                <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent' }}>
                    <Animatable.View
                        style={{ zIndex: 2 }}
                        animation={{
                            from: { left: '-150%' }, // Start position
                            to: { left: '0%' }, // End position
                        }}
                        delay={0}
                    >
                        <View style={{ backgroundColor: 'rgba(255,255,255,1)', height: windowHeight, width: '100%', alignItems: 'center', }}>
                            <Image style={{ width: windowWidth * .5, height: windowWidth * .5, borderRadius: 30, marginTop: 10 }} resizeMode='contain' source={require('../assets/airplane.png')} />
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
                            <TouchableOpacity style={{
                                alignSelf: 'center', top: 40, right: 0, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 20,
                                shadowColor: '#000',
                                shadowOpacity: 0.28,
                                shadowRadius: 2,
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                },
                            }} onPress={() => closeAcceptance()}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 24 }}>Ok</Text>
                            </TouchableOpacity>
                            <Text style={{ position: 'absolute', bottom: windowHeight * .08, fontSize: 18, }}>{countdown}</Text>
                        </View>
                    </Animatable.View>
                </View>
            }

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.6)', }}>

                    <TouchableOpacity onPress={() => { console.log('close modal'); setModalVisible(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                    <View style={{ height: windowHeight * .4, width: windowWidth * .9, backgroundColor: '#e2e2e2', alignItems: 'center', justifyContent: 'center', top: windowHeight * .1, alignSelf: 'center', borderRadius: 40, padding: 20 }}>

                        <View style={{ backgroundColor: '#fff', flex: 1, width: '100%', borderRadius: 30 }}>

                            <View style={{ marginTop: 0, padding: 0, borderRadius: 30, alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                                <View style={{ height: '30%', width: '100%', flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', }}>
                                    <Image style={{ flex: 1, marginRight: 10, }} resizeMode='contain' source={require('../assets/traffic-lights.png')} />
                                    <Text style={{ color: '#000', fontSize: 25, fontFamily: 'LexendRegular', flexWrap: 'wrap', flex: 3 }} adjustsFontSizeToFit={true} numberOfLines={2}>Please sign in to book this ride. Thanks!</Text>
                                </View>

                                <TouchableOpacity style={{ padding: 16, borderWidth: 0, borderRadius: 20, marginTop: 20, backgroundColor: '#ffcf56' }} onPress={() => { setModalVisible(false); navigation.navigate('Account') }}><Text style={{ fontFamily: 'LexendRegular', fontSize: 19 }}>Sign In</Text></TouchableOpacity>
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
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, marginVertical: 4, marginTop: 0 }}>You'll find a third row of seating in these SUVs and minivans. If you have oversized luggage, or a larger group with moderate luggage, this might be the right option.</Text>
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


                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 14, marginTop: 0, }}>
                    <Text numberOfLines={1} style={{ fontSize: 15, fontFamily: 'PointSoftSemiBold' }}>Pickup</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text numberOfLines={1} style={{ fontSize: 19, fontFamily: 'PointSoftSemiBold' }}>{pickupLocation}</Text>
                        {flightNumber ? <Text numberOfLines={1} style={{ fontSize: 16, fontFamily: 'PointSoftLight' }}> Flight {flightNumber}</Text> : null}
                    </View>
                    <Text numberOfLines={1} style={{ fontSize: 15, fontFamily: 'PointSoftSemiBold' }}>Dropoff</Text>
                    <Text numberOfLines={1} style={{ fontSize: 19, fontFamily: 'PointSoftSemiBold' }}>{destination}</Text>
                </View>

            </View>


            <View>

                <TouchableOpacity onPress={() => setRideType(1)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 1 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ height: 40, width: 70, }} source={require('../assets/cr-v.png')} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>Standard</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 16, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>4</Text>
                                <Ionicons name="person" size={16} color="black" />
                            </View>
                        </View>
                    </View>
                    {fare ?
                        <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['1']}</Text>
                        : null}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRideType(2)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 2 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row' }}>
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
                    {fare ?
                        <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['2']}</Text>
                        : null}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRideType(3)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 3 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row' }}>
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
                    {fare ?
                        <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['3']}</Text>
                        : null}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setRideType(4)} style={{ justifyContent: 'space-between', backgroundColor: rideType == 4 ? '#fff1cc' : '#fff', borderRadius: 20, marginHorizontal: 10, padding: 10, paddingVertical: 16, flexDirection: 'row' }}>
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
                    {fare ?
                        <Text style={{ textAlign: 'center', marginTop: 0, fontSize: 18, fontFamily: 'PointSoftSemiBold', color: rideType === 1 ? '#000' : '#504e49' }}>${fare['4']}</Text>
                        : null}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setInfoModal(true)} style={{ borderRadius: 40, padding: 8, paddingHorizontal: 10, marginHorizontal: 20, marginTop: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffe5ea', justifyContent: 'space-around', alignSelf: 'flex-start', flexDirection: 'row' }} >
                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', marginRight: 10, fontWeight: '600' }}>More info</Text>
                    <AntDesign name="rightcircle" size={17} color="#ff99ad" />
                </TouchableOpacity>


            </View>

            <TouchableOpacity onPress={() => { requestSchedule() }} style={{ backgroundColor: '#ffcf56', height: 56, width: '85%', alignSelf: 'center', zIndex: 1, position: 'absolute', bottom: 20, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Book Ride</Text>
            </TouchableOpacity>


        </View >

    )
}