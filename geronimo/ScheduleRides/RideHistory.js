import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Entypo, MaterialIcons } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import axios from 'axios';
import { url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default RideHistory = ({ navigation, masterState, setMasterState, rideDetail, setRideDetail }) => {

    const { activeRides, _id } = masterState.user // add rides to user object and check on this page ebfore runnign another search

    const [rides, setRides] = useState([])
    // const [drivers, setDrivers] = useState([])
    const [drivers, setDrivers] = useState(null)

    const [preferredDrivers, setPreferredDrivers] = useState(masterState.user.preferredDrivers)

    let fetchRideHistory = () => {
        axios.get(`${url}/rideHistory?userId=${_id}`)
            .then(res => {
                let rides = res.data
                console.log('ride history: ', rides)
                // setRides(rides)
                // let drivers = rides.map(ride => ride.driver.firstName)
                // drivers = [...new Set(drivers)]
                // setDrivers(drivers)

                // let drivers = {}
                let temp = {}
                rides.forEach(ride => {
                    if (drivers && drivers.hasOwnProperty(ride.driver._id)) return
                    temp[ride.driver._id] = ride.driver
                })

                setDrivers(temp)

                console.log('drivers: ', drivers)

            })
            .catch(e => console.log('error: ', e))
    }


    const [emailAddress, setEmailAddress] = useState(null)
    const [autoReceipts, setAutoReceipts] = useState(null)
    const [loadingPayForm, setLoadingPayForm] = useState(false)

    const saveEmailPreferences = () => {

        setLoadingPayForm(true)

        axios.post(`${url}/user/receiptPreferences`, { user: masterState.user, email: emailAddress, autoReceipts })
            .then(res => {
                if (res.data === 'ok') {
                    console.log('receipt preferences saved: ', res.data)
                    setMasterState({ ...masterState, user: { ...masterState.user, email: emailAddress, autoReceipts } })
                    Keyboard.dismiss()
                }
                else {
                    console.log('receipt error!')
                    // errorTimeout("Phone number taken.\nTry signing in!")
                }
            })
            .catch(() => null)
            .finally(() => {
                setTimeout(() => {
                    setLoadingPayForm(false); Alert.alert('Success', 'Preferences Saved', [], { cancelable: true })
                }, 1500);
            })
    }

    useEffect(() => {
        fetchRideHistory()
        // setEmailAddress(masterState.user.email)
        // setAutoReceipts(masterState.user.autoReceipts)
    }, [])


    return (

        <View style={{ height: '100%', backgroundColor: '#fff' }}>
            <View style={{ margin: 20, marginBottom: 0, height: 60, borderRadius: 20, backgroundColor: '#ffcf56', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <View style={{}} >
                    <Text style={{ fontSize: 26, color: '#000', fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Driver Preferences</Text>
                </View>
                <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={20} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={{ marginHorizontal: 20 }}>


                {/* {
                    drivers && drivers.map((driver, idx) => {
                        return (

                            <View>
                                <Text style={{ fontFamily: 'PointSoftLight' }}>{driver}</Text>
                            </View>

                        )
                    })
                } */}


                {
                    drivers &&

                    Object.values(drivers).map((driver, idx) => {
                        return (

                            <View key={idx}>
                            <Text style={{ fontFamily: 'PointSoftLight' }}>{driver.firstName}</Text>
                            </View>

                        )
                    })
                }

                {
                    preferredDrivers?.length &&

                    <View>
                        <Text style={{ fontFamily: 'PointSoftLight' }}>Preferred Drivers</Text>

                        {Object.values(preferredDrivers).map((driver, idx) => {
                            return (

                                <View key={idx}>
                                    <Text style={{ fontFamily: 'PointSoftLight' }}>{driver.firstName}</Text>
                                </View>

                            )
                        })
                        }

                    </View>

                }




                {
                    rides && rides.map((ride, idx) => {
                        return (

                            <TouchableOpacity key={idx} onPress={() => { navigation.navigate('RideDetail', { rideId: ride._id }) }} style={{ backgroundColor: '#e6e6e6', borderRadius: 20, padding: 30, marginBottom: 10 }}>
                                <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'PointSoftSemiBold' }}>{formatInTimeZone(ride.pickupDateTime, 'America/Denver', "eee',' MMMM do h':'mm aa")}</Text>
                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    <View style={{ marginRight: -4, marginTop: -3 }}>
                                        <Entypo style={{ marginLeft: -8, marginRight: 8 }} name="dot-single" size={24} color="black" />
                                        <Feather style={{}} name="corner-down-right" size={17} color="black" />
                                    </View>
                                    <View>
                                        <Text style={{ fontFamily: 'PointSoftLight' }}>{ride.pickupAddress}</Text>
                                        <Text style={{ marginTop: 6, fontFamily: 'PointSoftLight' }}>{ride.dropoffAddress}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>

                        )
                    })
                }
            </View>





            <View style={{ padding: 10, height: '100%', backgroundColor: '#fff' }}>




                <View style={{ padding: 10, borderRadius: 30, marginBottom: 20, }}>
                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'left' }} >
                        Find drivers you've ridden with.
                    </Text>
                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'left' }} >
                        We will do our best to match you with your preferred drivers.
                    </Text>


                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'left' }} >
                        Email Address
                    </Text>
                    <TextInput style={{ paddingLeft: 10, backgroundColor: null, backgroundColor: '#f2f2f2', padding: 10, marginVertical: 10, borderRadius: 10, fontFamily: 'PointSoftSemiBold', fontSize: 16 }} onChangeText={(text) => { setEmailAddress(text) }} value={emailAddress} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'left', marginTop: 10 }} >
                            Receipts Enabled
                        </Text>

                        <TouchableOpacity onPress={() => setAutoReceipts(!autoReceipts)}>
                            {autoReceipts ? <MaterialIcons name="check-box" size={28} color="black" /> : <MaterialIcons name="check-box-outline-blank" size={28} color="black" />}
                        </TouchableOpacity>
                    </View>

                    {loadingPayForm ?
                        <View style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, height: 54, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                            <ActivityIndicator />
                        </View>
                        :
                        <TouchableOpacity onPress={saveEmailPreferences} style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 20, marginTop: 0, textAlign: 'center', padding: 20, paddingHorizontal: 16, marginBottom: -8 }} adjustsFontSizeToFit={true} numberOfLines={1}>Save</Text>
                        </TouchableOpacity>
                    }

                </View>

            </View>





        </View>

    );
}



