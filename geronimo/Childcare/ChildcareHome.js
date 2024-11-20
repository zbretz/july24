import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { Image } from 'expo-image'; //https://github.com/echowaves/expo-cached-image
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Octicons } from '@expo/vector-icons';
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

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} pagingEnabled={!true} style={{}}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, marginTop: 20, flexDirection: 'row', position: 'absolute', zIndex: 1 }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="#fff" />
                    <View>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, color: '#fff' }}>Childcare</Text>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, color: '#fff' }}>in Park City</Text>
                    </View>
                </TouchableOpacity>


                <View style={{ zIndex: 9, right: 10, width: windowWidth * .16, position: 'absolute', alignSelf: 'flex-end', backgroundColor: 'rgba(0,0,0,0)', borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginTop: 50, padding: 0, }}>
                    <TouchableOpacity onPress={() => navigation.navigate('SitterList')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 13, color: '#fff', textAlign: 'center', }}>Meet Us </Text>
                        <AntDesign name="caretright" size={9} color="#fff" />
                    </TouchableOpacity>
                    <View style={{}}>
                        {Object.values(providers).slice(0, 3).map((sitter, idx) => {
                            return (

                                <TouchableOpacity onPress={() => navigation.navigate('SitterList')} key={idx} style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 3 }} name="arrow-back-ios" size={24} color="black" >
                                    <Image
                                        // onLoadEnd={() => Image.getCachePathAsync(sitter.cover_photo).then(uri => console.log(uri))}
                                        cachePolicy='disk' style={{ width: windowWidth * .16, height: windowWidth * .16, borderRadius: 40, }} source={{ uri: sitter.cover_photo }} />
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>


                <View style={{ height: windowHeight * .5, justifyContent: 'center' }} />

                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,.90)', 'rgba(255,255,255,1)']} style={{ borderWidth: 0, padding: 30, paddingBottom: 20, zIndex: 10, }}>

                    <View style={{ marginTop: 90, marginBottom: -10 }} >

                        <Text style={{ fontSize: 30, color: '#000', fontWeight: 400 }}>Book with confidence.</Text>

                        <Text style={{ fontSize: 18, color: '#000' }}>Whether it's parent's night out, or you need support for a day on the slopes, our sitters have you covered.</Text>


                        <View style={{ width: '88%', alignSelf: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 1 }}>
                                <Octicons name="check-circle" size={16} color="green" />
                                <Text style={{ marginHorizontal: 6, fontSize: 16, color: '#000' }}>Background and reference checked</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 1 }}>
                                <Octicons name="check-circle" size={16} color="green" />
                                <Text style={{ marginLeft: 6, fontSize: 16, color: '#000' }}>Deep childcare experience</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 1 }}>
                                <Octicons name="check-circle" size={16} color="green" />
                                <Text style={{ marginLeft: 6, fontSize: 16, color: '#000' }}>Childcare for all ages: infants to teens</Text>
                            </View>
                        </View>
                    </View>


                </LinearGradient>


                <View style={{ backgroundColor: '#fff' }}>
                    <EasyBook masterState={masterState} navigation={navigation} setMasterState={setMasterState} />
                </View>

    
                <View style={{ alignItems: 'center', paddingBottom: 30, borderWidth: 0, backgroundColor: '#fff' }}>
                    <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Pricing</Text>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginHorizontal: 20 }}><Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$25</Text>/hour when booking through the Easy Book form above. Sitters have individual rates when they are requested specifically. Additional children add <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$5</Text>. </Text>

                </View>

                <View style={{ backgroundColor: '#fff', marginTop: -20 }}>
                    <Faq navigation={navigation} />
                </View>


            </ScrollView>

            <Video
                ref={video}
                style={{ height: windowHeight, width: windowWidth, position: 'absolute', zIndex: -1 }}
                source={require('../assets/cover_tall.mp4')}
                resizeMode={Platform.OS === 'ios' ? ResizeMode.COVER : "stretch"}
                isLooping
                shouldPlay
                isMuted
            />


        </>




    );
}


