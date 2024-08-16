import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useState, useEffect, useRef, useId, version } from 'react';
import { AppState, Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, StatusBar, LayoutAnimation, TouchableHighlight, Platform, TextInput } from 'react-native';
import { socket } from "../CoreNav/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as uuid from 'uuid'
import axios from 'axios';
import { Feather, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import MapWrapper from './MapWrapper.js'
import LocalRideWaitScreen from './LocalRideWaitScreen'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default function LocalRideNav({ navigation, masterState, setMasterState }) {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return (
        <>
            {masterState.user?.localRide &&
                <LocalRideWaitScreen navigation={navigation} masterState={masterState} setMasterState={setMasterState} />
            }
            <MapWrapper navigation={navigation} masterState={masterState} setMasterState={setMasterState} />

        </>
    )

}
