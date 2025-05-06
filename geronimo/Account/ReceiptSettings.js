
import { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, Dimensions, Alert, Modal, SafeAreaView, TouchableOpacity, Keyboard, Image, Linking, Platform, ActivityIndicator } from 'react-native';
import { AntDesign, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

import { url } from '../url_toggle'

export default ReceiptScreen = ({ navigation, masterState, setMasterState }) => {

    const [emailAddress, setEmailAddress] = useState(null)
    const [autoReceipts, setAutoReceipts] = useState(null)
    const [loadingPayForm, setLoadingPayForm] = useState(false)

    const saveEmailPreferences = () => {

        setLoadingPayForm(true)

        axios.post(`${url}/user/receiptPreferences`, { user: masterState.user, email: emailAddress, autoReceipts })
            .then(res => {
                if (res.data === 'ok') {
                    console.log('receipt preferences saved: ', res.data)
                    setMasterState({ ...masterState, user: { ...masterState.user, email: emailAddress, autoReceipts } })
                    Keyboard.dismiss()
                }
                else {
                    console.log('receipt error!')
                    // errorTimeout("Phone number taken.\nTry signing in!")
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
        //     setMasterState({...masterState, user:{...masterState.user, email:'hello@kitty.com', autoReceipts: true}})
        setEmailAddress(masterState.user.email)
        setAutoReceipts(masterState.user.autoReceipts)
    }, [])

    return (

        <View style={{ padding: 20, height: '100%', backgroundColor: '#fff' }}>

            <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#f2f2f2', height: 34, width: 34, zIndex: 98, borderRadius: 20, position: 'absolute', top: 40, left: 20, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={20} color="black" />
            </TouchableOpacity>



            <View style={{ backgroundColor: '#fff', textAlign: 'center', paddingTop: 30, borderRadius: 30, marginTop: 68 }}>
                <Text style={{ fontFamily: 'LexendMedium', fontSize: 21, textAlign: 'center' }} >
                    Receipt Preferences
                </Text>
            </View>

            <View style={{ backgroundColor: '#f2f2f2', padding: 20, borderRadius: 30, marginVertical: 20, }}>
                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'center' }} >
                    Enable receipts to generate an automatic email after each payment.
                </Text>
            </View>

            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'left' }} >
                Email Address
            </Text>
            <TextInput style={{ paddingLeft: 10, backgroundColor: null, backgroundColor: '#f2f2f2', padding: 10, marginVertical: 10, borderRadius: 10, fontFamily: 'PointSoftSemiBold', fontSize: 16 }} onChangeText={(text) => { setEmailAddress(text) }} value={emailAddress} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, textAlign: 'left', marginTop: 10 }} >
                    Receipts Enabled
                </Text>

                <TouchableOpacity onPress={() => setAutoReceipts(!autoReceipts)}>
                    {autoReceipts ? <MaterialIcons name="check-box" size={28} color="black" /> : <MaterialIcons name="check-box-outline-blank" size={28} color="black" />}
                </TouchableOpacity>
            </View>

            {loadingPayForm ?
                <View style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, height: 54, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
                    <ActivityIndicator />
                </View>
                :
                <TouchableOpacity onPress={saveEmailPreferences} style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 20, marginTop: 0, textAlign: 'center', padding: 20, paddingHorizontal: 16 }} adjustsFontSizeToFit={true} numberOfLines={1}>Save</Text>
                </TouchableOpacity>
            }


        </View>

    )
}


