import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default MyAccount = ({ navigation, masterState, setMasterState }) => {

    const logout = () => {
        AsyncStorage.clear()
        setMasterState(masterState => { return { ...masterState, user: null } })
    }
    // logout()

    const { user } = masterState

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff', }}>

            <Text style={{ fontSize: 20, padding: 20, backgroundColor: '#55c1ff' }}>{user.firstName}</Text>

            <View style={{ padding: 40, flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>

                    <TouchableOpacity onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                        <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/banking.png')} resizeMode='contain' />
                        <Text style={{ textAlign: 'center' }}>Banking</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                        <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/pie-chart.png')} resizeMode='contain' />
                        <Text style={{ textAlign: 'center' }}>Equity</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>

                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <TouchableOpacity onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                            <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/profile.png')} resizeMode='contain' />
                            <Text style={{ textAlign: 'center' }}>My Info</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                            <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/wallet.png')} resizeMode='contain' />
                            <Text style={{ textAlign: 'center' }}>Locals Wallet</Text>
                        </TouchableOpacity>

                    </View>


                </View>
            </View>
            {/* <TouchableOpacity onPress={logout}><Text>logout</Text></TouchableOpacity> */}


        </SafeAreaView>

    );

}