import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Dimensions, Image, Modal } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Entypo, MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import axios from 'axios';
import { url } from '../url_toggle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import Booking from '../Childcare/Booking';
import { socket } from '../CoreNav/socket';
import CallDriverButton from './CallDriverButton';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let boxDimensions = (windowWidth - 30) / 2

const Stack = createStackNavigator();

export default DriverPages = ({ navigation, masterState, setMasterState, }) => {

    console.log('driver pages: ', masterState.user)

    // const [booking, setBooking] = useState(true)

    // if (booking) return <PrivateBookingDetail navigation={navigation} />


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="DriverPagesHome">
                {props => <DriverPagesHome {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="PrivateBookingDetail">
                {props => <PrivateBookingDetail {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>


            <Stack.Screen name="QuickIdea" options={{ presentation: "transparentModal" }}>
                {props => <QuickIdea {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="Profile" options={{ presentation: "modal" }}>
                {props => <Profile {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="PrivateBooking1" options={{}}>
                {props => <PrivateBooking1 {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="PrivateBooking2" options={{}}>
                {props => <PrivateBooking2 {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>

            <Stack.Screen name="DirectDriverDetail" options={{}}>
                {props => <DirectDriverDetail {...props} masterState={masterState} setMasterState={setMasterState} />}
            </Stack.Screen>



        </Stack.Navigator>
    );

}


// On the driver side:
// Review/Accept Booking (if reject, notify zach...respond to user: 'under review')
// Set Final Price / Finish Ride
// Improve Driver contract

// Setup calling --> dedicated driver number
// Driver Book Ride (for client)

const PrivateBookingDetail = ({ navigation, masterState }) => {

    const { user } = masterState



    // const rideDetail = {
    //     bookingCompleted: false,
    //     bookingCanceledByDriver: false,
    //     bookingCanceledByRider: false,
    //     bookingId: '123',
    //     pickupDateTime: new Date(),
    //     driver: { firstName: "Denette" },
    //     pickupAddress: "743 Evergreen Terrace",
    //     dropoffAddress: "123 Main Street",
    //     chatLog: [],
    //     user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, stripe_customer_id: user.stripe_customer_id, email: user.email, autoReceipts: user.autoReceipts },

    // }


    const rideDetail = masterState.user.directBooking

    const needHelp = () => {
        Alert.alert('Phone Support',
            `Press "Call" for phone support!`, [
            {
                text: 'Back', onPress: () => {
                }
            },
            {
                text: 'Call', onPress: () => {
                    Linking.openURL(`tel:${9175751955}`)
                }
            },
        ])
    }

    if (!rideDetail) { navigation.navigate('RideType'); return null }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, zIndex: 11, padding: 20, }} onPress={() => navigation.navigate('RideType')}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'LexendMedium', textAlign: 'center' }}>Direct Booking</Text>

            <View style={{ flexDirection: 'row', margin: 10, backgroundColor: '#f2f2f2', padding: 10, borderRadius: 16, borderTopLeftRadius: 70, borderTopRightRadius: 70 }}>
                <Image style={{ zIndex: 22, width: 120, height: 120, borderRadius: 80, borderWidth: 3, borderColor: '#fff' }} resizeMode='cover' source={require('../assets/denette2.webp')} />
                <View style={{}}>
                    <View style={{ marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 22, color: '#000', fontFamily: 'LexendMedium', }}>Denette</Text>
                        <Text style={{ fontSize: 16, color: '#000', fontFamily: 'LexendRegular', }}>Ford Expedition Max</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="person" size={16} color="#333333" />
                            <Text style={{ fontSize: 16, color: '#333333', fontFamily: 'LexendRegular', }}>6</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ paddingHorizontal: 10, width: '100%', marginTop: 0 }}>

                <View style={{}}>
                    <View style={{ width: '100%', marginBottom: 10, alignItems: 'center' }}>

                        <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'LexendMedium', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "eeee, MMMM d")}</Text>
                        <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>

                    </View>




                    <View style={{ borderRadius: 30, justifyContent: 'center', marginVertical: 0, borderWidth: 7, borderColor: '#e6e6e6' }}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 16, }}>
                            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'LexendRegular', }}>Pickup</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.pickupAddress}</Text>
                                {rideDetail.flightNumber && <Text numberOfLines={1} style={{ fontSize: 16, fontFamily: 'PointDemiBold' }}> Flight {rideDetail.flightNumber}</Text>}
                            </View>
                            <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'LexendRegular', }}>Dropoff</Text>
                            <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.dropoffAddress}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, marginBottom: 20 }}>
                        {rideDetail.chatLog.length ?
                            <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 10, }} >
                                <Text style={{ marginHorizontal: 10, fontSize: 18, color: "#000", fontFamily: 'LexendRegular' }}>Driver Chat</Text>
                                <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'PointSoftLight', fontSize: 18, backgroundColor: '#fff', }} numberOfLines={2}>{chatLog[chatLog.length - 1].text}</Text>
                                    <Entypo name="chat" size={32} color="black" style={{ position: 'absolute', right: 20 }} />
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 20, }} >
                                <Text style={{ marginHorizontal: 10, fontSize: 18, color: "#000", fontFamily: 'LexendRegular' }}>Driver Chat</Text>
                                <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 20, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: '#a1a1a1', fontSize: 18, fontFamily: 'LexendRegular', }}>Message Driver ...</Text>
                                    <Entypo name="chat" size={32} color="black" style={{ marginRight: 20 }} />
                                </View>
                            </TouchableOpacity>
                        }
                    </View>

                    <CallDriverButton
                        rideId={rideDetail.rideId}
                        pickupDateTime={rideDetail.pickupDateTime}
                    />

                </View>
            </View>

            <TouchableOpacity onPress={needHelp} style={{ position: 'absolute', borderRadius: 20, bottom: 30, right: 20, padding: 16, alignItems: 'center', backgroundColor: '#e6e6e6' }}>
                <Text style={{ fontFamily: 'Aristotelica-SmallCaps', fontSize: 19, marginBottom: -5, }}>Need Help?</Text>
            </TouchableOpacity>






        </SafeAreaView>
    )
}

const Profile = ({ navigation }) => {
    return (
        <ScrollView style={{ padding: 0 }}>

            <TouchableOpacity style={{ position: 'absolute', zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <View style={{ position: 'absolute', overflow: 'hidden', width: windowWidth * 2, height: 800, top: -500, left: -windowWidth * .5, borderRadius: 5890, backgroundColor: 'rgba(0,0,0,.3)', alignItems: 'center', justifyContent: 'flex-end' }}>
                <Image style={{ bottom: 0, width: windowWidth, height: windowWidth - 80 }} resizeMode='cover' source={require('../assets/denette1.webp')} />
            </View>
            <Image style={{ zIndex: 22, position: 'absolute', top: windowWidth - 140, width: 100, height: 100, alignSelf: 'center', borderRadius: 60, borderWidth: 3, borderColor: '#fff' }} resizeMode='cover' source={require('../assets/denette2.webp')} />

            {/* <View style={{ marginTop: windowWidth, marginHorizontal: 10 }}>
                <Text style={{ fontSize: 22, color: '#000', fontFamily: 'LexendMedium', }}>Denette</Text>
                <Text style={{ fontSize: 24, color: '#000', fontFamily: 'LexendRegular', }}>Ford Expedition Max</Text>
                <Text style={{ fontSize: 24, color: '#000', fontFamily: 'LexendRegular', }}>2024</Text>
                <Ionicons name="person" size={16} color="#333333" />

                <Text style={{ fontSize: 24, color: '#333333', fontFamily: 'LexendRegular', }}>Seats 6</Text>

                <Text style={{ fontSize: 17, color: '#000', fontFamily: 'LexendRegular', }}>Denette vDenetteDen ette De nette De net teDe etteD enette Den etteDe ett eDenette Denett eDe etteDe nette D enetteDe  et teDene tte Dene tt eDe et teDe nett e Denette esette DenetteDe nette </Text>
            </View> */}

            <View style={{ marginTop: windowWidth - 34, marginHorizontal: 10 }}>
                <Text style={{ fontSize: 24, color: '#000', fontFamily: 'PointSoftSemiBold' }}>Denette</Text>
                <Text style={{ fontSize: 24, color: '#000', fontFamily: 'LexendRegular', }}>Ford Expedition Max</Text>
                <Text style={{ fontSize: 24, color: '#000', fontFamily: 'LexendRegular', }}>2024</Text>
                <Ionicons name="person" size={16} color="#333333" />

                <Text style={{ fontSize: 24, color: '#333333', fontFamily: 'LexendRegular', }}>Seats 6</Text>

                <Text style={{ fontSize: 17, color: '#000', fontFamily: 'LexendRegular', }}>Denette vDenetteDen ette De nette De net teDe etteD enette Den etteDe ett eDenette Denett eDe etteDe nette D enetteDe  et teDene tte Dene tt eDe et teDe nett e Denette esette DenetteDe nette </Text>
            </View>


            <TouchableOpacity onPress={() => navigation.navigate('PrivateBooking1')} style={{ width: windowWidth - 20, height: 90, alignSelf: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#000', backgroundColor: '#e2e2e2', padding: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Airport Transfer</Text>
            </TouchableOpacity>

            <View style={{ width: windowWidth - 20, height: 90, alignSelf: 'center', borderRadius: 20, borderWidth: 1, borderColor: '#000', backgroundColor: '#e2e2e2', padding: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Custom Booking</Text>
            </View>

        </ScrollView>
    )
}


const PrivateBooking1 = ({ navigation }) => {
    return (
        <ScrollView style={{ padding: 0 }}>

            <TouchableOpacity style={{ position: 'absolute', zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <View>

                <View style={{ position: 'absolute', overflow: 'hidden', width: windowWidth * 2, height: 800, top: -500, left: -windowWidth * .5, borderRadius: 5890, backgroundColor: 'rgba(0,0,0,.3)', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image style={{ bottom: 0, width: windowWidth, height: windowWidth - 80 }} resizeMode='cover' source={require('../assets/denette1.webp')} />
                </View>


                <View style={{ width: windowWidth - 20, top: 140, height: 490, alignSelf: 'center', borderRadius: 30, borderWidth: 0, borderColor: '#000', backgroundColor: '#fff', padding: 10, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ zIndex: 22, width: 100, height: 100, borderRadius: 60, borderWidth: 3, borderColor: '#fff' }} resizeMode='cover' source={require('../assets/denette2.webp')} />
                        <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Book Denette</Text>
                    </View>

                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Type of Booking (optional)</Text>
                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Date & Time</Text>
                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Request Information</Text>



                    <TouchableOpacity style={{ zIndex: 11, padding: 20, alignSelf: 'center' }} onPress={() => navigation.navigate('PrivateBooking2')}>
                        <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                            <Text>Next</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View>

        </ScrollView>
    )
}


const PrivateBooking2 = ({ navigation, masterState, setMasterState }) => {

    const [modalVisible, setModalVisible] = useState(false)
    const { user } = masterState

    // let rideRequest = {
    //     driver: { _id: '655ebd66bcab9f212117fda7' },
    //     // pickupDateTime: date,
    //     // pickupDateTimeEpoch: date.valueOf(),
    //     // driver: null,
    //     // pickupAddress: pickupLocation,
    //     // dropoffAddress: destination,
    //     // rideType: rideType,
    //     // fare: fare[rideType],
    //     note: 'ride note ride note ride note',
    // }



    // rideRequest = {
    //     ...rideRequest,
    //     rideId: '123',
    //     pickupDateTime: new Date(),
    //     driver: { _id: '655ebd66bcab9f212117fda7', firstName: "Denette" },
    //     pickupAddress: "743 Evergreen Terrace",
    //     dropoffAddress: "123 Main Street",
    //     chatLog: []
    // }



    let rideRequest = {
        note: 'ride note ride note ride note',
        bookingCompleted: false,
        bookingCanceledByDriver: false,
        bookingCanceledByRider: false,
        // bookingId: '123',
        pickupDateTime: new Date(),
        driver: { firstName: "Denette" },
        pickupAddress: "743 Evergreen Terrace",
        dropoffAddress: "123 Main Street",
        chatLog: [],
        user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, stripe_customer_id: user.stripe_customer_id, email: user.email, autoReceipts: user.autoReceipts },

    }


    const requestDirectBooking = async () => {


        console.log('request ride: ', rideRequest)

        // if (!user) {
        //     // also if directBooking exists
        //     setModalVisible(true);
        //     return
        // }


        socket.emit('request_direct_booking', rideRequest, (rideid) => {
            console.log('booking confirmation: ', rideid)
            rideRequest = { ...rideRequest, _id: rideid }
            setMasterState(masterState => { return { ...masterState, user: { ...masterState.user, directBooking: rideRequest } } })
            // completeAction()
            navigation.navigate('PrivateBookingDetail')
        })

    }


    return (
        <ScrollView style={{ padding: 0 }}>

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



            <TouchableOpacity style={{ position: 'absolute', zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <View>

                <View style={{ position: 'absolute', overflow: 'hidden', width: windowWidth * 2, height: 800, top: -500, left: -windowWidth * .5, borderRadius: 5890, backgroundColor: 'rgba(0,0,0,.3)', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Image style={{ bottom: 0, width: windowWidth, height: windowWidth - 80 }} resizeMode='cover' source={require('../assets/denette1.webp')} />
                </View>


                <View style={{ width: windowWidth - 20, top: 140, height: 490, alignSelf: 'center', borderRadius: 30, borderWidth: 0, borderColor: '#000', backgroundColor: '#fff', padding: 10, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', }}>
                        <Image style={{ zIndex: 22, width: 100, height: 100, borderRadius: 60, borderWidth: 3, borderColor: '#fff' }} resizeMode='cover' source={require('../assets/denette2.webp')} />
                        <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Overview</Text>
                    </View>



                    {/* <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Minimum</Text> */}
                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Deposit $100</Text>
                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Final Amount</Text>

                    <TouchableOpacity style={{ zIndex: 11, padding: 20, alignSelf: 'center' }} onPress={() => requestDirectBooking()}>
                        <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                            <Text>Book & Pay</Text>
                        </View>
                    </TouchableOpacity>


                </View>

            </View>

        </ScrollView>
    )
}


const DirectRideDetail = () => {

    const rideDetail = {
        pickupDateTime: new Date(),
        driver: { firstName: "Denette" },
        pickupAddress: "743 Evergreen Terrace",
        dropoffAddress: "123 Main Street",
        chatLog: []
    }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            <Text style={{ marginTop: 30, fontSize: 18, fontFamily: 'LexendMedium', textAlign: 'center' }}>Ride</Text>


            <TouchableOpacity style={{ position: 'absolute', top: 0, right: 0, zIndex: 11, padding: 20, }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={24} color="black" />
                </View>
            </TouchableOpacity>

            <View style={{ paddingHorizontal: 10, width: '100%', marginTop: 20 }}>

                <View style={{
                    marginVertical: 10,
                    borderRadius: 30,
                }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View>
                            {rideDetail.enRoute ?
                                <View style={{ marginBottom: 0, marginHorizontal: 0, padding: 10, backgroundColor: '#ffccd6', borderRadius: 16 }}>
                                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', color: '#99001f' }}>Ride Status</Text>
                                    <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'LexendRegular', color: '#000' }}>Driver En Route</Text>
                                </View>
                                :
                                <View style={{ marginBottom: 0, marginHorizontal: 10 }}>
                                    <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'LexendMedium', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "eeee")}</Text>
                                    <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'LexendMedium', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "MMMM d")}</Text>
                                    <Text style={{ marginVertical: 0, fontSize: 22, fontFamily: 'PointSoftLight', }}>{formatInTimeZone(rideDetail.pickupDateTime, 'America/Denver', "h':'mm aa")}</Text>
                                </View>
                            }
                        </View>
                        <View style={{ marginBottom: 0, marginHorizontal: 10, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#f2f2f2', padding: 10, borderRadius: 16 }}>
                            <Text style={{ marginVertical: 0, fontSize: 14, fontFamily: 'LexendMedium', }}>ride type</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginVertical: 0, fontSize: 14, fontFamily: 'LexendRegular', color: '#737373' }}>ride type</Text>
                                <Ionicons name="person" size={16} color="#737373" />
                            </View>
                        </View>
                    </View>

                    {rideDetail.driver &&
                        <View style={{ borderRadius: 30, marginBottom: 10, borderWidth: 7, borderColor: '#e6e6e6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 28, }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Text numberOfLines={1} style={{ fontSize: 18, fontFamily: 'LexendRegular', }}>Driver Assigned  </Text>
                                    <Image style={{ height: 26, width: 26, marginTop: 0 }} source={require('../assets/verified.png')} />
                                </View>
                                <View style={{}}>
                                    <Text style={{ fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.driver.firstName}</Text>
                                </View>
                            </View>
                            <CallDriverButton style={{}}
                                rideId={rideId}
                                pickupDateTime={rideDetail.pickupDateTime}
                            />
                        </View>
                    }


                    <View style={{ borderRadius: 30, justifyContent: 'center', marginVertical: 0, borderWidth: 7, borderColor: '#e6e6e6' }}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 16, }}>
                            <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'LexendRegular', }}>Pickup</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                <Text style={{ marginTop: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.pickupAddress}</Text>
                                {rideDetail.flightNumber && <Text numberOfLines={1} style={{ fontSize: 16, fontFamily: 'PointDemiBold' }}> Flight {rideDetail.flightNumber}</Text>}
                            </View>
                            <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'LexendRegular', }}>Dropoff</Text>
                            <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'PointSoftLight', }}>{rideDetail.dropoffAddress}</Text>
                        </View>
                    </View>

                    <View style={{ marginTop: 10, }}>
                        {chatLog.length ?
                            <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 10, }} >
                                <Text style={{ marginHorizontal: 10, fontSize: 18, color: "#000", fontFamily: 'LexendRegular' }}>Driver Chat</Text>
                                <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'PointSoftLight', fontSize: 18, backgroundColor: '#fff', }} numberOfLines={2}>{chatLog[chatLog.length - 1].text}</Text>
                                    <Entypo name="chat" size={32} color="black" style={{ position: 'absolute', right: 20 }} />
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => { navigation.navigate('Chat', { rideId: rideDetail._id }) }} style={{ backgroundColor: '#ffdb80', borderRadius: 20, borderColor: '#c4a73b', padding: 10, paddingVertical: 20, }} >
                                <Text style={{ marginHorizontal: 10, fontSize: 18, color: "#000", fontFamily: 'LexendRegular' }}>Driver Chat</Text>
                                <View style={{ marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 20, padding: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ color: '#a1a1a1', fontSize: 18, fontFamily: 'LexendRegular', }}>Message Driver ...</Text>
                                    <Entypo name="chat" size={32} color="black" style={{ marginRight: 20 }} />
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </View>

            <TouchableOpacity onPress={needHelp} style={{ position: 'absolute', borderRadius: 20, bottom: 30, right: 20, padding: 16, alignItems: 'center', backgroundColor: '#e6e6e6' }}>
                <Text style={{ fontFamily: 'Aristotelica-SmallCaps', fontSize: 19, marginBottom: -5, }}>Need Help?</Text>
            </TouchableOpacity>







        </SafeAreaView>

    );

}




const QuickIdea = ({ navigation }) => {
    return (
        <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
        }}>


            <View style={{
                height: 300, // Set your custom height here
                backgroundColor: 'white',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
            }}>
                <Text>Hello</Text>
            </View>
        </View>
    )
}


const DriverPagesHome = ({ navigation }) => {
    // const [carouselIndex, setCarouselIndex] = useState(0)
    const carouselRef = useRef(null)
    // const nextPage = () => {
    //     if ((typeSelected == 'arrivals' && destination.length === 0) || (typeSelected == 'departures' && pickupLocation.length === 0)) {
    //         errorTimeout()
    //         return
    //     }


    //     setCarouselIndex(carouselIndex => carouselIndex + 1)
    //     console.log(carouselRef.current.getCurrentIndex());
    //     carouselRef.current.next()
    // }

    // const prevPage = () => {
    //     setCarouselIndex(carouselIndex => carouselIndex - 1)
    //     console.log(carouselRef.current.getCurrentIndex());
    //     carouselRef.current.prev()
    // }


    return (


        <View>


            <TouchableOpacity style={{ position: 'absolute', zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>


            <View style={{ position: 'absolute', top: 20, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}  >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <ScrollView style={{ height: '100%', backgroundColor: '#fff', paddingTop: 80 }}>




                <Text style={{ fontSize: 32, color: '#000', fontFamily: 'LexendMedium', marginHorizontal: 10 }}>Private</Text>
                <Text style={{ fontSize: 32, color: '#000', fontFamily: 'LexendMedium', marginHorizontal: 10 }}>Drivers</Text>

                <Text style={{ fontSize: 18, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Hire a professional driver in the Park City area for a specific need or occasion.</Text>


                {/* <View style={{ backgroundColor: '#e2e2e2', margin: 20, height: 200 }}>
                    <Text>Upcoming Private Ride</Text>
                </View> */}

                {/* <View style={{ backgroundColor: '#e2e2e2', margin: 20, height: 100 }}>
                    <Text>My Drivers</Text>
                </View> */}




                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Quick Ideas</Text>




                <View style={{ marginHorizontal: 10, padding: 0, borderRadius: 30 }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                        <TouchableOpacity onPress={() => navigation.navigate('QuickIdea')} style={{ backgroundColor: '#595959', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, alignItems: 'center', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{}}>
                                <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18, marginBottom: 0, paddingHorizontal: 0, color: '#fff' }}>Airport</Text>
                                <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18, marginBottom: 0, paddingHorizontal: 0, color: '#fff' }}>Transfers</Text>
                            </View>
                            <Image style={{ width: '50%', height: '120%', }} resizeMode='contain' source={require('../assets/airplane.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, padding: 10, }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8, textAlign: 'left' }}>By-The</Text>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8, textAlign: 'left' }}>-Hour</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                        <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, justifyContent: 'center', padding: 10, }}>
                            <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 0 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Sightseeing</Text>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Tours</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Locals')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, alignItems: 'center', padding: 10, }}>
                            <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 0 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Sprinter</Text>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Vans</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                        <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, justifyContent: 'center', padding: 10, }}>
                            <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 0 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Medical</Text>
                            </View>
                        </TouchableOpacity>



                    </View>

                </View>



                <View style={{
                    width: '100%', backgroundColor: '#fff', marginTop: 20, marginBottom: 30, borderRadius: 0, padding: 10,
                    overflow: 'hidden', // Required for clipping the "inner" shadow
                }}>

                    <View style={{
                        zIndex: 2, height: 10, width: '110%', backgroundColor: '#e2e2e2',
                        position: 'absolute', top: -10, left: 0, right: 0, shadowColor: '#000',
                        shadowOpacity: 0.58,
                        shadowRadius: 10,
                    }} />

                    <View style={{
                        zIndex: 2, height: 4, width: '110%', backgroundColor: '#e2e2e2',
                        position: 'absolute', bottom: -10, left: 0, right: 0, shadowColor: '#000',
                        shadowOpacity: 0.58,
                        shadowRadius: 10,
                    }} />

                    <Text style={{ fontSize: 24, fontFamily: 'LexendRegular', }}>Airport Transfer</Text>
                    <Text style={{ fontSize: 16, fontFamily: 'LexendRegular', }}>Reserve a specific driver and vehicle for your Airport Transfer</Text>

                    <Image style={{ width: windowWidth - 40, height: windowWidth - 80, alignSelf: 'center', marginVertical: 20, borderRadius: 30 }} source={require('../assets/Salt-Lake-City-International-Airport.webp')} />

                    <View style={{
                        zIndex: 1,
                        //    position: 'absolute', bottom: 20, left: 0,
                        right: 0,
                        marginHorizontal: 20, height: 80, borderRadius: 40, backgroundColor: '#ffd670', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <View style={{ height: 60, width: 60, borderRadius: 40, backgroundColor: '#fff', position: 'absolute', left: 10 }}>


                        </View>
                        <Text style={{ fontFamily: 'LexendRegular', }}>Book Denette</Text>
                    </View>

                </View>



                <View style={{ backgroundColor: '#e5faff', margin: 10, width: windowWidth - 20, borderRadius: 30, paddingBottom: 10 }}>

                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Meet the Drivers</Text>


                    <Carousel
                        autoPlay={true}
                        loop={true}
                        width={430}
                        height={258}
                        snapEnabled={true}
                        pagingEnabled={true}
                        autoPlayInterval={4000}

                        ref={carouselRef}
                        enabled={true}

                        data={[...new Array(4).keys()]}
                        scrollAnimationDuration={2000}

                        onSnapToItem={(index) => console.log('current index:', index)}
                        renderItem={({ index }) => {
                            // console.log('hello: ', index)
                            return (
                                <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ marginHorizontal: 10, width: windowWidth - 20, borderRadius: 30, }}>
                                    <View style={{ zIndex: 1, position: 'absolute', bottom: 20, left: 20, height: 100, width: 100, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text>Darin</Text>
                                        <Text>Tesla Y</Text>
                                        <Text>Seats 6</Text>
                                    </View>
                                    <Image style={{ width: windowWidth - 40, height: windowWidth / 1.5, borderRadius: 30, }} resizeMode='cover' source={require('/Users/zacharybretz/work/july24/geronimo/assets/Screenshot 2025-05-06 at 11.18.35 PM.png')} />
                                </TouchableOpacity>
                            )

                        }}
                    />

                </View>



            </ScrollView>

        </View>

    );
}



