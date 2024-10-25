import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default ChildcareHome = ({ isConnected, masterState, setMasterState, navigation, basket, setBasket, partner, setPartner }) => {

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


        Alert.alert('Order Placed', 'Your order will be ready for pickup shortly. Just give your name at the counter!');
    
    }

    return (


        <ScrollView style={{ backgroundColor: '#fff', height: '100%' }}>



            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, marginTop: 20, flexDirection: 'row' }} name="arrow-back-ios" size={24} color="black" >
                <MaterialIcons style={{ marginLeft: 10, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" />
                <View>
                    <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, }}>Childcare</Text>
                    <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, }}>in Park City</Text>
                </View>
            </TouchableOpacity>


            <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <View style={{ alignItems: 'center', }}>

                {/* <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 11, backgroundColor: 'blue', width: windowHeight * .2, padding: 10, marginRight: 20, borderRadius: 14, backgroundColor: 'rgba(0,0,0,.4)' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Natalia</Text>
                    <Text style={{ color: 'white', fontSize: 11, }}>Teacher</Text>
                </View> */}

                <TouchableOpacity onPress={() => navigation.navigate('SitterPage')} style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 11, width: windowHeight * .2, padding: 10, marginRight: 20, borderRadius: 14, backgroundColor: 'rgba(0,0,0,.6)' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Meet Natalia</Text>
                    <Text style={{ color: 'white', fontSize: 11, }}>Teacher</Text>

                    <View style={{ position: 'absolute', top: 14, right: 20, zIndex: 11, zIndex: 98, borderRadius: 20, paddingTop: 0, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" >
                        <MaterialIcons style={{ marginLeft: 10 }} name="arrow-forward-ios" size={16} color="white" />
                    </View>

                </TouchableOpacity>


                <Video
                    ref={video}
                    style={{ height: windowWidth * .9, width: windowWidth * .9, marginTop: 0, borderRadius: 20 }}
                    source={require('../assets/babysitter.mov')}
                    useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    isMuted
                // onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
            </View>

            <View style={{ alignItems: 'center', }}>
                <View style={{ width: windowWidth * .9, marginTop: 10, borderRadius: 20, borderWidth: 0 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 30 }}>Book with confidence.</Text>
                        <Text style={{ fontSize: 18 }}>Connect with sitters who are <Image style={{ height: 12, width: 40, paddingLeft: 30, position: 'absolute' }} source={require('../assets/underline.png')} />real teachers at Park City daycares and pre-schools.</Text>


                        <View style={{ width: '88%', alignSelf: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', margin: 0 }} source={require('../assets/checkmark.json')} autoPlay loop='false' />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Professional childcare providers</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', margin: 0 }} source={require('../assets/checkmark.json')} autoPlay loop='false' />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Extensive training and experience</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', margin: 0 }} source={require('../assets/checkmark.json')} autoPlay loop='false' />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Highly referred</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ alignSelf: 'flex-end', marginRight: windowWidth * .1 }}>
                    <Text style={{ fontSize: 17, textDecorationLine: 'underline', fontWeight: 500 }}>Read More</Text>
                </View>
            </View>




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


            <View style={{ width: '100%', }}>
                <View style={{ marginVertical: 0, marginHorizontal: 10 }}>
                    <View style={{}}>
                        <View style={{ borderRadius: 30, marginRight: 0, alignItems: 'center', paddingBottom: 30, borderWidth: 0 }}>
                            <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>F.A.Q</Text>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="What are the sitters' rates?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}><Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$25</Text>/hour when booking through the Easy Book form above. Sitters have individual rates when they are requested specifically. Additional children add <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$5</Text>. </Text>
                                    </View>
                                </CollapsibleView>
                            </View>

                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="Who will I get?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0, width: '90%', }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>You're matched with a sitter based on availability. Every one of our sitters is trusted by families throughout Park City as a professional teacher and childcare provider.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>

                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="Can I request a specific sitter?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Yep, go over to our sitters page and find your favorite person. Please note that sitters name their own rates when booked individually.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>

                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="When will I receive confirmation?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>After you submit your booking, a member of the team will reach out to confirm within an hour.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="I have more questions!">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>And we have answers! Call us directly at any time for questions or help of any sort.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                        </View>
                    </View>
                </View>
            </View>



        </ScrollView>






    );
}




const CollapsibleView = ({ title, children }) => {

    if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const [collapsed, setCollapsed] = useState(false);


    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <View>
            <TouchableWithoutFeedback onPress={toggleCollapse}>
                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, }}>{title}</Text>
                </View>
            </TouchableWithoutFeedback>
            {collapsed &&
                <View style={{}}>
                    {children}
                </View>
            }
        </View>
    );
};