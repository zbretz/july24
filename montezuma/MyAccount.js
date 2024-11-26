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

    let walletBalance = user.wallet && user.wallet.balance.toFixed(2)
    console.log('wallet balance: ', walletBalance)
    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff', }}>

            <Text style={{ fontSize: 20, fontWeight:500,  padding: 20, backgroundColor: '#55c1ff' }}>{user.firstName}</Text>

            <View style={{ padding: 40, flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row', }}>


                    <TouchableOpacity disabled={true} onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                        <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/wallet.png')} resizeMode='contain' />
                        <Text style={{ textAlign: 'center' }}>Wallet Balance</Text>
                        <Text style={{ textAlign: 'center' }}>${walletBalance}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity disabled={true} onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                        <View style={{ backgroundColor: 'rgba(255,255,255,.7)', height: '100%', width: '100%', position: 'absolute', zIndex: 99 }} />
                        <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/profile.png')} resizeMode='contain' />
                        <Text style={{ textAlign: 'center' }}>My Info</Text>
                    </TouchableOpacity>


                </View>

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        {/* <TouchableOpacity onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                            <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/banking.png')} resizeMode='contain' />
                            <Text style={{ textAlign: 'center' }}>Banking</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={null} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                            <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/pie-chart.png')} resizeMode='contain' />
                            <Text style={{ textAlign: 'center' }}>Equity</Text>
                        </TouchableOpacity> */}
                    </View>


                </View>
            </View>
            <TouchableOpacity onPress={logout}><Text>logout</Text></TouchableOpacity>


        </SafeAreaView>

    );

}