import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';
import EasyBook from './EasyBook';
import Faq from './Faq'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default ChildcareHome = ({  masterState, setMasterState, navigation, setBooking }) => {

    const video = useRef(null);

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

                {/* <View style={{ alignSelf: 'flex-end', marginRight: windowWidth * .1 }}>
                    <Text style={{ fontSize: 17, textDecorationLine: 'underline', fontWeight: 500 }}>Read More</Text>
                </View> */}

            </View>


            <EasyBook setBooking={setBooking} navigation={navigation} />

            <TouchableOpacity onPress={()=>navigation.navigate('SitterList')} style={{ marginTop: 10, borderRadius: 20, borderWidth: 0, marginVertical: 10 }}>
                <Text style={{ fontSize: 30, textAlign: 'center' }}>Meet the Sitters</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                    <View style={{ backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10 }} name="arrow-back-ios" size={24} color="black" >
                        <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                    </View>
                    <View style={{ backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10 }} name="arrow-back-ios" size={24} color="black" >
                        <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                    </View>
                    <View style={{ backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10 }} name="arrow-back-ios" size={24} color="black" >
                        <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                    </View>
                </View>
            </TouchableOpacity>


            <Faq />



        </ScrollView>






    );
}


