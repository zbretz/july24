import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Octicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import SitterData from './sitterData.js'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default SitterPage = ({ route, isConnected, masterState, setMasterState, navigation, }) => {

    let { name } = route.params
    let sitter = SitterData[name]

    const video = useRef(null);

    return (
        <ScrollView style={{ backgroundColor: '#fff', height: '100%' }}>



            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, marginTop: 20, flexDirection: 'row' }}>
                <View style={{ backgroundColor: '#fff', zIndex: 98, borderRadius: 20, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={20} color="black" />


                </View>

                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, }}>{name}</Text>
            </TouchableOpacity>

            <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <View style={{ alignItems: 'center', }}>

                <Video
                    // ref={video}
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
                        <Text style={{ fontSize: 24 }}>About Me</Text>
                        <Text style={{ fontSize: 18 }}>{sitter.bio}</Text>
                        <Text style={{ fontSize: 18 }}>Base Rate: ${sitter.rate}/hr</Text>

                        <View style={{ width: '88%', alignSelf: 'center', marginTop: 10 }}>

                            {sitter.funFacts.map(fact => {

                                return (
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Octicons name="dot-fill" size={20} color="black" />
                                        <Text style={{ marginLeft: 6, fontSize: 16 }}>{fact}</Text>
                                    </View>
                                )
                            })}

                        </View>
                    </View>
                </View>

            </View>


            {/* <View style={{ width: '100%' }}><View style={{ marginHorizontal: 20, marginTop: 10, borderRadius: 20, borderWidth: .5, borderColor: '#c9c9c9' }} /></View> */}


            {/* <View style={{ width: '100%', }}>
                <View style={{ marginVertical: 30, marginHorizontal: 20 }}>
                    <View style={{ flex: 1, }}>
                        <TouchableOpacity style={{ borderRadius: 30, marginRight: 0, alignItems: 'center', paddingBottom: 30, borderWidth: 1 }}>
                            <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Book Natalia</Text>

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
            </View> */}

            <EasyBook sitter={sitter} />


        </ScrollView>

    );
}

