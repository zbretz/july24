import { Text, TouchableHighlight, TouchableOpacity, View, Image, Dimensions, Modal, Animated, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo, Feather } from '@expo/vector-icons';
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
    const [logoVisible, setLogoVisibile] = useState(false)

    let boxDimensions = (windowWidth - 30) / 2

    const handleScroll = (e) => {
        const positionY = e.nativeEvent.contentOffset.y;
        console.log('positionY: ', positionY)
        if (!logoVisible && (positionY > windowWidth * .5 + 50)) {
            animateLogo('show')
        } else if (logoVisible && (positionY < windowWidth * .5 + 50)) {
            animateLogo('hide')
        }
    }

    const [translateLogo, setTranslatedLogo] = useState(new Animated.Value(-50))
    const animateLogo = (direction) => {
        setLogoVisibile(direction == 'show' ? true : false)

        Animated.timing(translateLogo, {
            duration: 700,
            toValue: direction == 'show' ? 20 : -60,
            useNativeDriver: false,
        })
            .start(({ finished }) => {
            })
    }

    const [showRideIndicator, setShowRideIndicator] = useState(false)
    const [translateRideIndicator, setTranslatedRideIndicator] = useState(new Animated.Value(-190))
    const animateRideIndicator = (direction) => {
        Animated.timing(translateRideIndicator, {
            duration: 700,
            toValue: 0,
            useNativeDriver: false,
        })
            .start(({ finished }) => {
            })
    }

    const upcomingRide = masterState.user?.activeRides?.length ? masterState.user.activeRides[0] : null
    useEffect(() => {
        upcomingRide && setTimeout(animateRideIndicator, 3300)
    }, [masterState])

    return (

        <View>

            {upcomingRide &&
                <Animated.View style={{ position: 'absolute', top: 0, zIndex: 100, left: translateRideIndicator, }}>
                    {/* <SafeAreaView> */}
                    <TouchableHighlight activeOpacity={.8} underlayColor={'rgba(254, 180, 195, 0.9)'} onPress={() => { navigation.navigate('ScheduleRide', { screen: 'RideDetail', params: { rideId: upcomingRide._id } }) }}
                        style={{
                            flexDirection: 'row', justifyContent: 'space-between',
                            // width: windowWidth * .5 ,
                            // position: 'absolute', bottom: 0, left: -10,
                            margin: 0,
                            backgroundColor: '#fff5f7',//'#fff1cc'
                            borderColor: '#ff99ad',//#ffcf56
                            borderBottomWidth: 8,
                            borderTopRightRadius: 20, borderBottomRightRadius: 20,
                            alignSelf: 'flex-start',
                            // borderWidth:1,
                            padding: 20,
                            shadowColor: '#000',
                            shadowOpacity: 0.48,
                            shadowRadius: 8,
                            shadowOffset: {
                                width: 0,
                                height: 0,
                            },
                        }}
                    >
                        <View>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 0, textAlign: 'left', }}>Upcoming</Text>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 0, textAlign: 'left', }}>Ride</Text>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start', }}>
                                <Text style={{ fontFamily: 'LexendLight', fontSize: 14, marginBottom: 0, paddingHorizontal: 0, textAlign: 'left', marginRight: 4 }}>View</Text>
                                <Feather style={{ marginBottom: 0 }} name="arrow-right-circle" size={16} color="black" />
                            </View>
                        </View>
                    </TouchableHighlight>
                    {/* </SafeAreaView> */}
                </Animated.View>
            }


            <Animated.View style={{ position: 'absolute', top: translateLogo, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}  >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </Animated.View>


            <ScrollView style={{ backgroundColor: 'white', paddingTop: 10 }} showsVerticalScrollIndicator={false} onScroll={(e) => handleScroll(e)}>

                <SafeAreaView >


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
                            <View style={{ backgroundColor: '#ffcf56', width: windowWidth * .5, height: windowWidth * .5, borderRadius: 30, marginRight: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                                <View>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .14, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                        adjustsFontSizeToFit={true}
                                        numberOfLines={1}
                                    >The</Text>

                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .21, marginVertical: -19, }}
                                        adjustsFontSizeToFit={true}
                                        numberOfLines={1}
                                    >
                                        Park</Text>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .11, marginVertical: windowHeight < 800 ? -4 : -4, }}
                                        adjustsFontSizeToFit={true}
                                        numberOfLines={1}

                                    >
                                        City App</Text>
                                </View>






                            </View>


                            <View style={{}}>
                                <View style={{ flex: 1, width: windowWidth * .5 - 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: windowWidth * .081, marginBottom: 0, fontFamily: 'LexendMedium', textAlign: 'left' }}>Welcome</Text>
                                    <Text style={{ fontSize: windowWidth * .055, marginBottom: 0, fontFamily: 'LexendRegular' }}>We're stoked you're here.</Text>
                                    {/* <Text style={{ fontSize: 21, marginBottom: 0, fontFamily: 'LexendRegular' }}>We're glad you made it.</Text> */}
                                </View>
                            </View>
                        </View>



                        {/* <View
                    style={{
                        width: windowWidth / 2,
                        height: windowHeight * .1,
                        position: 'absolute', zIndex: 10,
                        backgroundColor: 'rgba(0,0,0,.4)',
                        // padding: 20, paddingHorizontal: 0,

                    }}
                >

                </View> */}




                        <Text style={{ fontSize: 20, marginVertical: 10, fontWeight: 500, marginLeft: 10, fontFamily: 'LexendRegular' }}>Quick Menu</Text>





                        <View style={{ marginHorizontal: 10, padding: 0, borderRadius: 30 }}>


                            <View showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                                <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                    <Image style={{ flex: 1, width: '80%', margin: -28 }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Schedule</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                    <Image style={{ flex: 1, width: '90%', margin: -28 }} resizeMode='contain' source={require('../assets/car-location.png')} />
                                    <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Ride Now</Text>
                                </TouchableOpacity>


                            </View>

                            <View showsHorizontalScrollIndicator={false} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                                <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                    <Image style={{ flex: 1, width: '65%', margin: -28 }} resizeMode='contain' source={require('../assets/stroller.png')} />
                                    <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Childcare</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('Locals')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                                    <Image style={{ flex: 1, width: '70%', margin: -28 }} resizeMode='contain' source={require('../assets/coffee.png')} />
                                    <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Order</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>

                        {/* <View style={{ marginHorizontal: 10, backgroundColor: null, marginTop: 20 }}>
                            <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: 500, textAlign: 'center', fontFamily: 'LexendRegular' }}>Feature Spotlight</Text>

                            <Text style={{ fontSize: 20, marginBottom: 8, fontWeight: 500, fontFamily: 'LexendRegular' }}>Reserve a driver</Text>

                            <View style={{ flexDirection: 'row', }}>




                                <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f1f1f1', flex: 2, height: windowHeight * .22, borderRadius: 30, alignItems: 'center', paddingVertical: 0 }}>


                                    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,.1)', 'rgba(0,0,0,.9)']} style={{ height: '100%', width: '100%', position: 'absolute', borderRadius: 30 }} />


                                    <Video
                                        style={{ height: '100%', width: '100%', zIndex: -1, borderRadius: 30, }} // opacity: .27, 
                                        source={require('../assets/car_vid.mov')}
                                        resizeMode={Platform.OS === 'ios' ? ResizeMode.COVER : "stretch"}
                                        isLooping
                                        shouldPlay
                                        isMuted
                                        rate={0.9}
                                    />

                                    <View style={{ position: 'absolute', bottom: 10, right: 20, padding: 8, borderRadius: 10, }}>
                                        <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'LexendMedium' }}>Reserve Driver</Text>
                                    </View>


                                </TouchableOpacity>
                            </View>
                        </View>



                        <LinearGradient colors={['rgba(230,230,230,.0)', 'rgba(230,230,230,.0)', 'rgba(230,230,230,.0)']} style={{ flexDirection: 'row', marginVertical: 0, padding: 10 }}>
                            <View style={{ backgroundColor: '#fff', width: '100%', padding: 10, borderRadius: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 20, marginBottom: 0, fontFamily: 'LexendRegular' }}>Book by the <Text style={{ textDecorationLine: 'underline' }}>hour</Text></Text>
                                </View>
                                <Text style={{ fontSize: 18, marginBottom: 0, fontFamily: 'LexendLight' }}>Tours around town</Text>
                                <Text style={{ fontSize: 18, marginBottom: 0, fontFamily: 'LexendLight' }}>Trips to other resorts</Text>
                            </View>
                        </LinearGradient> */}



                        <View style={{ margin: 10, marginVertical: 20 }}>
                            <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500, textAlign: 'center', fontFamily: 'LexendRegular' }}>Feature Spotlight</Text>


                            <View style={{ flexDirection: 'row', backgroundColor: '#ecf6f8', borderRadius: 30 }}>

                                <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ flex: 3, height: windowHeight * .22, borderRadius: 30, justifyContent: 'center' }}>
                                    <View style={{ padding: 10, borderRadius: 10, }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'LexendRegular' }}>Connect with local babysitters</Text>
                                        <Text style={{ fontSize: 14, marginTop: 4, fontFamily: 'LexendLight' }}>Safe, simple, and reliable.</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f1f1f1', flex: 3, height: windowHeight * .22, borderRadius: 30, marginLeft: 10, alignItems: 'center', justifyContent: 'center' }}>

                                    <Video
                                        style={{ borderRadius: 20, height: windowHeight * .2 - 20, width: windowHeight * .2 - 20, }} // opacity: .27, 
                                        source={require('../assets/cover_tall.mp4')}
                                        resizeMode={Platform.OS === 'ios' ? ResizeMode.COVER : "stretch"}
                                        isLooping
                                        shouldPlay
                                        isMuted
                                        rate={0.9}
                                    />

                                </TouchableOpacity>
                            </View>

                        </View>


                        <View style={{ margin: 10, marginTop: 0 }}>

                            <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: 500, textAlign: 'center', fontFamily: 'LexendRegular' }}>What's New</Text>


                            <View style={{ flexDirection: 'row', backgroundColor: '#FDF2E1', borderRadius: 30 }}>

                                <View onPress={() => null} style={{ backgroundColor: '#f1f1f1', flex: 3, padding: 0, borderRadius: 30, marginRight: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image style={{ borderRadius: 20, height: windowHeight * .2 - 20, width: windowHeight * .2 - 20, }} resizeMode='cover' source={require('../assets/call-point.png')} />
                                </View>

                                <View onPress={() => null} style={{ flex: 3, height: windowHeight * .22, borderRadius: 30, marginRight: 10, justifyContent: 'center' }}>
                                    <View style={{ padding: 10, borderRadius: 10, }}>
                                        <Text style={{ fontSize: 18, fontFamily: 'LexendRegular' }}>Phone Calls</Text>
                                        <Text style={{ fontSize: 14, marginTop: 4, fontFamily: 'LexendLight' }}>Make and receive calls from your driver in the hour before pickup.</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4, }}>
                                            <Entypo style={{ top: 6 }} name="dot-single" size={24} color="black" />
                                            <Text style={{ fontSize: 14, fontFamily: 'LexendLight' }}>Phone numbers are 'masked' to preserve privacy.</Text>
                                        </View>
                                    </View>
                                </View>

                            </View>

                        </View>

                    </View>
                    <View style={{ height: 100 }} />
                </SafeAreaView >
            </ScrollView>
        </View >

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