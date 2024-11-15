import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, Linking, Platform, LayoutAnimation } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { MaterialIcons, Octicons} from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import SitterData from './SitterData.js'

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default SitterList = ({ isConnected, masterState, setMasterState, navigation, providers }) => {

    const video = useRef(null);
    const [showBookingOptions, setShowBookingOptions] = useState(false)

    const bookingDetails = {
        childrenAges: [1, 5, 8],
        dateTime: 'Dec 21 8am-1pm',
        sitter: 'Natalia',
        notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }



    return (


        <View style={{ height: '100%', backgroundColor: 'rgba(255,255,255,1)' }}>

            <View style={{ position: 'absolute', width: '100%', zIndex: 100, backgroundColor: 'rgba(255,255,255,.7)' }}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, marginTop: 20, flexDirection: 'row', backgroundColor: 'transparent' }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" />
                    <View>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, }}>Childcare</Text>
                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, }}>in Park City</Text>
                    </View>
                </TouchableOpacity>

                <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                    <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
                </View>

            </View>


            <ScrollView style={{ paddingTop: 90 }}>

                <View style={{ marginHorizontal: 20, marginVertical: 20, borderRadius: 20, borderWidth: 0 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 30 }}>Meet The Team</Text>
                    </View>
                </View>

                {Object.values(providers).map(sitter => {
                    return (
                        <TouchableOpacity key={sitter._id} onPress={() => navigation.navigate('SitterPage', { name: sitter.firstName })} style={{ marginHorizontal: 20, flexDirection: 'row', marginBottom: 20 }}>
                            <Image
                                style={{ width: windowWidth * .4, height: windowWidth * .4, marginTop: 0, borderRadius: 20 }}
                                source={{ uri: sitter.cover_photo }}
                                resizeMode={ResizeMode.COVER}
                            />
                            <View style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, marginRight: 0, borderRadius: 14, flex: 1, }}>
                                <Text style={{ color: '#000', fontSize: 21, fontWeight: 500, marginBottom:4 }}>{sitter.firstName}</Text>
                                {/* <Text style={{ color: '#000', fontSize: 16, fontWeight: 400 }}  >{sitter.bio_short}</Text> */}

                                {sitter.bio_short && sitter.bio_short.split('.').map((fact, idx) => {

                                    return (
                                        <View key={idx} style={{ flexDirection: 'row',  }}>
                                            <Octicons style={{marginTop:8,marginRight:-1}} name="dot-fill" size={8} color="black" />
                                            <Text style={{ marginLeft: 6, fontSize: 16 }}>{fact}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </TouchableOpacity>
                    )
                })}

                <View style={{height:90}}/>

            </ScrollView>
        </View>


    );
}

