import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { socket } from '../socket';

import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default LocalRidesNew = ({ navigation, isConnected, masterState, newLocalRides, setNewLocalRides, myLocalRides, setMyLocalRides, setRideDetail }) => {




    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>

            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", margin: 20, textAlign: 'center' }}>Local Rides</Text>
            

            {masterState.myLocalRides.map((request, idx) => {
                return (
                    <TouchableOpacity key={idx} onPress={() => { setRideDetail(request); navigation.navigate('LocalRideDetail') }} style={{ borderColor: '#668cff', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30, backgroundColor:'#99b3ff' }}>
                      <AntDesign style={{position:'absolute', top:-10, right:-4}} name="checkcircle" size={24} color="#002699" />
                        <Text>From: {request.pickupAddress}</Text>
                        <Text>To: {request.dropoffAddress}</Text>
                        <Text>Requested: {formatInTimeZone(request.createdAt, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                    </TouchableOpacity>
                )
            })}

            {masterState.newLocalRides.map((request, idx) => {
                return (
                    <TouchableOpacity key={idx} onPress={() => { setRideDetail(request); navigation.navigate('LocalRideDetail') }} style={{ borderColor: '#000', borderWidth: 1, borderRadius: 20, margin: 10, padding: 30 }}>
                        <Text>From: {request.pickupAddress}</Text>
                        <Text>To: {request.dropoffAddress}</Text>
                        <Text>Requested: {formatInTimeZone(request.createdAt, 'America/Denver', "eee',' MMMM do h':'mm bbb")}</Text>
                    </TouchableOpacity>
                )
            })}

        </SafeAreaView>

    );
}






