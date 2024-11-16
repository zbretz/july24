import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';
import EasyBook from './EasyBook';
import Faq from './Faq'
import { LinearGradient } from 'expo-linear-gradient';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default ChildcareHome = ({ masterState, setMasterState, navigation, providers }) => {

    const video = useRef(null);
    // const [isLoading, setIsLoading] = useState(true)
    const scrollRef = useRef(null)

    return (

        <>


            <ScrollView bounces={false} pagingEnabled={true} style={{}}>



                {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, marginTop: 20, flexDirection: 'row', position: 'absolute', zIndex: 1 }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="#fff" />
                    <View>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, color: '#fff' }}>Childcare</Text>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, color: '#fff' }}>in Park City</Text>
                    </View>
                </TouchableOpacity> */}

<TouchableOpacity onPress={() => scrollRef.current.scrollTo({x:windowWidth*.18})} style={{ padding: 20, marginTop: 20, flexDirection: 'row', position: 'absolute', zIndex: 1 }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="#fff" />
                    <View>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, color: '#fff' }}>Childcare</Text>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, color: '#fff' }}>in Park City</Text>
                    </View>
                </TouchableOpacity>


                {/* <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                    <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                </View> */}

                <ScrollView ref={scrollRef} pagingEnabled={true} contentContainerStyle={{alignItems:'center'}} showsHorizontalScrollIndicator={false} horizontal style={{width: windowWidth * .23, position: 'absolute',  marginTop: 10, alignSelf: 'flex-end', backgroundColor: 'rgba(0,0,0,.3)', borderTopLeftRadius: 40, borderBottomLeftRadius: 40, marginTop: 30, padding: 12, }}>
                    <View style={{ flexDirection: 'row', }}>
                        {Object.values(providers).slice(0, 3).map((sitter, idx) => {
                            return (

                                <TouchableOpacity onPress={() => navigation.navigate('SitterList')} key={idx} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 }} name="arrow-back-ios" size={24} color="black" >
                                    <Image style={{ width: windowWidth * .17, height: windowWidth * .17, borderRadius: 40 }} source={{ uri: sitter.cover_photo }} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    {/* <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, color: '#fff', textAlign: 'center' }}>Meet The Team</Text> */}
                </ScrollView>




                <View style={{ height: windowHeight * .5, justifyContent: 'center' }} />



                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.85)', 'rgba(255,255,255,1)']} style={{ borderWidth: 0, padding: 30, paddingBottom: 20, zIndex: 10, }}>


                    <View style={{ marginTop: 190, marginBottom: 0 }} >

                        <Text style={{ fontSize: 30, color: '#000', fontWeight: 400 }}>Book with confidence.</Text>

                        <Text style={{ fontSize: 18, color: '#000' }}>Whether it's parent's night out, or you need support for a day on the slopes, our sitters have you covered.</Text>


                        <View style={{ width: '88%', alignSelf: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', marginHorizontal: -6 }} source={require('../assets/checkmark.json')} autoPlay={false} loop={false} />
                                <Text style={{ marginHorizontal: 6, fontSize: 16, color: '#000' }}>Background and reference checked</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', marginHorizontal: -6 }} source={require('../assets/checkmark.json')} autoPlay={false} loop={false} />
                                <Text style={{ marginLeft: 6, fontSize: 16, color: '#000' }}>Deep childcare experience</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: -6 }}>
                                <LottieView speed={.25} style={{ height: 34, width: 34, alignSelf: 'center', marginHorizontal: -6 }} source={require('../assets/checkmark.json')} autoPlay={false} loop={false} />
                                <Text style={{ marginLeft: 6, fontSize: 16, color: '#000' }}>Childcare for all ages: infants to teens</Text>
                            </View>
                        </View>
                    </View>


                </LinearGradient>


                <View style={{ backgroundColor: '#fff' }}>
                    <EasyBook masterState={masterState} navigation={navigation} setMasterState={setMasterState} />
                </View>

                <View style={{ justifyContent: 'center', backgroundColor: '#fff' }} >
                    <View style={{ borderRadius: 10, marginRight: 10, padding: 6 }}>
                        <Text style={{ fontSize: 30, textAlign: 'center', color: '#000' }}>Meet the Team</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10 }}>
                            {Object.values(providers).slice(0, 3).map((sitter, idx) => {
                                return (

                                    <TouchableOpacity onPress={() => navigation.navigate('SitterList')} key={idx} style={{ alignItems: 'center', justifyContent: 'center', }} name="arrow-back-ios" size={24} color="black" >
                                        <Image style={{ width: windowWidth * .16, height: windowWidth * .16, borderRadius: 30 }} source={{ uri: sitter.cover_photo }} />
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                    </View>
                </View>

                <View style={{ backgroundColor: '#fff' }}>
                    <Faq />
                </View>









            </ScrollView>




            <Video
                ref={video}
                style={{ height: windowHeight, width: windowWidth, position: 'absolute', zIndex: -1 }}
                // source={require('../assets/childcare_cover.mp4')}
                source={require('../assets/cover_tall.mp4')}
                // source={{ uri: 'https://theparkcityapp.s3.us-east-1.amazonaws.com/istockphoto-1369478616-640_adpp_is.mp4' }}
                // useNativeControls
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted
            />






        </>




    );
}


