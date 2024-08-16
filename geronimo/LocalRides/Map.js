
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect, useRef, useId } from 'react';
import { AppState, Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, StatusBar, LayoutAnimation, Keyboard, Modal, TouchableHighlight, Linking, Platform } from 'react-native';
import axios from 'axios';
import { FontAwesome, Octicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Map({ pinAddress, setPinAddress, scheduleStep, setScheduleStep, setPickupAddress, userLocation, setUserLocation }) {

    const [pinLocation, setPinLocation] = useState(null);
    const [pan, setPan] = useState(null)
    // const mapRef = useRef()

    const API_KEY = 'AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI';
    const searchLocation = async (e = userLocation.coords) => {

        setPinLocation(e)
        console.log('e location: ', e)

        e && axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latitude},${e.longitude}&key=${API_KEY}&result_type=street_address`,
            })
            .then((response) => {
                // console.log('reponse: ', response)
                if (response.data.results.length) {
                    if (scheduleStep == 'pickup') setPickupAddress(`${response.data.results[0].address_components[0].long_name} ${response.data.results[0].address_components[1].long_name}, ${response.data.results[0].address_components[2].long_name}`)
                    setPinAddress(`${response.data.results[0].address_components[0].long_name} ${response.data.results[0].address_components[1].long_name}, ${response.data.results[0].address_components[2].long_name}`)
                    console.log('pinnnn: ', response.data.results[0].address_components[0].long_name, response.data.results[0].address_components[1].long_name, response.data.results[0].address_components[2].long_name)
                }
            })
            .catch((e) => {
                console.log('geocode error: ', e);
            })
    };

    useEffect(() => {
        searchLocation()
    }, [])

    return (
        <>
            <StatusBar
                animated={true}
                barStyle={'dark-content'}
                hidden={Platform.OS == 'android' && true}
            />

            {userLocation &&
                <View style={{ height: windowHeight - 200, justifyContent:'center' }}>
                    <FontAwesome style={{position:'absolute', zIndex:1, alignSelf:'center',}} name="map-pin" size={34} color="#4d4dff" />
                    <MapView

                        onRegionChangeComplete={e => { console.log('e: ', e); searchLocation(e) }}
                        onPanDrag={e => { console.log('pan: ', setPan(e.nativeEvent.coordinate)); }}
                        showsUserLocation={true}
                        onTouchStart={() => null}
                        // style={{ height: windowHeight - 200, borderRadius: 40, alignItems: 'center', justifyContent: 'center', }}



                        style={{ height: windowHeight - 200, }}



                        // provider={"google"}
                        // provider={PROVIDER_GOOGLE} // remove if not using Google Maps


                        // ref={mapRef}
                        region={{ ...userLocation.coords, latitudeDelta: .0035, longitudeDelta: .0035 }}
                    >
                        {/* <FontAwesome name="map-pin" size={34} color="#4d4dff" /> */}
                    </MapView>

                </View>
            }


        </>
    )

}



