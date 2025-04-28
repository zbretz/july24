import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import axios from 'axios';
import { url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default PreferredDrivers = ({ navigation, masterState, setMasterState, rideDetail, setRideDetail }) => {

    const { _id } = masterState.user

    const [rides, setRides] = useState([])
    // const [drivers, setDrivers] = useState([])
    const [drivers, setDrivers] = useState([])

    const [preferredDrivers, setPreferredDrivers] = useState(masterState.user.preferredDrivers ? masterState.user.preferredDrivers : [])
    // const [preferredDrivers, setPreferredDrivers] = useState([])

    let fetchPreferredDrivers = () => {
        axios.get(`${url}/rideHistory?userId=${_id}`)
            .then(res => {
                let rides = res.data
                console.log('ride history: ', rides)
                let temp = {}

                rides.forEach(ride => {

                    temp[ride.driver._id] = ride.driver


                    if (preferredDrivers.length) {
                        preferredDrivers.forEach(pref_driver => {
                            if (ride.driver._id == pref_driver._id) {
                                delete temp[ride.driver._id]
                            }
                        })
                    }

                })

                setDrivers(temp)

                console.log('drivers: ', drivers)

            })
            .catch(e => console.log('error: ', e))
    }


    const [loadingPayForm, setLoadingPayForm] = useState(false)

    const saveEmailPreferences = () => {

        setLoadingPayForm(true)

        axios.post(`${url}/user/driverPreferences`, { user: masterState.user, preferredDrivers })
            .then(res => {
                if (res.data === 'ok') {
                    console.log('receipt preferences saved: ', res.data)
                    setMasterState({ ...masterState, user: { ...masterState.user, preferredDrivers } })
                }
                else {
                    console.log('receipt error!')
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
        fetchPreferredDrivers()
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
                <View style={{ padding: 10 }}>

                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, textAlign: 'left' }} >
                        Find drivers you've ridden with.
                    </Text>
                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 16, textAlign: 'left' }} >
                        We will do our best to match you with your preferred drivers.
                    </Text>
                </View>


                <View style={{ backgroundColor: '#f2f2f2', borderRadius: 20, minHeight: 120, paddingVertical: 10 }}>

                    {
                        // Object.values(drivers).length &&

                        Object.values(drivers).map((driver, idx) => {
                            return (

                                <TouchableOpacity onPress={
                                    () => {
                                        delete drivers[driver._id]
                                        setPreferredDrivers(preferredDrivers => {
                                            return ([...preferredDrivers, driver])
                                        })
                                    }
                                }
                                    style={{ flexDirection: 'row', padding: 20, paddingVertical: 10 }} key={idx}>
                                    <AntDesign name="hearto" size={20} color="#5a5a5a" />

                                    <Text style={{ fontFamily: 'Lexend-Regular', marginLeft: 10, color: '#5a5a5a' }}>{driver.firstName}</Text>
                                </TouchableOpacity>

                            )
                        })




                    }

                    {
                        // preferredDrivers?.length &&

                        <View>

                            {preferredDrivers.map((driver, idx) => {
                                return (

                                    <TouchableOpacity onPress={
                                        () => {
                                            setPreferredDrivers(preferredDrivers => { return ([...preferredDrivers.filter(preferred => preferred._id !== driver._id)]) })
                                            setDrivers(drivers => {
                                                drivers[driver._id] = driver
                                                return drivers
                                            })
                                        }
                                    }

                                        style={{ flexDirection: 'row', padding: 20, paddingVertical: 10 }} key={idx}>
                                        <AntDesign name="heart" size={20} color="black" />
                                        <Text style={{ fontFamily: 'Lexend-Medium', marginLeft: 10, }}>{driver.firstName}</Text>
                                    </TouchableOpacity>

                                )
                            })
                            }

                        </View>


                    }

                    {
                        !preferredDrivers?.length && !Object.values(drivers).length &&

                        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontFamily: 'Lexend-Regular', marginLeft: 10, color: '#5a5a5a' }}>No ride history</Text>
                        </View>
                    }

                </View>


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


                    {loadingPayForm ?
                        <View style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, height: 42, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                            <ActivityIndicator />
                        </View>
                        :
                        <TouchableOpacity onPress={saveEmailPreferences} style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginTop: 0, textAlign: 'center', padding: 10, paddingHorizontal: 16, }} adjustsFontSizeToFit={true} numberOfLines={1}>Save</Text>
                        </TouchableOpacity>
                    }

                </View>

            </View>





        </View>

    );
}



