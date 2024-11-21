import { Text, TouchableOpacity, View, Image, Dimensions, Modal, Animated, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Stack = createStackNavigator();

export default Home = ({ isConnected, masterState, setMasterState, chatLog, setChatLog, navigation }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Menu">
                {props => <Menu {...props} masterState={masterState} isConnected={isConnected} />}
            </Stack.Screen>

        </Stack.Navigator>
    );
}

const Menu = ({ isConnected, masterState, navigation, }) => {

    const rref = useRef()

    const [modalVisible, setModalVisible] = useState(false)

    let boxDimensions = (windowWidth - 30) / 2

    return (
        <ScrollView style={{ backgroundColor: 'white', paddingTop: 10 }} showsVerticalScrollIndicator={false}>

            <View >

                {/* {masterState.user?.localRide &&
                    // <View style={{ height: 100, margin: 20, backgroundColor: 'black', borderRadius: 20 }}></View>
                    <FlashingView />
                } */}

                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={modalVisible}
                    style={{ height: windowHeight, width: windowWidth, }}>

                    <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,0.18)', }}>

                        <TouchableOpacity onPress={() => { console.log('close modal'); setModalVisible(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                        <View style={{ backgroundColor: '#f2f2f2', top: windowHeight * .6, height: windowHeight * .4, alignSelf: 'center', borderRadius: 20, padding: 20, justifyContent: 'center', width: windowWidth }}>
                            <View style={{ backgroundColor: '#e6e6e6', borderRadius: 20, padding: 20, alignItems: 'center', justifyContent: 'center', }}>
                                <View style={{ borderRadius: 30, }}>
                                    <View style={{ flex: 1 }}>
                                        <Image style={{ height: 90, width: 90, alignSelf: 'center' }} source={require('../assets/app-development.png')} />
                                        <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 10 }}>Housekeeping and other vetted local providers.</Text>
                                        <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 0 }}>Coming Soon!</Text>
                                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#00a1ff', borderRadius: 30 }}>
                                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -6 }}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>

                        </View>

                    </View>
                </Modal>


                <View style={{ borderRadius: 0, margin: 0, backgroundColor: '#fff', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#fff', position: 'absolute', top: 20, right: 20 }}>
                        <View style={{ height: 9, width: 9, borderRadius: 30, backgroundColor: isConnected ? '#85ba78' : 'red' }}></View>
                    </View>







                    <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#ffcf56', width: windowWidth * .5, height: windowWidth * .5, borderRadius: 30, marginRight: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                            <View>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .15, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >The</Text>

                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .22, marginVertical: -19, }}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >
                                    Park</Text>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .12, marginVertical: windowHeight < 800 ? -4 : -4, }}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}

                                >
                                    City App</Text>
                            </View>
                        </TouchableOpacity>


                        <View style={{}}>
                            <View style={{ flex: 1, width: windowWidth * .5 - 50, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 30, marginBottom: 0, fontFamily: 'LexendMedium', }}>Welcome.</Text>
                                {/* <Text style={{ fontSize: 18, marginBottom: 0, }}>llkmsdflkmsfd sldkmlksmdf lskdlksdf</Text> */}
                                <Text style={{ fontSize: 21, marginBottom: 0, fontFamily: 'LexendRegular' }}>We're stoked you're here.</Text>
                                {/* <Text style={{ fontSize: 18, marginBottom: 0, fontFamily: 'LexendRegular' }}>For locals. For visitors.</Text> */}

                            </View>
                        </View>
                    </View>




                    <Text style={{ fontSize: 20, marginVertical: 10, fontWeight: 500, marginLeft: 10, fontFamily: 'LexendRegular' }}>Quick Menu</Text>




                    <View style={{ marginHorizontal: 10, padding: 0, borderRadius: 30 }}>


                        <View showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                <Image style={{ flex: 1, width: '80%', margin: -28 }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                                <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 6 }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8, paddingHorizontal: 8 }}>Schedule</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                <Image style={{ flex: 1, width: '90%', margin: -28 }} resizeMode='contain' source={require('../assets/car-location.png')} />
                                <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 6 }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8, paddingHorizontal: 8 }}>Go Now</Text>
                                </View>
                            </TouchableOpacity>


                        </View>

                        <View showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>


                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                <Image style={{ flex: 1, width: '80%', margin: -28 }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                                <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 6 }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8, paddingHorizontal: 8 }}>Schedule</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                <Image style={{ flex: 1, width: '90%', margin: -28 }} resizeMode='contain' source={require('../assets/car-location.png')} />
                                <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 6 }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8, paddingHorizontal: 8 }}>Go Now</Text>
                                </View>
                            </TouchableOpacity>


                        </View>

                    </View>

                    <View style={{ marginHorizontal: 10, backgroundColor: null, marginTop: 20 }}>
                        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500, textAlign: 'center', fontFamily: 'LexendRegular' }}>Feature Spotlight</Text>

                        <Text style={{ fontSize: 20, marginBottom: 8, fontWeight: 500, fontFamily: 'LexendRegular' }}>Reserve a driver</Text>

                        <View style={{ flexDirection: 'row', }}>




                            <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f1f1f1', flex: 2, height: windowHeight * .22, borderRadius: 30, alignItems: 'center', paddingVertical: 0 }}>
                                {/* {masterState.user?.activeRides?.length ?
                                    <Image style={{ width: '24%', height: '24%', position: 'absolute', bottom: 20, right: 10, zIndex: 10 }} resizeMode='contain' source={require('../assets/verified.png')} />
                                    :
                                    null
                                } */}

                                <LinearGradient colors={['rgba(230,230,230,.15)', 'rgba(230,230,230,.3)', 'rgba(230,230,230,.8)']} style={{ height: '100%', width: '100%', position: 'absolute', borderRadius: 30 }} />


                                <Video
                                    style={{ height: '100%', width: '100%', zIndex: -1, borderRadius: 30, }} // opacity: .27, 
                                    source={require('../assets/car_vid.mov')}
                                    resizeMode={Platform.OS === 'ios' ? ResizeMode.COVER : "stretch"}
                                    isLooping
                                    shouldPlay
                                    isMuted
                                    rate={0.9}
                                />

                                <View style={{ position: 'absolute', bottom: 20, right: 20, padding: 8, borderRadius: 10, }}>
                                    <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'LexendMedium' }}>Reserve Driver</Text>
                                </View>


                            </TouchableOpacity>
                        </View>
                    </View>



                    <LinearGradient colors={['rgba(230,230,230,.0)', 'rgba(230,230,230,.0)', 'rgba(230,230,230,.0)']} style={{ flexDirection: 'row', marginVertical: 0, padding: 10 }}>
                        <View style={{ backgroundColor: '#fff', width: '100%', padding: 10, borderRadius: 20 }}>
                            <Text style={{ fontSize: 20, marginBottom: 0, fontFamily: 'LexendRegular' }}>Book by the hour</Text>
                            <Text style={{ fontSize: 18, marginBottom: 0, fontFamily: 'LexendLight' }}>Tours around town</Text>
                            <Text style={{ fontSize: 18, marginBottom: 0, fontFamily: 'LexendLight' }}>Trips to other resorts</Text>
                            {/* <Text style={{ fontSize: 18, marginBottom: 0, fontFamily: 'LexendLight'}}>Errands</Text> */}

                        </View>
                    </LinearGradient>



                    <View style={{ margin: 10, marginVertical: 20 }}>
                        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500, textAlign: 'center', fontFamily: 'LexendRegular' }}>What's New</Text>

                        <View style={{ flexDirection: 'row', }}>


                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#fff', flex: 3, height: windowHeight * .22, borderRadius: 30, marginRight: 10, justifyContent: 'center' }}>
                                <View style={{ backgroundColor: '#fff', padding: 10, borderRadius: 10, }}>
                                    <Text style={{ fontSize: 18, fontFamily: 'LexendRegular' }}>Connect with local babysitters.</Text>
                                    <Text style={{ fontSize: 14, marginTop: 4, fontFamily: 'LexendLight' }}>Safe, simple, and reliable.</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f1f1f1', flex: 3, height: windowHeight * .22, borderRadius: 30, marginRight: 10, alignItems: 'center', paddingVertical: 20 }}>
                                <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/stroller.png')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Childcare</Text>
                                </View>
                            </TouchableOpacity>
                        </View>


                    </View>

                    {/* <View style={{ margin: 10, }}>
                        <Text style={{ fontSize: 24, marginBottom: 8, fontWeight: 500, textAlign: 'center' }}>What's New</Text>
                        <View style={{}}>
                            <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ borderRadius: 30, marginRight: 0, paddingVertical: 0, borderWidth: 6, borderColor: '#e6e6e6' }}>
                                <LinearGradient colors={['rgba(242,242,242,.0)', 'rgba(242,242,242,0)', 'rgba(242,242,242,0)', 'rgba(242,242,242,.1)', 'rgba(242,242,242,.99)']} style={{ height: 300, zIndex: 9, borderRadius: 20 }} />
                                <Image style={{ height: 300, width: '100%', position: 'absolute', zIndex: -1, borderRadius: 20, }} resizeMode='contain' source={require('../assets/babysittercover.jpeg')} />
                            </TouchableOpacity>
                        </View>
                    </View> */}


                    <View style={{ margin: 10, }}>
                        <Text style={{ fontSize: 24, marginVertical: 8, fontWeight: 500, textAlign: 'center' }}>Coming Soon</Text>
                        <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 500, fontFamily: 'LexendRegular' }}>Ski Services</Text>

                        <LinearGradient colors={['rgba(230,230,230,.15)', 'rgba(230,230,230,.3)', 'rgba(230,230,230,.8)']} style={{ height: '100%', width: '100%', position: 'absolute', borderRadius: 30, zIndex: 2 }} />


                        <View style={{}}>
                            <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ borderRadius: 30, marginRight: 0, paddingVertical: 0, borderWidth: 6, borderColor: '#e6e6e6' }}>
                                <Video style={{ height: 210, width: '100%', borderRadius: 20, backgroundColor: 'green' }} shouldPlay resizeMode='contain' source={require('../assets/tuning_cover.mov')} />
                            </TouchableOpacity>
                            <View style={{ position: 'absolute', bottom: 20, right: 20, padding: 8, borderRadius: 10, zIndex: 3 }}>
                                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendMedium' }}>Emergenskis Mobile Tuning</Text>
                            </View>

                            <Image style={{ height: 90, width: 90, alignSelf: 'center', position: 'absolute', top: 20, left: 20, zIndex: 3 }} source={require('../assets/emergenskis.webp')} />


                        </View>
                    </View>



                </View>

                <View style={{ height: 100 }} />

            </View >
        </ScrollView>

    );
}




const FlashingView = () => {

    console.log('jasdvcjkbhsdcjkb')
    const [animatedFlash, setAnimatedFlash] = useState(new Animated.Value(0));

    // let animatedFlash =  new Animated.Value(0)

    const animate = (selection) => {

        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedFlash, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true
                }),
                Animated.timing(animatedFlash, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true
                })

            ])

        ).start()

    }



    useEffect(() => {
        animate()
    }, [])


    return (
        <View style={{ padding: 0, position: 'relative', width: '100%', marginTop: 20 }}>
            <Animated.View style={{ marginHorizontal: 20, height: 100, backgroundColor: '#668cff', borderRadius: 20, opacity: animatedFlash }}>
            </Animated.View>
            <View style={{ height: 96, backgroundColor: '#99b3ff', position: 'relative', top: -98, zIndex: 99, borderRadius: 18, marginBottom: -100, padding: 10, marginHorizontal: 22 }}>
                <Text style={{ fontSize: 16 }}>Local Ride in progress</Text>
            </View>

        </View>

    )


}