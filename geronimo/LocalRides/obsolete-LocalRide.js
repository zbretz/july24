import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { DonutChart } from "react-native-circular-chart";
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default LocalRide = ({ isConnected, masterState }) => {

    // const [pickuptime, setPickupTime] = useState(new Date().toLocaleString())
    const [pickuptime, setPickupTime] = useState(new Date())
    const [displayDonut, setDisplayDonut] = useState(false)
    const [localStepTwo, setLocalStepTwo] = useState(false)



    // useEffect(() => {
    //     const pickupTimer = setInterval(() => {
    //         // setPickupTime(new Date().toLocaleString())
    //         setPickupTime(new Date())
    //     }, 20000)

    //     return () => clearInterval(pickupTimer)
    // }, [])




    const [translateValue] = useState(new Animated.Value(200));
    const animateTab = (selection) => {
        Animated.spring(translateValue, {
            toValue: selection == 'open' ? 0 : 200,
            // velocity: 10,
            // speed:2,
            useNativeDriver: true,
            // bounciness:4,
            friction: 10
        }).start();

        // setTab(selection)
    }



    const [slideValue] = useState(new Animated.Value(180));
    const slideUp = (selection) => {
        setLocalStepTwo(true)
        Animated.spring(slideValue, {
            toValue: selection == 'up' ? 0 : 180,
            // velocity: 10,
            // speed:2,
            useNativeDriver: false,
            // bounciness:4,
            friction: 10
        }).start();

        // setTab(selection)
    }




    useFocusEffect(
        useCallback(() => {


            animateTab('open')

            setDisplayDonut(true)

            return () => {
                setDisplayDonut(false)
                animateTab('close')
                slideUp('down')
                setLocalStepTwo(false)
            }

        }, [])
    )

    return (

        <SafeAreaView style={{ backgroundColor: '#fff', height: '100%' }}>
            {/* <StatusBar style='dark'/> */}

            {/* <TouchableOpacity style={{zIndex:999}} onPress={()=>animateTab()}><Text>dfsdfsdf</Text></TouchableOpacity> */}
            <>

                <Animated.View style={[{ height: '100%', width: '100%', backgroundColor: '#000', padding: 0 },
                { transform: [{ translateY: translateValue }] }

                ]}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', position: 'absolute', top: 20, right: 20 }}>
                        <View style={{ height: 9, width: 9, borderRadius: 30, backgroundColor: isConnected ? '#85ba78' : 'red' }}></View>
                    </View>

                    <Text style={{ fontWeight: 600, fontSize: 22, margin: 20, color: '#fff' }}>Local Ride</Text>

                    <Animated.View style={{ height: slideValue, }}>
                        <Image style={{ height: '100%', width: '90%', borderRadius: 0, alignSelf: 'center', borderTopLeftRadius: 40, borderTopRightRadius: 40 }} source={require('./assets/8.jpg')} />
                    </Animated.View>


                    <Animated.View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'space-between' }}>
                        <View style={{ height: 180, width: '100%', backgroundColor: '#fff', justifyContent: 'center' }}>
                            <View style={{ top: -30, height: 240, backgroundColor: 'rgba(255,255,255,.0)', zIndex: -10, alignItems: 'center' }}>


                                {displayDonut &&
                                    <DonutChart
                                        style={{ top: 0, backgroundColor: '#ddd', position: 'absolute' }}
                                        data={[{ name: 'mins to pickup', value: 20, color: 'black' }, { name: 'mins to pickup', value: 10, color: 'gray' }]}
                                        strokeWidth={15}
                                        radius={95}
                                        containerWidth={windowWidth - 20 * 2}
                                        containerHeight={windowWidth}
                                        type="round"
                                        startAngle={450}
                                        endAngle={270}
                                        animationType="slide"
                                    />
                                }


                            </View>
                        </View>

                        {localStepTwo &&
                            <View style={{ width: '80%', alignSelf: 'center' }}>
                                <Text style={{ fontSize: 18, fontWeight: '600' }}>Pickup</Text>
                                <TextInput style={{ marginTop: 4, height: 40, borderRadius: 20, borderWidth: 2, backgroundColor: 'white' }} />
                                <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 10 }}>Dropoff</Text>
                                <TextInput style={{ marginTop: 4, height: 40, borderRadius: 20, borderWidth: 2, backgroundColor: 'white' }} />
                            </View>
                        }

                        <View style={{ backgroundColor: '#fff' }}>

                            <View style={{ flexDirection: 'row', width: '80%', alignSelf: 'center', alignItems: 'center', justifyContent:'center', paddingVertical: 10 }}>
                                <MaterialIcons style={{ marginRight: 20, position:'absolute', left:0 }} name="access-time-filled" size={24} color="black" />
                                <Text style={{ fontWeight: 500, fontSize: 18, marginRight: 10 }}>
                                    Pickup By
                                </Text>
                                <Text style={{ fontWeight: 600, fontSize: 18, color: '#000' }}>
                                    {pickuptime.getHours() % 12 || 12}:{pickuptime.getMinutes()} pm
                                </Text>
                            </View>


                            {localStepTwo ?
                                <TouchableOpacity onPress={() => null} style={{ marginTop: 0, height: 70, width: '80%', backgroundColor: 'black', alignSelf: 'center', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>Order Ride</Text>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={() => slideUp('up')} style={{ marginTop: 0, height: 70, width: '80%', backgroundColor: 'black', alignSelf: 'center', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>Continue</Text>
                                </TouchableOpacity>
                            }


                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                                <Entypo style={{ marginRight: -24 }} name="dot-single" size={44} color= {!localStepTwo ? "#000" : "#9d9d9d" } />
                                <Entypo name="dot-single" size={44} color={localStepTwo ? "#000" : "#9d9d9d" }/>
                            </View>



                        </View>


                    </Animated.View>




                </Animated.View>
            </>
        </SafeAreaView>







    );
}







