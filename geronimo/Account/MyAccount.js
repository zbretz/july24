import { useState, useRef, useEffect } from 'react';
import { Text, View, TextInput, Dimensions, Alert, Modal, SafeAreaView, TouchableOpacity, Keyboard, Image, Linking, Platform, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign, MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import fetchPushToken from './fetchPushToken';
import pushConfig from './pushConfig';
import * as Animatable from 'react-native-animatable';
import url from '../url_toggle'

const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MyAccount({ navigation, masterState, setMasterState }) {

    const { user } = masterState

    return (



        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >

            {user ?
                <>
                    <Stack.Screen name="AccountDetail">
                        {props => <AccountDetail {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>

                    <Stack.Screen name="Information">
                        {props => <InformationScreen {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>

                    <Stack.Screen name="DeleteAccount">
                        {props => <DeleteAccount {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>

                    <Stack.Screen name="ReceiptScreen">
                        {props => <ReceiptScreen {...props} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>
                </>

                :

                <>
                    <Stack.Screen name="SignIn"
                        options={{
                            animationEnabled: false,
                        }}
                    >
                        {props => <SignUpScreens {...props} type={'signin'} masterState={masterState} setMasterState={setMasterState} />}
                    </Stack.Screen>

                    <Stack.Screen name="SignUp"
                        options={{
                            presentation: "modal",
                        }}
                    >
                        {props => <SignUpScreens {...props} type={'signup'} masterState={masterState} setMasterState={setMasterState} />}

                    </Stack.Screen>
                </>
            }


        </Stack.Navigator>


    )
}





const AccountDetail = ({ navigation, masterState, setMasterState }) => {

    const { user } = masterState
    const [showDeleteInput, setShowDeleteInput] = useState(false)

    const logout = () => {
        AsyncStorage.clear()
        setMasterState(masterState => { return { ...masterState, user: null } })
    }

    const comingSoonAlert = (type) => {

        const text = type === 'receipt' ?
            `This feature is not yet active. For help with receipts, text Zach at 917-575-1955. Thanks!`
            :
            `This feature is not yet active. We're working on it!`

        const title = type === 'receipt' ?
            `Please call.`
            :
            `Coming Soon!`


        Alert.alert(title, text, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Accept', onPress: () => {
                }
            },
        ])

    }


    return (

        <View style={{ height: '100%', backgroundColor: '#fff', paddingTop: 40 }}>

            <View style={{ position: 'absolute', top: 20, right: 16, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 40, alignSelf: 'center', marginTop: 30, paddingHorizontal: 30 }} adjustsFontSizeToFit={true} numberOfLines={1}>
                Hello, {user.firstName}.
            </Text>

            {/* <View style={{ flexDirection: 'row', margin: 20, padding: 30, borderRadius: 30, borderColor: '#666', borderWidth: 0, justifyContent: 'center', alignItems: 'center', }}>
                <Image style={{ height: '300%', flex: 2, marginRight: 10, }} resizeMode='contain' source={require('../assets/coming-soon.png')} />
                <Text style={{ flexWrap: 'wrap', flex: 3, fontSize: 18, padding: 0, fontFamily: 'Aristotelica-Regular', }}>Preferences and other settings are on the way!</Text>
            </View> */}

            <TouchableOpacity onPress={logout} style={{ padding: 20, margin: 20, backgroundColor: '#e6e6e6', borderRadius: 20, alignSelf: 'baseline' }}>
                <Text style={{ fontFamily: 'Aristotelica-Regular', }}>
                    Logout
                </Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, margin: 20, padding: 0 }}>
                <TouchableOpacity onPress={() => navigation.navigate('ReceiptScreen')} style={{ padding: 20, fontSize: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Aristotelica-Regular' }}>Receipt Preferences</Text>
                    <AntDesign name="right" size={16} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => comingSoonAlert('driver')} style={{backgroundColor:'#f2f2f2', padding: 20, fontSize: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Aristotelica-Regular', color:'#b2b2b2',  }}>Driver Preferences</Text>
                    <AntDesign name="right" size={16} color="#b2b2b2" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('DeleteAccount')} style={{ backgroundColor:'#f2f2f2', borderBottomLeftRadius: 30, borderBottomRightRadius:30, padding: 20, fontSize: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Aristotelica-Regular', color:'#b2b2b2', }}>Other Settings</Text>
                    <AntDesign name="right" size={16} color="#b2b2b2" />
                </TouchableOpacity>
            </View>



            <TouchableOpacity onPress={() => navigation.navigate('Information')} style={{ backgroundColor: '#f2f2f2', borderRadius: 30, margin: 20, padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Image style={{ height: 34, width: 34, marginRight: 10, }} resizeMode='contain' source={require('../assets/information.png')} />
                <Text style={{ fontSize: 16, fontFamily: 'Aristotelica-Regular' }}>Information</Text>
            </TouchableOpacity>

        </View>

    )

}


const SignUpScreens = ({ navigation, type, masterState, setMasterState }) => {

    const [modalVisible, setModalVisible] = useState(false)
    const [error, setError] = useState()
    const [accountInput, setAccountInput] = useState({ phone: '', firstName: '', lastName: '' })
    const [code, setCode] = useState('')
    const [complete, setComplete] = useState(false)
    const userRef = useRef()

    const enterCode = async (code) => {

        setCode(code)

        if (code.length === 4) {
            axios.post(`${url}/auth/userCode`, { user: accountInput, code, type })
                .then(async (res) => {
                    if (res.data.status == 'ok') {
                        console.log('user code response: ', res.data.user)

                        userRef.current = res.data.user

                        let push_token = await AsyncStorage.getItem('ExpoPushToken')
                        // console.log('push tokenn: ', push_token)

                        // const { status } = await Notifications.requestPermissionsAsync();

                        // console.log('push status: ', status)
                        // if (push_token || status == 'granted') {
                        if (push_token) {

                            // if (status !== 'granted') {
                            AsyncStorage.setItem('User', JSON.stringify(res.data.user))
                            setMasterState(masterState => ({ ...masterState, user: res.data.user }))
                            setModalVisible(false)
                        } else {
                            setComplete(true)
                            Keyboard.dismiss()
                        }
                    } else {
                        setCode('')
                        errorTimeout('Incorrect Code')
                    }

                })
        }
    }


    const requestToken = async () => {
        let user = userRef.current
        console.log('request token function - user: ', user)
        const { status } = await Notifications.requestPermissionsAsync();

        // console.log('push token: ', push_token)

        if (status == 'granted') {
            let push_token = (await Notifications.getExpoPushTokenAsync({ projectId: 'ef351239-8922-4a5d-ac35-a9d64e9afd73' })).data;
            await AsyncStorage.setItem('ExpoPushToken', push_token)
            let userId = user._id//res.data.user._id
            console.log('user id: ', userId)

            console.log('request token push token!!: ', push_token)
            axios({
                method: 'post',
                url: `${url}/auth/saveExpoPushToken`,
                data: { userId, push_token }

            })
                .then(res => {
                    console.log('push token save response: ', res)
                })
                .catch((err) => console.log('push token save error: ', err))


        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        setModalVisible(false)
        AsyncStorage.setItem('User', JSON.stringify(user))
        setMasterState(masterState => ({ ...masterState, user: user }))

    }


    const errorTimeout = (msg,) => {
        setError(msg)
        setTimeout(() => {
            setError(null)
        }, 4000)
    }

    const isValidPhone = (phone = "") => {
        phone = phone.replace(/[^0-9]/g, "")
        return phone.length === 10 ? true : phone.length === 11 ? phone[0] === '1' ? true : false : false
    };

    const isValidName = (first = "", last = "") => {
        return first.length + last.length > 4
    };


    const signIn = () => {

        if (!isValidPhone(accountInput.phone)) { errorTimeout("Please enter a valid phone number"); return }

        axios.post(`${url}/auth/signIn`, { user: accountInput })
            .then(res => {
                if (res.data) {
                    console.log('phone number recognized: ', res.data)
                    setModalVisible(true)
                } else {
                    //number not recognized
                    errorTimeout('Phone number not recognized')
                }
            })
            .catch(e => console.log('sign in error: ', e))
    }

    const registerUser = () => {

        if (!isValidName(accountInput.firstName, accountInput.lastName)) { errorTimeout("Please enter a valid name"); return }
        if (!isValidPhone(accountInput.phone)) { errorTimeout("Please enter valid phone number"); return }


        axios.post(`${url}/auth/registerUser`, { user: accountInput })
            .then(res => {
                if (res.data === 'ok') {
                    console.log('register user response: ', res.data)
                    setModalVisible(true)
                }
                else {
                    console.log('registration error!')
                    errorTimeout("Phone number taken.\nTry signing in!")
                }
            })

    }


    return (
        <>

            <View style={{ height: '100%', backgroundColor: '#fff' }}>


                <View style={{ position: 'absolute', top: 24, right: 24, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', }} name="arrow-back-ios" size={24} color="black" >
                    <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                </View>

                <>
                    <Modal
                        animationType='slide'
                        transparent={true}
                        visible={modalVisible}
                        style={{ height: windowHeight, width: windowWidth, }}>

                        <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.6)', }}>

                            <TouchableOpacity onPress={() => { console.log('close modal'); setModalVisible(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                            <View style={{ backgroundColor: '#f2f2f2', top: windowHeight * .1, alignSelf: 'center', borderRadius: 20, padding: 20, justifyContent: 'center' }}>
                                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={{ borderRadius: 30, }}>
                                        <>
                                            <Image style={{ height: 90, width: 90, alignSelf: 'center' }} source={require('../assets/unlock.png')} />
                                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 10 }}>Please enter the verification code sent to your phone.</Text>
                                            <TextInput
                                                keyboardType='numeric'
                                                autoCapitalize={'none'}
                                                autoFocus={true}
                                                placeholderTextColor={'#000'}
                                                value={code}
                                                onChangeText={enterCode}
                                                style={{ marginTop: 16, height: 40, backgroundColor: '#fff', borderRadius: 20, textAlign: 'center', fontSize: 20, width: 100, alignSelf: 'center' }}
                                            />
                                        </>
                                        {error && <Text style={{ color: '#000', fontSize: 22, fontFamily: 'Aristotelica-Regular', textAlign: 'center', marginTop: 20 }}>Incorrect Code</Text>}
                                    </View>
                                </View>
                            </View>

                            {complete &&
                                <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent' }}>

                                    <Animatable.View
                                        style={{ zIndex: 1 }}
                                        animation={{
                                            from: { left: '-150%' }, // Start position
                                            to: { left: '0%' }, // End position
                                        }}
                                        delay={0}
                                    >


                                        <View style={{ backgroundColor: 'rgba(255,255,255,1)', height: windowHeight, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                            <Image style={{ marginHorizontal: 0, position: 'absolute', top: windowHeight * .10, height: windowHeight * .25, width: windowWidth * .65, zIndex: -1 }} source={require('../assets/woman-flying.png')} />

                                            <View style={{ width: windowWidth * .65, backgroundColor: '#f2f2f2', padding: 20, borderRadius: 40 }}>

                                                <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 20, padding: 16 }}>
                                                    <Text style={{ fontFamily: 'Aristotelica-DemiBold', fontSize: 36, marginTop: 0, textAlign: 'left', padding: 0, marginBottom: 4 }} adjustsFontSizeToFit={true} numberOfLines={1}>Notifications</Text>
                                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginTop: 0, textAlign: 'left', padding: 0, marginBottom: -8 }} adjustsFontSizeToFit={true} numberOfLines={3}>A critical tool for keeping you in the loop on rides and more.</Text>
                                                </View>

                                                <TouchableOpacity onPress={requestToken} style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginTop: 0, textAlign: 'center', padding: 20, paddingHorizontal: 16, marginBottom: -8 }} adjustsFontSizeToFit={true} numberOfLines={1}>Allow Notifications</Text>
                                                </TouchableOpacity>

                                            </View>


                                        </View>

                                    </Animatable.View>

                                </View>

                            }

                        </View>
                    </Modal>


                    {type == 'signin' ?

                        <View style={{ flex: 1, backgroundColor: '#fff' }}>

                            <View style={{ justifyContent: 'center', flex: 1, }}>

                                <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderRadius: 40, backgroundColor: '#f2f2f2', marginHorizontal: 40, alignItems: 'center', }}>

                                    <TextInput
                                        keyboardType='numeric'
                                        placeholderTextColor={'#ccc'}
                                        placeholder='Phone Number'
                                        value={accountInput.phone}
                                        onChangeText={text => setAccountInput({ ...accountInput, phone: text })}
                                        style={{ backgroundColor: '#fff', borderRadius: 24, color: '#333', fontWeight: '500', marginVertical: 0, padding: 10, paddingLeft: 6, fontSize: Platform.OS === 'ios' ? '22em' : 22, textAlign: 'center', fontFamily: 'PointSoftSemiBold', width: '100%' }}
                                    />


                                    <TouchableOpacity onPress={() => { Keyboard.dismiss(); signIn() }} style={{ marginTop: 10, backgroundColor: '#ffcf56', borderRadius: 24, textAlign: 'center', justifyContent: 'center', width: '100%', padding: 10, }}>
                                        <Text style={{ lineHeight: 20, textAlign: 'center', fontSize: Platform.OS === 'ios' ? '20em' : 20, color: '#000', fontFamily: 'PointSoftSemiBold', }}>Sign In</Text>
                                    </TouchableOpacity>

                                </View>

                                {error ?
                                    <View style={{ backgroundColor: '#55c1ff', borderRadius: 30, marginHorizontal: 40, padding: 10, marginTop: 10, padding: 10 }}>
                                        <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Aristotelica-Regular', textAlign: 'center', marginBottom: -8, }}>{error}</Text>
                                    </View>
                                    :

                                    <View style={{}}>
                                        <Text style={{ textAlign: 'center', fontSize: Platform.OS === 'ios' ? '18em' : 18, color: '#000', fontFamily: 'PointSoftSemiBold', margin: 10 }}>Or</Text>

                                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{ backgroundColor: '#ffcf56', borderRadius: 24, textAlign: 'center', padding: 10, paddingHorizontal: 16, marginHorizontal: 60 }}>
                                            <Text style={{ lineHeight: 20, textAlign: 'center', fontSize: Platform.OS === 'ios' ? '20em' : 20, color: '#000', fontFamily: 'PointSoftSemiBold' }}>New Account</Text>
                                        </TouchableOpacity>
                                    </View>
                                }




                            </View>

                            <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#ffcf56', height: windowHeight * .3, width: '100%', zIndex: -1 }}>
                                <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#fff', height: windowHeight * .5, width: windowWidth, zIndex: -1, borderRadius: 880 }} />
                            </View>

                            <Image style={{ marginHorizontal: 0, position: 'absolute', top: windowHeight * .05, left: -20, height: windowHeight * .65, width: windowWidth * .65, zIndex: -1 }} source={require('../assets/woman-wave.png')} />


                        </View>


                        :

                        <View style={{ flex: 1, backgroundColor: '#fff' }}>
                            <View style={{ backgroundColor: '#fff', padding: 20, zIndex: -2 }}>
                                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="chevron-back-outline" size={24} color="black" /></TouchableOpacity>
                            </View>

                            <View style={{ justifyContent: 'center', flex: 1, }}>

                                <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderRadius: 40, backgroundColor: '#f2f2f2', marginHorizontal: 40, marginTop: -50, alignItems: 'center' }}>


                                    <TextInput
                                        placeholderTextColor={'#ccc'}
                                        placeholder='First Name'
                                        value={accountInput.firstName}
                                        onChangeText={text => setAccountInput({ ...accountInput, firstName: text })}
                                        style={{ backgroundColor: '#fff', borderRadius: 24, color: '#333', fontWeight: '500', marginVertical: 0, padding: 10, paddingLeft: 6, fontSize: Platform.OS === 'ios' ? '22em' : 22, textAlign: 'center', fontFamily: 'PointSoftSemiBold', width: '100%' }}
                                    />

                                    <TextInput
                                        // autoCapitalize={'none'}
                                        // autoFocus={true}
                                        placeholderTextColor={'#ccc'}
                                        placeholder='Last Name'
                                        // onChangeText={(value) => createReservation(value, 'Name')}
                                        value={accountInput.lastName}
                                        // onChangeText={text => setMasterState((masterState) => ({ ...masterState, user: { ...masterState.user, lastName: text } }))}
                                        onChangeText={text => setAccountInput({ ...accountInput, lastName: text })}
                                        style={{ backgroundColor: '#fff', borderRadius: 24, color: '#333', fontWeight: '500', marginVertical: 10, padding: 10, paddingLeft: 6, fontSize: Platform.OS === 'ios' ? '22em' : 22, textAlign: 'center', fontFamily: 'PointSoftSemiBold', width: '100%' }}
                                    />

                                    <TextInput
                                        keyboardType='numeric'
                                        placeholderTextColor={'#cccccc'}
                                        placeholder='Phone Number'
                                        value={accountInput.phone}
                                        onChangeText={text => setAccountInput({ ...accountInput, phone: text })}
                                        style={{ backgroundColor: '#fff', borderRadius: 24, color: '#333', marginVertical: 0, padding: 10, paddingLeft: 6, fontSize: Platform.OS === 'ios' ? '22em' : 22, textAlign: 'center', fontFamily: 'PointSoftSemiBold', width: '100%' }}
                                    />


                                    <TouchableOpacity onPress={() => { Keyboard.dismiss(); registerUser() }} style={{ marginTop: 10, backgroundColor: '#ffcf56', borderRadius: 24, textAlign: 'center', justifyContent: 'center', width: '100%' }}>
                                        <Text style={{ textAlign: 'center', fontSize: Platform.OS === 'ios' ? '20em' : 20, color: '#000', fontFamily: 'PointSoftSemiBold', marginBottom: 0, padding: 10, }}>Create Account</Text>
                                    </TouchableOpacity>


                                </View>

                                {error &&
                                    <View style={{ backgroundColor: '#55c1ff', borderRadius: 30, marginHorizontal: 40, padding: 10, marginTop: 10, }}>
                                        <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Aristotelica-Regular', textAlign: 'center', marginBottom: -8, }}>{error}</Text>
                                    </View>
                                }

                            </View>



                            <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#ffcf56', height: windowHeight * .3, width: '100%', zIndex: -1 }}>
                                <View style={{ position: 'absolute', bottom: 0, backgroundColor: '#fff', height: windowHeight * .5, width: windowWidth, zIndex: -1, borderRadius: 880 }} />
                            </View>

                            <Image style={{ marginHorizontal: 0, position: 'absolute', top: windowHeight * .05, left: -20, height: windowHeight * .65, width: windowWidth * .65, zIndex: -1 }} source={require('../assets/woman-thumbs.png')} />



                        </View>
                    }


                </>
            </View >


        </>
    )

}



const DeleteAccount = ({ navigation, masterState, setMasterState }) => {

    const { user } = masterState

    const [showDelete, setShowDelete] = useState(false)
    const [deleteInput, setDeleteInput] = useState('')
    const [error, setError] = useState(null)

    const deleteUser = () => {
        Alert.alert(`Delete My Account`, `This action is irreversible. Are you sure that you want to delete your account?`, [
            {
                text: 'Cancel',
                onPress: () => { console.log('Cancel Pressed'); navigation.goBack() },
                style: 'cancel',

            },
            {
                text: 'Yes', onPress: () => {
                    setShowDelete(true)
                }
            },
        ]);
    }

    const submitDelete = () => {

        if (deleteInput !== 'delete') { navigation.goBack(); return }

        axios.delete(`${url}/auth/deleteUser`, { data: { userId: user._id } })
            .then(async res => {
                if (res.data) {
                    await AsyncStorage.clear()
                    setMasterState(masterState => { return { ...masterState, user: null } })
                } else {
                    setError("Please cancel your scheduled rides before deleting your account")
                }
            })
    }

    useEffect(() => {
        return () => {
            showDelete == true && setShowDelete(false)
        }
    }, [])

    return (

        <View style={{ padding: 20, height: '100%' }}>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', height: 34, width: 34, zIndex: 98, borderRadius: 20, margin: 20, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={20} color="black" />
            </TouchableOpacity>



            {showDelete ?
                <View style={{ marginTop: 20, backgroundColor: '#ddd', borderRadius: 10, height: 100, width: windowWidth * .75, padding: 10 }}>
                    <Text>
                        Please enter the word <Text style={{ fontStyle: 'italic' }}>delete</Text> to complete this action.
                    </Text>

                    <TextInput style={{ paddingLeft: 10, backgroundColor: null, backgroundColor: '#fff', padding: 10, marginVertical: 10, borderRadius: 10 }} onChangeText={(text) => { setDeleteInput(text) }} value={deleteInput} />
                    <TouchableOpacity onPress={submitDelete} style={{ padding: 10, marginTop: 40, backgroundColor: '#ddd', borderRadius: 20, alignSelf: 'baseline' }}>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', }}>
                            Submit
                        </Text>
                    </TouchableOpacity>



                </View>

                :

                <TouchableOpacity onPress={deleteUser} style={{ padding: 10, marginTop: 40, borderRadius: 20, position: 'absolute', left: 10, bottom: 100 }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', }}>
                        Delete Account
                    </Text>
                </TouchableOpacity>

            }

            {error &&
                <Text>{error}</Text>
            }

        </View>

    )
}





const InformationScreen = ({ navigation, }) => {

    return (

        <View style={{ padding: 20, height: '100%', backgroundColor: '#fff' }}>

            <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#f2f2f2', height: 34, width: 34, zIndex: 98, borderRadius: 20, position: 'absolute', top: 40, left: 20, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={20} color="black" />
            </TouchableOpacity>

            <Image style={{ width: windowWidth * .4, height: windowWidth * .4, backgroundColor: '#fff', marginTop: 38 }} resizeMode='contain' source={require('../assets/team-work.png')} />

            <View style={{ backgroundColor: '#f2f2f2', padding: 20, borderRadius: 40, marginTop: -8 }}>
                <View style={{ backgroundColor: '#fff', padding: 20, paddingVertical: 30, borderRadius: 30 }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, textAlign: 'center' }} >
                        Building the future of local commerce
                    </Text>
                </View>
            </View>

            <View style={{ backgroundColor: '#fff', marginTop: 30, flexDirection: 'row', width: '100%', }}>
                <View style={{ width: windowWidth * .5 }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginTop: 0, }} >For urgent support or general information, call Zach.</Text>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginVertical: 10, }} >He'll be happy to help or to answer your questions.</Text>

                </View>
                <Image style={{ flex: 1, backgroundColor: '#fff', width: windowWidth * .3, height: windowWidth * .4 }} resizeMode='contain' source={require('../assets/working-desk.png')} />

            </View>

            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${9175751955}`) }} style={{ alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 30, marginTop: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome name="phone" size={24} color="black" />
                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginTop: 0, textAlign: 'center', padding: 20, marginBottom: -8 }}>Call Now</Text>
            </TouchableOpacity>


        </View>

    )
}




const ReceiptScreen = ({ navigation, masterState, setMasterState }) => {

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
                    setLoadingPayForm(false); Alert.alert('Success', 'Preferences Saved', [])
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
                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 21, textAlign: 'center' }} >
                    Receipt Preferences
                </Text>
            </View>

            <View style={{ backgroundColor: '#f2f2f2', padding: 20, borderRadius: 30, marginVertical: 20, }}>
                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, textAlign: 'center' }} >
                    Enable receipts to generate an automatic email after each payment.
                </Text>
            </View>

            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, textAlign: 'left' }} >
                Email Address
            </Text>
            <TextInput style={{ paddingLeft: 10, backgroundColor: null, backgroundColor: '#f2f2f2', padding: 10, marginVertical: 10, borderRadius: 10, fontFamily: 'PointSoftSemiBold', fontSize: 16 }} onChangeText={(text) => { setEmailAddress(text) }} value={emailAddress} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, textAlign: 'left', marginTop: 10 }} >
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
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginTop: 0, textAlign: 'center', padding: 20, paddingHorizontal: 16, marginBottom: -8 }} adjustsFontSizeToFit={true} numberOfLines={1}>Save</Text>
                </TouchableOpacity>
            }


        </View>

    )
}










