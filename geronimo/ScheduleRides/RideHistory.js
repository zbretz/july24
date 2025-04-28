import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import axios from 'axios';
import { url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default RideHistory = ({ navigation, masterState, setMasterState, rideHistory, setRideHistory }) => {

    const { _id } = masterState.user
    // const [rides, setRides] = useState([])

    let fetchRideHistory = () => {
        axios.get(`${url}/rideHistory?userId=${_id}`)
            .then(res => {
                let rides = res.data
                setLoadingHistory(false)
                setRideHistory(rides)
            })
            .catch(e => console.log('error: ', e))
    }


    const [loadingHistory, setLoadingHistory] = useState(true)


    useEffect(() => {
        fetchRideHistory()
    }, [])


    return (

        <View style={{}}>
            <View style={{ margin: 20, height: 60, borderRadius: 20, backgroundColor: '#ffcf56', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                <View style={{}} >
                    <Text style={{ fontSize: 26, color: '#000', fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Ride History</Text>
                </View>
                <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={20} color="#000" />
                </TouchableOpacity>
            </View>




            <View style={{ marginHorizontal: 20 }}>
                {loadingHistory ?

                    <View style={{ backgroundColor: '#e6e6e6', borderRadius: 20, padding: 30, marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'PointSoftSemiBold' }}></Text>
                        <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>

                            <View>
                                <ActivityIndicator color={'black'} style={{ color: 'black' }} />
                                <Text style={{ marginTop: 6, fontFamily: 'PointSoftLight', color: '#e6e6e6', }}>null</Text>
                            </View>

                        </View>
                    </View>

                    :
                    rideHistory ? rideHistory.map((ride, idx) => {
                        console.log('active ride list: ', ride)
                        return (
                            <TouchableOpacity key={idx} onPress={() => {navigation.navigate('RideDetail', { rideId: ride._id, type:'history' }) }} style={{ backgroundColor: '#e6e6e6', borderRadius: 20, padding: 30, marginBottom: 10 }}>
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

                        :

                        <View style={{ borderRadius: 20, padding: 30, marginBottom: 10 }}>
                            <Text style={{ fontWeight: '600', fontSize: 16, fontFamily: 'PointSoftSemiBold' }}></Text>
                            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>

                                <View>
                                    <Text style={{ marginTop: 6, fontFamily: 'PointSoftLight', color: '#000', fontSize: 21 }}>No History</Text>
                                </View>

                            </View>
                        </View>

                }
            </View>

        </View>

    );
}



