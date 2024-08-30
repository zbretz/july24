import { useState, useEffect, useRef, useId, version } from 'react';
import { AppState, Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, StatusBar, LayoutAnimation, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';
import { Feather, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import LottieView from 'lottie-react-native';



const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function LocalRideWaitScreen({ navigation, requestLocal, masterState, setMasterState }) {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const { localRide } = masterState.user
    // localRide = {}
    //it'll be cool to have a "complete ride" process that transitions screens and shows tip input etc

    return (
        <>

            <View style={{ position: 'absolute', backgroundColor: '#fff', height: '100%', bottom: 0, zIndex: 99, borderRadius: 20, width: '100%', padding: 30, alignItems: 'center', justifyContent: 'center' }}>

                <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={36} color="black" />
                </TouchableOpacity>

                {!localRide.driver ?
                    <View style={{}}>

                        <View style={{ borderRadius: 30, }}>
                            <Text style={{ marginBottom: 20, fontFamily: 'Aristotelica-Regular', fontSize: 30, textAlign: 'center', }} adjustsFontSizeToFit={true} numberOfLines={1} >Locating your driver</Text>
                        </View>
                        <View style={{ backgroundColor: '#e6e6e6', padding: 20, borderRadius: 20, }}>

                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 16, }}>From: {localRide.pickupAddress}</Text>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 16, marginTop: 10 }}>Destination: {localRide.dropoffAddress}</Text>
                            <LottieView speed={.4} style={{ height: 70, width: 70, alignSelf: 'center', margin: 20 }} source={require('../assets/loading.json')} autoPlay loop />

                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18, marginTop: 10, textAlign: 'center' }}>For a more prompt response, please call Zach at:</Text>
                            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${9175751955}`) }} style={{ backgroundColor: '#f2f2f2', padding: 10, marginTop: 10, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Feather style={{ position: 'absolute', left: 20 }} name="phone" size={24} color="#000" /><Text style={{ textAlign: 'center', fontFamily: 'PointSoftSemiBold', fontSize: 14 }}>917-575-1955</Text>
                            </TouchableOpacity>

                        </View>



                    </View>


                    :


                    <View style={{ backgroundColor: '#FFCF56', padding: 20, borderRadius: 20, }}>
                        <Text style={{ fontSize: 28, textAlign: 'center', marginBottom: 20, fontFamily: 'Aristotelica-Regular', }}>Driver is En Route</Text>

                        <View style={{ backgroundColor: null, marginBottom: 20, borderRadius: 20, alignItems: 'center' }}>

                            <Text style={{ fontSize: 19, fontFamily: 'Aristotelica-Regular', }}>Expected Pickup</Text>
                            <Text style={{ fontSize: 19, }}>{formatInTimeZone(localRide.eta, 'America/Denver', "h':'mm aa")}</Text>
                        </View>

                        <View style={{ backgroundColor: '#f2f2f2', padding: 20, borderRadius: 20 }}>
                            <Text style={{ fontSize: 16 }}>Pickup: {localRide.pickupAddress}</Text>
                            <Text style={{ fontSize: 16, }}>Destination: {localRide.dropoffAddress}</Text>
                        </View>

                        <View style={{ backgroundColor: '#f2f2f2', padding: 20, borderRadius: 20, marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>{localRide.driver.firstName} {localRide.driver.lastName[0]}</Text>
                            <Text style={{ fontSize: 16 }}>{localRide.driver.vehicleMake} {localRide.driver.vehicleModel} [{localRide.driver.licensePlate}]</Text>
                            {/* <Text style={{ fontSize: 16 }}>{localRide.driver.venmo}</Text> */}
                            <Text style={{ fontSize: 16 }}>{localRide.driver.phone}</Text>
                        </View>

                    </View>
                }
            </View>

        </>
    )

}

