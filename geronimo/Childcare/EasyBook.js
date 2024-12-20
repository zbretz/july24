import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, Modal } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { url } from '../url_toggle'
import axios from 'axios';
import populateData from '../CoreNav/populateData';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default EasyBook = ({ masterState, setMasterState, sitter = null, navigation }) => {

    console.log('easy book sitter: ', sitter?.firstName)

    const [age1, setAge1] = useState(null)
    const [age2, setAge2] = useState(null)
    const [age3, setAge3] = useState(null)
    const [age4, setAge4] = useState(null)
    const [numOfChildren, setNumOfChildren] = useState(1)
    const [dateTime, setDateTime] = useState('')
    const [notes, setNotes] = useState('')
    const [showNotes, setShowNotes] = useState(false)

    const user = masterState.user

    const newBooking = {
        user: user ? { firstName: user.firstName, lastName: user.lastName, phone: user.phone, _id: user._id } : null,
        age1, age2, age3, age4, dateTime, notes, provider: null, providerMessage: null, completed: false, canceled: false,
        provider: sitter
    }

    const changeNumOfChild = (inc_dec) => {
        if (inc_dec == 'inc' && numOfChildren < 4) {
            setNumOfChildren((num) => num + 1)
        } else if (inc_dec == 'dec' && numOfChildren > 1) {
            setNumOfChildren((num) => num - 1)
        }
    }

    const bookNow = async () => {

        let user;

        if (!masterState.user) {
            user = await signIn()
            user = user.user
            console.log('signin success', user)

            newBooking.user = { firstName: user.firstName, lastName: user.lastName, phone: user.phone, _id: user._id }

            if (!user) {
                console.log('abort'); return
            }
        }


        if (!age1) { errorTimeout("Please enter child's age"); return }
        if (!dateTime) { errorTimeout("Please enter date and time"); return }


        console.log('booking now!!!: ', newBooking)

        axios.post(`${url}/childcare/booking`, { newBooking })

            .then(res => {
                if (res.data) {
                    console.log(res.data)
                    console.log('new booking: ', newBooking)

                    setMasterState(masterState => {
                        return ({ ...masterState, user: { ...masterState.user, childcareBookings: masterState.user.childcareBookings ? [...masterState.user.childcareBookings, newBooking] : [newBooking] }, })
                    })

                    navigation.navigate('Booking')
                } else {
                    console.log('nada')
                }
            })
            .catch(e => console.log('order  error: ', e))
    }




    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')

    // const [firstName, setFirstName] = useState('cvcv')
    // const [lastName, setLastName] = useState('cvcvc')
    // const [phone, setPhone] = useState('9175751955')


    const [error, setError] = useState()

    const [modalVisible, setModalVisible] = useState(false)

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
        return first.length && last.length && (first.length + last.length > 4)
    };

    const signIn = async () => {

        if (!isValidName(firstName, lastName)) { errorTimeout("Please enter a valid name"); return false }
        if (!isValidPhone(phone)) { errorTimeout("Please enter valid phone number"); return false }

        let signIn = await axios.post(`${url}/auth/childcareSignIn`, { user: { firstName, lastName, phone } })
        console.log('sign in response: ', signIn.data)

        return await awaitCode()
    }

    const promiseref = useRef(null)

    const awaitCode = () => {
        setModalVisible(true)
        return new Promise((resolve, reject) => {
            promiseref.current = resolve
        })
    }


    const [code, setCode] = useState('')

    const enterCode = (code) => {

        setCode(code)

        if (code.length === 4) {
            axios.post(`${url}/auth/childcareCode`, { phone: phone, code })
                .then(async (res) => {
                    if (res.data.status == 'ok') {
                        console.log('user code response: ', res.data.user)
                        populateData({ masterState, setMasterState, loginUser: res.data.user })
                        promiseref.current({ user: res.data.user })
                        setModalVisible(false)
                    } else {
                        setCode('')
                        errorTimeout('Incorrect Code')
                    }
                })
        }
    }

    return (

        <View style={{ width: '100%', }}>

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
                                        onChangeText={code => enterCode(code)}
                                        style={{ marginTop: 16, height: 40, backgroundColor: '#fff', borderRadius: 20, textAlign: 'center', fontSize: 20, width: 100, alignSelf: 'center' }}
                                    />
                                </>
                                {error && <Text style={{ color: '#000', fontSize: 22, fontFamily: 'Aristotelica-Regular', textAlign: 'center', marginTop: 20 }}>Incorrect Code</Text>}
                            </View>
                        </View>
                    </View>

                </View>
            </Modal>
            <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
                <View style={{
                    borderRadius: 30, paddingBottom: 30, borderWidth: 0, backgroundColor: '#e6e6e6', shadowColor: '#000',
                    shadowOpacity: 0.38,
                    shadowRadius: 3,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                }}>

                    {sitter ?
                        <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', textAlign: 'center' }}>Book {sitter.firstName}</Text>
                        :
                        <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', textAlign: 'center' }}>Easy Book</Text>
                    }


                    {!masterState.user &&
                        <View>
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, marginLeft: 20, marginTop: 10, alignSelf: 'flex-start' }}>
                                <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22 }}>Parent/Adult Name</Text>
                            </View>
                            <TextInput
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='First Name'
                                value={firstName}
                                onChangeText={(text) => setFirstName(text)}
                                style={{ maxHeight: 120, fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 10, fontFamily: 'PointSoftSemiBold', }}
                            />

                            <View>

                                <TextInput
                                    placeholderTextColor={'#a1a1a1'}
                                    placeholder='Last Name'
                                    value={lastName}
                                    onChangeText={(text) => setLastName(text)}
                                    style={{ maxHeight: 120, fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 10, fontFamily: 'PointSoftSemiBold', }}
                                />
                            </View>

                            <View>
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, marginLeft: 20, marginTop: 10, alignSelf: 'flex-start' }}>
                                    <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22 }}>Phone Number</Text>
                                </View>
                                <TextInput
                                    placeholderTextColor={'#a1a1a1'}
                                    placeholder='eg. 435-123-4567'
                                    value={phone}
                                    onChangeText={(text) => setPhone(text)}
                                    style={{ maxHeight: 120, fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 10, fontFamily: 'PointSoftSemiBold', }}
                                />
                            </View>

                            <View style={{ marginHorizontal: 20, borderBottomColor: '#d9d9d9', borderBottomWidth: 2, marginTop: 10 }} />

                        </View>


                    }

                    <View style={{ padding: 20, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, }}>
                            <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22 }}>Age of Child</Text>
                        </View>
                        <TextInput
                            inputMode='numeric'
                            placeholderTextColor={'#a1a1a1'}
                            placeholder='age'
                            // textAlignVertical='top'
                            value={age1}
                            onChangeText={(text) => setAge1(text)}
                            style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                        />

                    </View>

                    {numOfChildren > 1 &&
                        <View style={{ padding: 20, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22, }}>Age of Child</Text>
                                {numOfChildren == 2 &&
                                    <TouchableOpacity onPress={() => changeNumOfChild('dec')}>
                                        <Ionicons style={{ marginTop: -6 }} name="remove-circle-outline" size={22} color="red" />
                                    </TouchableOpacity>}
                            </View>
                            <TextInput
                                inputMode='numeric'
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='age'
                                value={age2}
                                onChangeText={(text) => setAge2(text)}
                                style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                            />

                        </View>

                    }

                    {numOfChildren > 2 &&
                        <View style={{ padding: 20, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22, }}>Age of Child</Text>
                                {numOfChildren == 3 &&
                                    <TouchableOpacity onPress={() => changeNumOfChild('dec')}>
                                        <Ionicons style={{ marginTop: -6 }} name="remove-circle-outline" size={22} color="red" />
                                    </TouchableOpacity>}
                            </View>
                            <TextInput
                                inputMode='numeric'
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='age'
                                value={age3}
                                onChangeText={(text) => setAge3(text)}
                                style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                            />

                        </View>
                    }

                    {numOfChildren > 3 &&
                        <View style={{ padding: 20, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22, }}>Age of Child</Text>
                                {numOfChildren == 4 &&
                                    <TouchableOpacity onPress={() => changeNumOfChild('dec')}>
                                        <Ionicons style={{ marginTop: -6 }} name="remove-circle-outline" size={22} color="red" />
                                    </TouchableOpacity>}

                            </View>
                            <TextInput
                                inputMode='numeric'
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='age'
                                value={age4}
                                onChangeText={(text) => setAge4(text)}
                                style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                            />

                        </View>

                    }


                    {numOfChildren < 4 &&

                        <TouchableOpacity onPress={() => changeNumOfChild('inc')} style={{ marginHorizontal: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center', }}>
                            <Ionicons style={{ marginTop: -6 }} name="add-circle-outline" size={22} color="black" />
                            <Text style={{ marginBottom: 0, fontFamily: 'Aristotelica-Regular', fontSize: 22, }}> Add child</Text>
                        </TouchableOpacity>
                    }
                    <View style={{ marginHorizontal: 20, borderBottomColor: '#d9d9d9', borderBottomWidth: 2 }} />



                    <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, marginLeft: 20, marginTop: 10, alignSelf: 'flex-start' }}>
                        <Text style={{ marginBottom: -4, fontFamily: 'Aristotelica-Regular', fontSize: 22 }}>Date and Time</Text>
                    </View>
                    <TextInput
                        placeholderTextColor={'#a1a1a1'}
                        placeholder='eg. Sunday 12/18 10am-3pm'
                        // textAlignVertical='top'
                        value={dateTime}
                        onChangeText={(text) => setDateTime(text)}
                        style={{ maxHeight: 120, fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 10, fontFamily: 'PointSoftSemiBold', }}
                    />

                    <View style={{ marginHorizontal: 20, borderBottomColor: '#d9d9d9', borderBottomWidth: 2, marginTop: 20 }} />


                    <TouchableOpacity onPress={() => setShowNotes(show => !show)} style={{ margin: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={{ marginTop: -6 }} name="add-circle-outline" size={22} color="black" />
                        <Text style={{ marginBottom: 0, fontFamily: 'Aristotelica-Regular', fontSize: 22, }}> Add Notes</Text>
                    </TouchableOpacity>

                    {showNotes &&
                        <TextInput
                            multiline
                            placeholderTextColor={'#a1a1a1'}
                            placeholder='Notes'
                            // textAlignVertical='top'
                            value={notes}
                            onChangeText={(text) => setNotes(text)}
                            style={{ maxHeight: 90, fontSize: 16, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, marginHorizontal: 20, paddingHorizontal: 20, marginTop: 0, fontFamily: 'PointSoftSemiBold', }}
                        />
                    }

                    {error &&
                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'center', marginTop: 10, }}>
                            <Text style={{ fontWeight: '500', color: 'red', fontSize: 20, textAlign: 'center' }}>{error}</Text>
                        </View>
                    }


                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>

                        <TouchableOpacity onPress={bookNow} style={{ backgroundColor: '#ffcf56', padding: 14, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 0, justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 26, marginBottom: -6 }}>Book Now</Text>
                        </TouchableOpacity>

                    </View>


                </View>
            </View>
        </View>


    );
}



