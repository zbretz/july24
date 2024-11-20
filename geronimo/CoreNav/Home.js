import { Text, TouchableOpacity, View, Image, Dimensions, Modal, Animated, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';


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

    return (

        <SafeAreaView style={{ backgroundColor: 'white' }}>

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

                {/* <View style={{ backgroundColor: '#FFCF56', margin: 20, borderRadius: 40, padding: 30, alignItems: 'center', width:windowWidth*.4, height:windowWidth*.4 }}>

                    {
                        masterState.user?.user_type === 'driver' &&
                        <>
                            <View style={{ zIndex: 6, backgroundColor: 'transparent', height: windowWidth * .2, width: windowWidth * .2, position: 'absolute', top: 0, right: 0, borderBottomLeftRadius: 30, borderLeftWidth: windowWidth * .1, borderLeftColor: '#f4bb29', borderBottomWidth: windowWidth * .1, borderBottomColor: '#f4bb29', borderRightWidth: windowWidth * .1, borderTopWidth: windowWidth * .1, borderColor: 'transparent' }} />
                            <Entypo style={{ zIndex: 5, position: 'absolute', right: windowWidth * .02, top: windowWidth * .02 }} name="wallet" size={44} color="black" />
                            <View style={{ zIndex: 4, backgroundColor: '#f4bb29', height: windowWidth * .2, width: windowWidth * .2, position: 'absolute', top: 0, right: 0, borderBottomLeftRadius: 30, borderRightWidth: windowWidth * .1, borderRightColor: 'white', borderTopWidth: windowWidth * .1, borderTopColor: 'white', borderLeftWidth: windowWidth * .1, borderBottomWidth: windowWidth * .1, borderColor: 'transparent' }} />
                        </>
                    }

                    <View style={{}}>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .06, marginVertical: windowHeight < 800 ? 0 : 0, }}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        >The</Text>

                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: 0, }}
                            // adjustsFontSizeToFit={true}
                            numberOfLines={1}
                        >
                            Park</Text>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: windowHeight < 800 ? -10 : -10, }}
                            adjustsFontSizeToFit={true}
                            numberOfLines={1}

                        >
                            City App</Text>
                    </View>
                </View> */}



                {/* <View style={{ flexDirection: 'row' }}>
                    <View style={{ backgroundColor: '#FFCF56', margin: 20, borderRadius: 40, padding: 30, alignItems: 'center', width: windowWidth * .3, height: windowWidth * .3 }}>




                        <View style={{}}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .06, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >The</Text>

                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: 0, }}
                                // adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Park</Text>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: windowHeight < 800 ? -10 : -10, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}

                            >
                                City App</Text>
                        </View>
                    </View>


                    <View style={{ backgroundColor: '#e6e6e6', margin: 20, borderRadius: 40, padding: 30, alignItems: 'center', width: windowWidth * .48, height: windowWidth * .48 }}>



                        <View style={{}}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .06, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >The</Text>

                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: 0, }}
                                // adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Park</Text>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: windowHeight < 800 ? -10 : -10, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}

                            >
                                City App</Text>
                        </View>
                    </View>


                </View> */}


                {/* <View style={{ flexDirection: 'row', marginHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#ffcf56', flex: 2, height: windowHeight * .11, borderRadius: 30, marginRight: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                        <View>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >The</Text>

                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .09, marginVertical: -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Park</Text>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? -4 : -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}

                            >
                                City App</Text>
                        </View>
                    </TouchableOpacity>


                    <View style={{ flex: 5, }}>
                        <View>
                            <Text style={{ fontSize: 30, marginBottom:10, }}>Welcome.</Text>
                        </View>

                        

                        <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f1f1f1', height: windowHeight * .22 + 40, borderRadius: 30, alignItems: 'center', paddingVertical: 20 }}>
                            <View style={{}}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >Get a car</Text>


                            </View>
                        </TouchableOpacity>
                    </View>
                </View> */}


                <View style={{ flexDirection: 'row', marginHorizontal: 10, marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#ffcf56', flex: 2, height: windowHeight * .11, borderRadius: 30, marginRight: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                        <View>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >The</Text>

                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .09, marginVertical: -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Park</Text>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? -4 : -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}

                            >
                                City App</Text>
                        </View>
                    </TouchableOpacity>


                    <View style={{ flex: 5, }}>
                        <View>
                            <Text style={{ fontSize: 30, marginBottom: 0, }}>Welcome.</Text>
                            {/* <Text style={{ fontSize: 18, marginBottom: 0, }}>llkmsdflkmsfd sldkmlksmdf lskdlksdf</Text> */}
                            <Text style={{ fontSize: 18, marginBottom: 0, }}>We're stoked you're here.</Text>
                            <Text style={{ fontSize: 18, marginBottom: 0, }}>For locals. For visitors.</Text>

                        </View>
                    </View>
                </View>


                {/* <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#5a5a5a', borderRadius:20, padding:10  }}>
                    <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#ffcf56', flex: 2, height: windowHeight * .11, borderRadius: 30, marginRight: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                        <View>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >The</Text>

                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .09, marginVertical: -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Park</Text>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? -4 : -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}

                            >
                                City App</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={{ flex: 5, }}>
                        <View>
                            <Text style={{ fontSize: 30, marginBottom: 0, color: '#fff' }}>Welcome.</Text>
                            <Text style={{ fontSize: 18, marginBottom: 0, color: '#fff' }}>We're stoked you're here.</Text>
                            <Text style={{ fontSize: 18, marginBottom: 0, color: '#fff' }}>For locals. For visitors.</Text>

                        </View>
                    </View>
                </View> */}


                {/* <View style={{ flexDirection: 'row', margin: 20 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#ffcf56', flex: 2, height: windowHeight * .11, borderRadius: 30, marginRight: 20, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 }}>
                        <View>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >The</Text>

                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .09, marginVertical: -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}
                            >
                                Park</Text>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .05, marginVertical: windowHeight < 800 ? -4 : -4, }}
                                adjustsFontSizeToFit={true}
                                numberOfLines={1}

                            >
                                City App</Text>
                        </View>
                    </TouchableOpacity>


                    <View style={{ flex: 5, }}>
                        <View>
                            <Text style={{ fontSize: 30, marginBottom:10 }}>Welcome!</Text>
                        </View>

                        <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#e6e6e6', height: windowHeight * .22 + 40, borderRadius: 30, alignItems: 'center', paddingVertical: 20 }}>
                            <View style={{}}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: windowWidth * .1, marginVertical: windowHeight < 800 ? 0 : 0, }}
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                >Get a car</Text>


                            </View>
                        </TouchableOpacity>
                    </View>
                </View> */}


                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,.01)', 'rgba(0,0,0,.05)']} style={{ height: '50%', width: '100%', borderRadius: 0 }}>

                    <View style={{ marginHorizontal: 10, backgroundColor: null }}>
                        <Text style={{ fontSize: 20, marginBottom: 8, fontWeight: 500 }}>Catch a ride</Text>

                        <View style={{ flexDirection: 'row', }}>


                            <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f1f1f1', flex: 1, height: windowHeight * .22, borderRadius: 30, marginRight: 10, alignItems: 'center', paddingVertical: 20 }}>
                                <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/car-location.png')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Go Now</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f1f1f1', flex: 2, height: windowHeight * .22, borderRadius: 30, alignItems: 'center', paddingVertical: 0 }}>
                                {masterState.user?.activeRides?.length ?
                                    <Image style={{ width: '24%', height: '24%', position: 'absolute', bottom: 20, right: 10, zIndex: 10 }} resizeMode='contain' source={require('../assets/verified.png')} />
                                    :
                                    null
                                }

                                <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(0,0,0,.1)', 'rgba(0,0,0,.5)']} style={{ height: '100%', width: '100%', position: 'absolute', borderRadius: 30 }} />


                                <Video
                                    style={{ height: '100%', width: '100%', zIndex: -1, borderRadius: 30, }} // opacity: .27, 
                                    source={require('../assets/car_vid.mov')}
                                    resizeMode={Platform.OS === 'ios' ? ResizeMode.COVER : "stretch"}
                                    isLooping
                                    shouldPlay
                                    isMuted
                                    rate={0.9}
                                />

                                <View style={{ position: 'absolute', bottom: 20, padding: 8, borderRadius: 10, }}>
                                    <Text style={{ fontSize: 20, color: '#fff' }}>Schedule Ride</Text>
                                </View>
                                {/* <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Schedule</Text>
                            </View> */}

                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={{ flexDirection: 'row', margin: 10 }}>


                        <View style={{ flex: 5, }}>
                            <View>
                                <Text style={{ fontSize: 20, marginBottom: 0, }}>New Features.</Text>
                                {/* <Text style={{ fontSize: 18, marginBottom: 0, }}>llkmsdflkmsfd sldkmlksmdf lskdlksdf</Text> */}
                                <Text style={{ fontSize: 18, marginBottom: 0, }}>Preferred drivers.</Text>
                                <Text style={{ fontSize: 18, marginBottom: 0, }}>Driver pages.</Text>

                            </View>
                        </View>
                    </View>



                </LinearGradient>





                <View style={{ margin: 20, }}>


                    {/* <Text style={{ fontSize: 18, marginBottom: 8, fontWeight: 500 }}>Local services</Text> */}

                    <View style={{ flexDirection: 'row', }}>

                        <TouchableOpacity onPress={() => navigation.navigate('Locals')} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .22, borderRadius: 30, marginRight: 10, alignItems: 'center', paddingVertical: 20 }}>
                            <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/coffee.png')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Order</Text>
                            </View>
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => setModalVisible(true)} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .22, borderRadius: 30, marginLeft: 10, alignItems: 'center', paddingVertical: 20, }}>
                        <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/cleaning.png')} />
                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Coming ...</Text>
                        </View>
                    </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .22, borderRadius: 30, marginLeft: 10, alignItems: 'center', paddingVertical: 20, }}>
                            <Image style={{ flex: 1, width: '100%', margin: 8 }} resizeMode='contain' source={require('../assets/stroller.png')} />
                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Childcare</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>


            </View>

            {/* 
                <View style={{position:'absolute', bottom:0, zIndex:100, width:'100%',}}>
                        {masterState.user.activeRide ?
                            // <ActiveRide />
                            <View style={{width:'100%', backgroundColor:'blue', height:150}}></View>
                            :
                            <View style={{width:'100%', backgroundColor:'blue', height:150}}></View>
                        }
                    </View>
                 */}


        </SafeAreaView >
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