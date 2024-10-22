import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, Modal } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default ChildcareHome = ({ isConnected, masterState, setMasterState, navigation, basket, setBasket, partner, setPartner }) => {

    const video = useRef(null);

    return (





        <ScrollView style={{ backgroundColor: '#fff', height: '100%' }}>



            <View style={{ padding: 20, marginTop: 20, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ backgroundColor: '#fff', zIndex: 98, borderRadius: 20, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={20} color="black" />
                </TouchableOpacity>

                <View>
                    <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, }}>Childcare</Text>
                    <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, }}>in Park City</Text>
                </View>
            </View>

            <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <View style={{ alignItems: 'center', }}>

                {/* <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 11, backgroundColor: 'blue', width: windowHeight * .2, padding: 10, marginRight: 20, borderRadius: 14, backgroundColor: 'rgba(0,0,0,.4)' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Natalia</Text>
                    <Text style={{ color: 'white', fontSize: 11, }}>Teacher</Text>
                </View> */}

                <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 11, width: windowHeight * .2, padding: 10, marginRight: 20, borderRadius: 14, backgroundColor: 'rgba(0,0,0,.4)' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Meet Natalia</Text>
                    <Text style={{ color: 'white', fontSize: 11, }}>Teacher</Text>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 14, right: 20, zIndex: 11, zIndex: 98, borderRadius: 20, paddingTop: 0, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" >
                        <MaterialIcons style={{ marginLeft: 10 }} name="arrow-forward-ios" size={16} color="white" />
                    </TouchableOpacity>

                </View>


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
                        {/* <Ionicons name="checkmark-circle-outline" size={24} color="black" /> */}
                        <Text style={{ fontSize: 24 }}>Book with confidence.</Text>
                        <Text style={{ fontSize: 18 }}>Our babysitters are teachers at Park City daycares and pre-schools.</Text>

                        <View style={{ width: '88%', alignSelf: 'center', marginTop: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="black" />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Professional childcare providers</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="black" />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Extensive training and experience</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle-outline" size={24} color="black" />
                                <Text style={{ marginLeft: 6, fontSize: 16 }}>Highly referred</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ alignSelf: 'flex-end', marginRight: windowWidth * .1 }}>
                    <Text style={{ fontSize: 17, textDecorationLine: 'underline', fontWeight:500}}>Read More</Text>
                </View>
            </View>




            <View style={{ width: '100%', }}>
                <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity style={{ borderRadius: 30, marginRight: 0, alignItems: 'center', paddingBottom: 30, borderWidth: 1 }}>
                            <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Easy Book</Text>

                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Age of Child(ren)</Text>
                            </View>

                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Age of Child(ren)</Text>
                            </View>

                            <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Date and Time</Text>
                            </View>

                            <View style={{ backgroundColor: '#ffcf56', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', alignSelf: 'center', marginTop: 30 }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Book Now</Text>
                            </View>

                        </TouchableOpacity>
                    </View>
                </View>
            </View>




            {/* <View style={{}}>


                <View style={{ zIndex: 100, width: '100%', }}>
                  



                    <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 20 }}>


                        <View style={{ flex: 1, marginRight: 20, }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Café</Text>

                            <TouchableOpacity onPress={() => { navigation.navigate('Partner', { selectedPartner: 'Daily Rise' }) }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/dailyrise.jpeg')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, bottom: 20, justifyContent: 'center', position: 'absolute' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Daily Rise</Text>
                                </View>
                            </TouchableOpacity>
                        </View>



                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Mediterranean</Text>

                            <TouchableOpacity onPress={() => { navigation.navigate('Partner', { selectedPartner: 'Nosh' }) }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/nosh.jpeg')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, bottom: 20, justifyContent: 'center', position: 'absolute' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Nosh</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>






                </View>
            </View > */}

        </ScrollView>






    );
}

