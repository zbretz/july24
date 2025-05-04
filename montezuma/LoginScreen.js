import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, Modal, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DriverPicker from './DriverPicker'
import { AntDesign, Feather } from '@expo/vector-icons';
import pushConfig from './pushConfig';
import url from './url_toggle'

import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default LoginScreen = ({ isConnected, masterState, setMasterState }) => {

    const [driver, setDriver] = useState(null)
    const [drivers, setDrivers] = useState([])
    const [open, setOpen] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisible2, setModalVisible2] = useState(false)
    const [error, setError] = useState()
    const [code, setCode] = useState('')

    const [driverAgreementComplete, setDriverAgreementComplete] = useState(false)
    const [pushNotificationsComplete, setPushNotificationsComplete] = useState(false)

    const errorTimeout = (msg,) => {
        setError(msg)
        setTimeout(() => {
            setError(null)
        }, 3000)
    }

    const driverAgreement = () => {
        Alert.alert(`Driver Agreement`, `
        As a transportation platform, The Park City App provides services to transportation providers which include tools for connecting with and servicing their passengers and rides.

        As an independent transportation business operator, it is solely my responsibility to maintain my own commerical insurance and the proper condition and maintenance of vehicle, and the pleasant and reliable transportation experience that passengers may reasonably expect. I authorize Park City Payments to collect fares on my behalf when passengers choose to pay through The Park City App.
        `, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Accept', onPress: () => {
                    setDriverAgreementComplete(true)
                }
            },
        ]);

    }

    const requestToken = async () => {

        const push_token = await pushConfig()
        console.log('chat push token fetch: ', push_token)

        if (push_token) {
            axios({
                method: 'post',
                url: `${url}/auth/saveDriverToken`,
                data: { driverId: driver._id, push_token }
            })
                .then(res => {
                    console.log('push token save response: ', res)
                    setPushNotificationsComplete(true)
                    setTimeout(
                        () => {
                            AsyncStorage.setItem('User', JSON.stringify(driver))

                            let myLocalRides = driver.localRides ? driver.localRides : []
                            let myScheduledRides = driver.activeRides ? driver.activeRides : []
                            let newScheduledRides = []

                            setMasterState(masterState => {
                                return { ...masterState, user: driver, newScheduledRides, myScheduledRides, myLocalRides, appIsReady: true }
                            })
                        }, 2000
                    )
                })
                .catch((err) => console.log('push token save error: ', err))
        }
        else {
        }
    }


    const signIn = () => {

        axios.post(`${url}/auth/driverSignIn`, { phone: driver.phone })
            .then(res => {
                if (res.data) {
                    setModalVisible(true)
                } else {
                    null
                }
            })
            .catch(e => console.log('sign in error: ', e))
    }


    const enterCode = (code) => {

        setCode(code)

        if (code.length === 4) {
            axios.post(`${url}/auth/driverCode`, { phone: driver.phone, code })
                .then(async (res) => {
                    if (res.data.status == 'ok') {

                        console.log('code: ok')

                        setModalVisible(false)

                        setTimeout(()=>{  setModalVisible2(true)}, 1000)
                      

                        // AsyncStorage.setItem('User', JSON.stringify(driver))

                        // setMasterState(masterState => {
                        //     return { ...masterState, user: driver, myScheduledRides: driver.activeRides, myLocalRides: driver.localRides, appIsReady: true }
                        // })

                    } else {
                        errorTimeout('Incorrect Code')
                        setCode('')
                    }
                })
        }
    }


    const logout = () => {
        console.log('logging out')
        AsyncStorage.clear()
        setMasterState(masterState => ({ ...masterState, user: null }) )
    }

    return (
        <View style={{ height: '100%', backgroundColor: '#fff', alignItems: 'center', paddingTop:160 }}>

            {/* <TouchableOpacity onPress={logout}><Text>logout</Text></TouchableOpacity> */}

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.6)', }}>

                    <TouchableOpacity onPress={() => { console.log('close modal'); setModalVisible(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                    <View style={{ height: windowHeight * .4, width: windowWidth * .94, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', top: windowHeight * .1, alignSelf: 'center', borderRadius: 10 }}>
                        {/* <Text>sdkjnkjsdfnjkdsf</Text> */}
                        <TouchableOpacity style={{ alignSelf: 'flex-end', paddingRight: 25, position: 'absolute', top: 20, right: -10 }} onPress={() => setModalVisible(false)}>
                            <AntDesign name="closecircleo" size={24} color="#353431" />
                        </TouchableOpacity>
                        <View style={{ marginTop: 0, padding: 30, borderRadius: 30 }}>
                            {!error ?
                                <>
                                    <Text style={{ fontSize: 18, color: '#353431', textAlign: 'center', fontWeight: '500' }}>Please enter the verification code sent to your phone.</Text>

                                    <TextInput
                                        autoCapitalize={'none'}
                                        autoFocus={true}
                                        placeholderTextColor={'#000'}
                                        value={code}
                                        onChangeText={enterCode}
                                        style={{ marginTop: 16, height: 40, backgroundColor: '#ddd', borderRadius: 20, textAlign: 'center', fontSize: 18, width: 100, alignSelf: 'center' }}
                                    />
                                </>

                                :

                                <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>Incorrect Code</Text>
                            }
                        </View>

                    </View>

                </View>
            </Modal>

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible2}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name={!driverAgreementComplete ? "square" : "check-square"} style={{ marginRight: 40 }} size={18} color="black" />
                        <TouchableOpacity style={{ backgroundColor: 'white', alignSelf: 'center', backgroundColor: '#ddd', padding: 10, borderRadius: 8 }} onPress={driverAgreement}><Text>Driver Agreement</Text></TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 100, alignItems: 'center' }}>
                        <Feather name={!pushNotificationsComplete ? "square" : "check-square"} style={{ marginRight: 40 }} size={18} color="black" />
                        <TouchableOpacity style={{ backgroundColor: 'white', alignSelf: 'center', backgroundColor: '#ddd', padding: 10, borderRadius: 8 }} onPress={requestToken}><Text>Push Notifications</Text></TouchableOpacity>
                    </View>

                </View>
            </Modal>

            <DriverPicker driver={driver} setDriver={setDriver} drivers={drivers} setDrivers={setDrivers} open={open} setOpen={setOpen} />

            {driver && !open &&
                <View style={{marginTop:160}}>
                    <View style={{ height: 100, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18 }}>{driver?.firstName}</Text>
                    </View>
                    <View style={{ height: 100, backgroundColor: null, justifyContent: 'center' }}>
                        <TouchableOpacity style={{ backgroundColor: '#ddd', padding: 10, borderRadius: 10, paddingHorizontal: 60 }} onPress={signIn}><Text>Next</Text></TouchableOpacity>
                    </View>
                </View>

            }

        </View>

    );

}