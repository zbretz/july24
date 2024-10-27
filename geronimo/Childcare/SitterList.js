import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, Linking, Platform, LayoutAnimation } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import LottieView from 'lottie-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default SitterList = ({ isConnected, masterState, setMasterState, navigation, basket, setBasket, partner, setPartner }) => {

    if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const video = useRef(null);
    const [showBookingOptions, setShowBookingOptions] = useState(false)

    const bookingDetails = {
        childrenAges: [1, 5, 8],
        dateTime: 'Dec 21 8am-1pm',
        sitter: 'Natalia',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
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








            <View style={{ marginHorizontal: 20, marginVertical: 20, borderRadius: 20, borderWidth: 0 }}>
                <View style={{}}>
                    <Text style={{ fontSize: 30 }}>Meet The Team</Text>
                </View>
            </View>



            <TouchableOpacity onPress={() => navigation.navigate('SitterPage', { name: 'Natalia' })} style={{ marginHorizontal: 20, flexDirection: 'row' }}>

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
                <View style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, marginRight: 0, borderRadius: 14, flex: 1, }}>
                    <Text style={{ color: '#000', fontSize: 22, fontWeight: 500 }}>Natalia</Text>
                    <Text style={{ color: '#000', fontSize: 19, fontWeight: 400 }}  >Hi Katie, I' Natalia. I'm looking forward to spending a few hours with your kids this Saturday.</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SitterPage', { name: 'Natalia1' })} style={{ marginHorizontal: 20, marginVertical: 30, flexDirection: 'row' }}>

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
                <View style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, marginRight: 0, borderRadius: 14, flex: 1, }}>
                    <Text style={{ color: '#000', fontSize: 22, fontWeight: 500 }}>Natalia</Text>
                    <Text style={{ color: '#000', fontSize: 19, fontWeight: 400 }}  >Hi Katie, I' Natalia. I'm looking forward to spending a few hours with your kids this Saturday.</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('SitterPage', { name: 'Natalia1' })} style={{ marginHorizontal: 20, flexDirection: 'row' }}>

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
                <View style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, marginRight: 0, borderRadius: 14, flex: 1, }}>
                    <Text style={{ color: '#000', fontSize: 22, fontWeight: 500 }}>Natalia</Text>
                    <Text style={{ color: '#000', fontSize: 19, fontWeight: 400 }}  >Hi Katie, I' Natalia. I'm looking forward to spending a few hours with your kids this Saturday.</Text>
                </View>
            </TouchableOpacity>







        </ScrollView>






    );
}

