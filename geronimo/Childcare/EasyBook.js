import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default EasyBook = ({ isConnected, masterState, setMasterState, navigation, basket, setBasket, partner, setPartner }) => {

    const video = useRef(null);

    const [age1, setAge1] = useState(null)
    const [age2, setAge2] = useState(null)
    const [age3, setAge3] = useState(null)
    const [age4, setAge4] = useState(null)
    const [numOfChildren, setNumOfChildren] = useState(1)
    const [dateTime, setDateTime] = useState('')
    const [notes, setNotes] = useState('')
    const [showNotes, setShowNotes] = useState(false)

    const changeNumOfChild = (inc_dec) => {
        if (inc_dec == 'inc' && numOfChildren < 4) {
            setNumOfChildren((num) => num + 1)
        } else if (inc_dec == 'dec' && numOfChildren > 1) {
            setNumOfChildren((num) => num - 1)
        }
    }

    const request = {age1, age2, age3, age4, dateTime, notes}

    const bookNow = () => {
        // axios.post(`${locals_url}/locals/placeOrder`, { user: masterState.user, basket, timeOfOrder: timeOfOrder, useWallet })
        // .then(res => {
        //     console.log('DATA: ', res.data)
        //     if (res.data[0]) {
        //         console.log('count: ', res.data[0].count)

        //         Alert.alert('Order Placed', 'Your order will be ready for pickup shortly. Just give your name at the counter!');
        //         navigation.navigate('LocalsHome')
        //         setBasket({ partner: null, items: [], pickupTime: '20 mins' })

        //        useWallet && setMasterState(masterState => {
        //             return {...masterState, user: {...masterState.user, wallet: {...masterState.user.wallet, balance: res.data[1] }}}
        //         })
        //     } else {
        //         console.log('nada')
        //     }
        // })
        // .catch(e => console.log('order  error: ', e))    }


        Alert.alert('Order Placed', JSON.stringify(request));

    }

    return (


        <View style={{ width: '100%', }}>
            <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
                <View style={{
                    borderRadius: 30, paddingBottom: 30, borderWidth: 0, backgroundColor: '#e6e6e6', shadowColor: '#000',
                    shadowOpacity: 0.38,
                    shadowRadius: 6,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                }}>
                    <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', textAlign: 'center' }}>Easy Book</Text>



                    <View style={{ padding: 20, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                        <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22 }}>Age of Child</Text>
                        </View>
                        <TextInput
                            inputMode='numeric'
                            placeholderTextColor={'#a1a1a1'}
                            placeholder='age'
                            // textAlignVertical='top'
                            value={age1}
                            onChangeText={(text) => setAge1(text)}
                            style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 20, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                        />

                    </View>

                    {numOfChildren > 1 &&
                        <View style={{ padding: 20, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginRight: 10 }}>Age of Child</Text>
                                {numOfChildren == 2 &&
                                    <TouchableOpacity onPress={() => changeNumOfChild('dec')}>
                                        <Ionicons style={{ marginTop: -6 }} name="remove-circle-outline" size={22} color="red" />
                                    </TouchableOpacity>}
                            </View>
                            <TextInput
                                inputMode='numeric'
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='age'
                                // textAlignVertical='top'
                                value={age2}
                                onChangeText={(text) => setAge2(text)}
                                style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 20, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                            />

                        </View>

                    }

                    {numOfChildren > 2 &&
                        <View style={{ padding: 20, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginRight: 10 }}>Age of Child</Text>
                                {numOfChildren == 3 &&
                                    <TouchableOpacity onPress={() => changeNumOfChild('dec')}>
                                        <Ionicons style={{ marginTop: -6 }} name="remove-circle-outline" size={22} color="red" />
                                    </TouchableOpacity>}

                            </View>
                            <TextInput
                                inputMode='numeric'
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='age'
                                // textAlignVertical='top'
                                value={age3}
                                onChangeText={(text) => setAge3(text)}
                                style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 20, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                            />

                        </View>
                    }

                    {numOfChildren > 3 &&
                        <View style={{ padding: 20, marginTop: -20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <View style={{ borderRadius: 10, backgroundColor: '#f2f2f2', padding: 10, flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginRight: 10 }}>Age of Child</Text>
                                {numOfChildren == 4 &&
                                    <TouchableOpacity onPress={() => changeNumOfChild('dec')}>
                                        <Ionicons style={{ marginTop: -6 }} name="remove-circle-outline" size={22} color="red" />
                                    </TouchableOpacity>}

                            </View>
                            <TextInput
                                inputMode='numeric'
                                placeholderTextColor={'#a1a1a1'}
                                placeholder='age'
                                // textAlignVertical='top'
                                value={age4}
                                onChangeText={(text) => setAge4(text)}
                                style={{ maxHeight: 120, width: 80, textAlign: 'center', fontSize: 20, backgroundColor: '#fff', borderColor: '#000', borderRadius: 20, padding: 10, paddingHorizontal: 20, fontFamily: 'PointSoftSemiBold', }}
                            />

                        </View>

                    }


                    {numOfChildren < 4 &&

                        <TouchableOpacity onPress={() => changeNumOfChild('inc')} style={{ marginHorizontal: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons style={{ marginTop: -6 }} name="add-circle-outline" size={22} color="black" />
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, }}> add child</Text>
                        </TouchableOpacity>
                    }
                    <View style={{ marginHorizontal: 20, borderBottomColor: '#d9d9d9', borderBottomWidth: 2 }} />



                    <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, marginLeft: 20, marginTop: 10, alignSelf: 'flex-start' }}>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22 }}>Date and Time</Text>
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


                    <TouchableOpacity onPress={() => setShowNotes(true)} style={{ margin: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons style={{ marginTop: -6 }} name="add-circle-outline" size={22} color="black" />
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, }}>Add Notes</Text>
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

                    <TouchableOpacity onPress={bookNow} style={{ backgroundColor: '#ffcf56', padding: 14, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 26, marginBottom: -6 }}>Book Now</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>


    );
}


