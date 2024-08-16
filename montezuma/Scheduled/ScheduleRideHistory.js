import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';


import { formatInTimeZone } from "date-fns-tz";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default ScheduleRideListView = ({ navigation, isConnected, masterState, newScheduledRides, setNewScheduledRides }) => {

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: "#000", margin: 20, textAlign: 'center', }}>Ride History</Text>
            <View style={{ position: 'absolute', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}><Text>Under Construction</Text></View>
        </SafeAreaView>
    );
}