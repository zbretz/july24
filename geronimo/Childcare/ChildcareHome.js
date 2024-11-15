import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';
import EasyBook from './EasyBook';
import Faq from './Faq'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default ChildcareHome = ({ masterState, setMasterState, navigation, providers }) => {

    const video = useRef(null);
    // const [isLoading, setIsLoading] = useState(true)

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

                {/* <TouchableOpacity onPress={() => navigation.navigate('SitterPage', { name: providers[0].firstName })} style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 11, width: windowHeight * .2, padding: 10, marginRight: 20, borderRadius: 14, backgroundColor: 'rgba(0,0,0,.6)' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Meet Natalia</Text>
                    <Text style={{ color: 'white', fontSize: 11, }}>Teacher</Text>
                    <View style={{ position: 'absolute', top: 14, right: 20, zIndex: 11, zIndex: 98, borderRadius: 20, paddingTop: 0, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" >
                        <MaterialIcons style={{ marginLeft: 10 }} name="arrow-forward-ios" size={16} color="white" />
                    </View>
                </TouchableOpacity> */}

                {/* <View style={{ height: 90, width: 90, backgroundColor: isLoading ? 'red' : 'green' }} /> */}

                <Video
                    ref={video}
                    style={{ height: windowWidth * .9, width: windowWidth * .9, marginTop: 0, borderRadius: 20 }}
                    source={require('../assets/babysitter.mov')}
                    // source={{ uri: 'https://theparkcityapp.s3.us-east-1.amazonaws.com/istockphoto-1369478616-640_adpp_is.mp4' }}
                    // useNativeControls
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    shouldPlay
                    isMuted
                    // onLoad={() => setIsLoading(false)}
                />
            </View>

            <View style={{ alignItems: 'center', }}>
                <View style={{ width: windowWidth * .9, marginTop: 10, borderRadius: 20, borderWidth: 0 }}>
                    <View style={{}}>



                        <Text style={{ fontSize: 30 }}>Book with confidence.</Text>

                        <Text style={{ fontSize: 18 }}>Whether it's parent's night out, or you need support for a day on the slopes, our sitters have you covered.</Text>


                        <View style={{ width: '88%', alignSelf: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', marginHorizontal: -6 }} source={require('../assets/checkmark.json')} autoPlay loop='false' />
                                <Text style={{ marginHorizontal: 6, fontSize: 16 }}>Background and reference checked</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', marginHorizontal: -6 }} source={require('../assets/checkmark.json')} autoPlay loop='false' />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Deep childcare experience</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', marginHorizontal: -6 }} source={require('../assets/checkmark.json')} autoPlay loop='false' />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Childcare for all ages: infants to teens</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* <View style={{ alignSelf: 'flex-end', marginRight: windowWidth * .1 }}>
                    <Text style={{ fontSize: 17, textDecorationLine: 'underline', fontWeight: 500 }}>Read More</Text>
                </View> */}

            </View>


            <EasyBook masterState={masterState} navigation={navigation} setMasterState={setMasterState} />

            <Text style={{ fontSize: 30, textAlign: 'center' }}>Meet the Childcare Team</Text>

            <View style={{ marginTop: 10, borderRadius: 20, borderWidth: 0, marginVertical: 10 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                    {Object.values(providers).slice(0, 3).map((sitter, idx) => {
                        return (

                            <TouchableOpacity onPress={() => navigation.navigate('SitterList')} key={idx} style={{ backgroundColor: '#FFCF56', zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginRight: 10 }} name="arrow-back-ios" size={24} color="black" >
                                <Image style={{ height: 100, width: 100, borderRadius: 30 }} source={{ uri: sitter.cover_photo }} />
                            </TouchableOpacity>
                        )
                    })}
                </View>

            </View>


            <Faq />



        </ScrollView>






    );
}


