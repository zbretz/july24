import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, Linking, Platform, LayoutAnimation } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default ChildcareHome = ({ isConnected, masterState, setMasterState, navigation, booking }) => {

    if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const video = useRef(null);
    const [showBookingOptions, setShowBookingOptions] = useState(false)

    let numOfChildren = 1 + (!booking.age2 ? 0 : 1 + (!booking.age3 ? 0 : 1 + (!booking.age4 ? 0 : 1)))

    // const booking = {
    //     childrenAges: [1, 5, 8],
    //     dateTime: 'Dec 21 8am-1pm',
    //     sitter: 'Natalia',
    //     notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    // }



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

            <TouchableOpacity onPress={() => setShowBookingOptions(options => !options)} style={{ backgroundColor: '#e6e6e6', marginHorizontal: 20, padding: 8, borderRadius: 20, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, color: '#000', marginRight: 10 }}>Book another date</Text>
                    <AntDesign name="pluscircleo" size={20} color="#000" />
                </View>
            </TouchableOpacity>

            {showBookingOptions &&
                <View style={{ borderWidth: 0, margin: 0, borderColor: '#fff', marginTop: 10, flexDirection: 'row', marginHorizontal: 10, padding: 8, borderRadius: 20, }}>
                    <TouchableOpacity onPress={() => {navigation.navigate('EasyBook');setShowBookingOptions(false)}} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .22, borderRadius: 30, marginRight: 10, alignItems: 'center', paddingVertical: 20 }}>
                        <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/coffee.png')} />
                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Easy Book</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => {navigation.navigate('SitterList');setShowBookingOptions(false)}} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .22, borderRadius: 30, marginLeft: 10, alignItems: 'center', paddingVertical: 20, }}>
                        <Image style={{ flex: 1, width: '100%', margin: 8 }} resizeMode='contain' source={require('../assets/stroller.png')} />
                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Search Sitters</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            }





            <View style={{ marginHorizontal: 20, marginTop: 10, borderRadius: 20, borderWidth: 0 }}>
                <View style={{}}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 30 }}>Current Booking</Text>
                        {/* <AntDesign name="pluscircleo" size={30} color="black" /> */}
                    </View>
                    <Text style={{ fontSize: 20 }}>{booking.dateTime}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 18 }}>{numOfChildren} {booking.age2 ? <Text>children. Ages: </Text> : <Text>child. Age:</Text>}</Text>

                        {booking.age1 && <Text style={{ fontSize: 18 }}> {booking.age1}</Text>}
                        {booking.age2 && <Text style={{ fontSize: 18 }}>, {booking.age2}</Text>}
                        {booking.age3 && <Text style={{ fontSize: 18 }}>, {booking.age3}</Text>}
                        {booking.age4 && <Text style={{ fontSize: 18 }}>, {booking.age4}</Text>}
                        {/* {booking.childrenAges.map((age) => {
                            return (
                                <Text style={{ fontSize: 18 }}>{age}yo, </Text>
                            )
                        })} */}
                        <Text style={{ fontSize: 18 }}></Text>
                    </View>
                    <Text style={{ fontSize: 18 }}>Notes: {booking.notes}</Text>
                </View>
            </View>

            <View style={{ width: '100%' }}>
                <View style={{ marginHorizontal: 20, marginTop: 10, borderRadius: 20, borderWidth: .5, borderColor: '#d9d9d9' }} />
            </View>

            <View style={{ marginHorizontal: 20, marginTop: 10, borderRadius: 20, borderWidth: 0 }}>
                <View style={{}}>
                    <Text style={{ fontSize: 24 }}>Your Sitter</Text>
                </View>
            </View>




            {booking.sitter ?

                <>
                    <View style={{ marginHorizontal: 20, flexDirection: 'row' }}>
                        <Video
                            ref={video}
                            style={{ width: windowWidth * .4, height: windowWidth * .4, marginTop: 0, borderRadius: 20 }}
                            source={require('../assets/babysitter.mov')}
                            useNativeControls
                            resizeMode={ResizeMode.COVER}
                            isLooping
                            // shouldPlay
                            isMuted
                        // onPlaybackStatusUpdate={status => setStatus(() => status)}
                        />
                        <View onPress={() => navigation.navigate('SitterPage')} style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, marginRight: 0, borderRadius: 14, flex: 1, }}>
                            <Text style={{ color: '#000', fontSize: 22, fontWeight: 500 }}>Natalia</Text>
                            <Text style={{ color: '#000', fontSize: 19, fontWeight: 400 }}  >Hi Katie, I' Natalia. I'm looking forward to spending a few hours with your kids this Saturday.</Text>
                            <Text style={{ color: '#000', fontSize: 12, fontWeight: 400 }}  >12/23/22</Text>
                        </View>
                    </View>

                    <View style={{ marginVertical: 30, marginHorizontal: 20, alignSelf: 'flex-end' }}>
                        <View style={{
                            borderRadius: 30, borderWidth: 0, backgroundColor: '#e6e6e6', shadowColor: '#000', padding: 10, paddingHorizontal: 20,
                            shadowOpacity: 0.28,
                            shadowRadius: 2,
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            }
                        }}>
                            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${9175751955}`) }} style={{ borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Feather style={{ marginRight: 10 }} name="phone" size={22} color="#000" /><Text style={{ fontWeight: 600, fontSize: 22, fontFamily: 'Aristotelica-Regular', textAlign: 'center' }}>Call Natalia</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>

                :
                <View style={{ marginHorizontal: 20, flexDirection: 'row' }}>

                    <View style={{ marginTop: 0, borderRadius: 2, width: windowWidth * .4, height: windowWidth * .4, backgroundColor: '#e6e6e6', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ flex: 1, width: windowWidth * .3, height: windowWidth * .3, }} resizeMode='contain' source={require('../assets/person.png')} />
                    </View>
                    <View onPress={() => navigation.navigate('SitterPage')} style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, borderRadius: 14, flex: 1, }}>
                        <View style={{ flexDirection: 'row', flex:1 }}>
                            <Text style={{ color: '#000', fontSize: 19, fontWeight: 400, textAlign: 'left' }}  >Hi! Your sitter is being assigned. Give us a call if you'd like a faster update.</Text>
                            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${9175751955}`) }} style={{ borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffcf56', alignSelf: 'flex-end', padding: 10, position: 'absolute', bottom: 20, right: 0 }}>
                                <Feather style={{}} name="phone" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            }









        </ScrollView>






    );
}

