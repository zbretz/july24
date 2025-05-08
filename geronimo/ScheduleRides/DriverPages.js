import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Dimensions, Image } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Entypo, MaterialIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { formatInTimeZone } from "date-fns-tz";
import axios from 'axios';
import { url } from '../url_toggle'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let boxDimensions = (windowWidth - 30) / 2

export default DriverPages = ({ navigation, masterState, setMasterState, }) => {

    // const [carouselIndex, setCarouselIndex] = useState(0)
    const carouselRef = useRef(null)
    // const nextPage = () => {
    //     if ((typeSelected == 'arrivals' && destination.length === 0) || (typeSelected == 'departures' && pickupLocation.length === 0)) {
    //         errorTimeout()
    //         return
    //     }


    //     setCarouselIndex(carouselIndex => carouselIndex + 1)
    //     console.log(carouselRef.current.getCurrentIndex());
    //     carouselRef.current.next()
    // }

    // const prevPage = () => {
    //     setCarouselIndex(carouselIndex => carouselIndex - 1)
    //     console.log(carouselRef.current.getCurrentIndex());
    //     carouselRef.current.prev()
    // }


    return (


        <View>


            <TouchableOpacity style={{ position: 'absolute', zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity>


            <View style={{ position: 'absolute', top: 20, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}  >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            {/* <SafeAreaView style={{ height: '100%', backgroundColor: '#fff' }}> */}
            <ScrollView style={{ height: '100%', backgroundColor: '#fff', paddingTop: 80 }}>

                {/* <TouchableOpacity style={{ zIndex: 11, padding: 20, alignSelf: 'flex-start' }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#e6e6e6', borderRadius: 30, padding: 10 }}>
                    <Ionicons name="chevron-back-outline" size={24} color="black" />
                </View>
            </TouchableOpacity> */}




                {/* <View style={{}} >
                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Airport Transfers</Text>
                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>By-The-Hour</Text>
                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Park City and SLC Tours</Text>
                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', }}>Sprinter Vans</Text>
            </View> */}


                <Text style={{ fontSize: 32, color: '#000', fontFamily: 'LexendMedium', marginHorizontal: 10 }}>Private</Text>
                <Text style={{ fontSize: 32, color: '#000', fontFamily: 'LexendMedium', marginHorizontal: 10 }}>Drivers</Text>

                <Text style={{ fontSize: 18, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Hire a professional driver in the Park City area for a specific need or occasion.</Text>



                <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Quick Ideas</Text>

                {/* <View style={{ marginHorizontal: 10, padding: 0, borderRadius: 30 }}>


                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                    <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 1.5, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                        <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/car-schedule.png')} />
                        <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Airport Transfers</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 1.5, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                        <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/car-location.png')} />
                        <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>By-The-Hour</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 1.5, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                        <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/car-location.png')} />
                        <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Medical</Text>
                    </TouchableOpacity>

                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                    <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 1.5, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                        <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/stroller.png')} />
                        <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Driving Tours</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Locals')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 1.5, borderRadius: 30, alignItems: 'center', padding: 10, }}>
                        <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/coffee.png')} />
                        <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Sprinter Vans</Text>
                        </View>
                    </TouchableOpacity>

                </View>

            </View> */}


                <View style={{ marginHorizontal: 10, padding: 0, borderRadius: 30 }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>


                        <TouchableOpacity onPress={() => navigation.navigate('ScheduleRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, alignItems: 'center', padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{}}>
                                <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18, marginBottom: 0, paddingHorizontal: 0, }}>Airport</Text>
                                <Text style={{ fontFamily: 'Lexend-Regular', fontSize: 18, marginBottom: 0, paddingHorizontal: 0, }}>Transfers</Text>
                            </View>
                            <Image style={{ width: '50%', height: '120%', }} resizeMode='contain' source={require('../assets/airplane.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('LocalRide')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, padding: 10, }}>
                            {/* <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/car-location.png')} /> */}
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8, textAlign: 'left' }}>By-The</Text>
                            <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8, textAlign: 'left' }}>-Hour</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                        <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, justifyContent: 'center', padding: 10, }}>
                            {/* <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/stroller.png')} /> */}
                            <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 0 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Driving</Text>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Tours</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Locals')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, alignItems: 'center', padding: 10, }}>
                            {/* <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/coffee.png')} /> */}
                            <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 0 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Sprinter</Text>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Vans</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>

                        <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ backgroundColor: '#f2f2f2', width: boxDimensions, height: boxDimensions / 2.5, borderRadius: 20, justifyContent: 'center', padding: 10, }}>
                            {/* <Image style={{ flex: 1, width: '40%', margin: -28 }} resizeMode='contain' source={require('../assets/stroller.png')} /> */}
                            <View style={{ backgroundColor: null, padding: 0, borderRadius: 10, alignSelf: 'flex-start', justifyContent: 'center', marginTop: 0 }}>
                                <Text style={{ fontFamily: 'LexendRegular', fontSize: 18, marginBottom: 0, paddingHorizontal: 8 }}>Medical</Text>
                            </View>
                        </TouchableOpacity>



                    </View>

                </View>


                {/* <View style={{ backgroundColor: '#e5faff', margin: 10, width: windowWidth - 20, borderRadius: 30, paddingBottom: 10 }}>
                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Meet the Drivers</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ marginHorizontal: 10, width: windowWidth - 40, height: windowWidth / 1.5, borderRadius: 30, }}>
                        <Image style={{ width: windowWidth - 40, height: windowWidth / 1.5, borderRadius: 30, }} resizeMode='cover' source={require('/Users/zacharybretz/work/july24/geronimo/assets/Screenshot 2025-05-06 at 11.18.35 PM.png')} />
                    </TouchableOpacity>
                </View> */}




                <View style={{ backgroundColor: '#e5faff', margin: 10, width: windowWidth - 20, borderRadius: 30, paddingBottom: 10 }}>

                    <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Meet the Drivers</Text>


                        <Carousel
                        autoPlay={true}
                        	loop={true}
                            width={430}
                            height={258}
                            snapEnabled={true}
                            pagingEnabled={true}
                            autoPlayInterval={4000}

                            ref={carouselRef}
                            enabled={true}
                         
                            data={[...new Array(4).keys()]}
                            scrollAnimationDuration={1000}
                          
                            onSnapToItem={(index) => console.log('current index:', index)}
                            renderItem={({ index }) => {
                                // console.log('hello: ', index)
                                return (
                                    <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ marginHorizontal: 10, width: windowWidth - 20,  borderRadius: 30, }}>
                                        <Image style={{ width: windowWidth - 40, height: windowWidth / 1.5, borderRadius: 30, }} resizeMode='cover' source={require('/Users/zacharybretz/work/july24/geronimo/assets/Screenshot 2025-05-06 at 11.18.35 PM.png')} />
                                    </TouchableOpacity>
                                )

                            }}
                        />

                    </View>



                {/* <Text style={{ fontSize: 20, color: '#000', fontFamily: 'LexendRegular', margin: 10 }}>Meet the Drivers</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Childcare')} style={{ marginHorizontal: 10, backgroundColor: '#f2f2f2', width: windowWidth - 20, height: windowWidth / 1.5, borderRadius: 30, }}>
                <Image style={{ width: windowWidth - 20, height: windowWidth / 1.5, borderRadius: 30, }} resizeMode='cover' source={require('/Users/zacharybretz/work/july24/geronimo/assets/Screenshot 2025-05-06 at 11.18.35 PM.png')} />
            </TouchableOpacity> */}

            </ScrollView>
            {/* </SafeAreaView> */}

        </View>

    );
}



