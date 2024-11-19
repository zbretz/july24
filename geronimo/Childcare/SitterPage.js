import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import { Image } from 'expo-image'; //https://github.com/echowaves/expo-cached-image
import { useEffect, useState, useCallback, useRef } from 'react';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default SitterPage = ({ route, isConnected, masterState, setMasterState, navigation, providers }) => {

    let { name } = route.params
    let sitter = providers.find(provider => provider.firstName == name)

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

                <Image
                    style={{ height: windowWidth * .6, width: windowWidth * .9, marginTop: 0, borderRadius: 20 }}
                    // onLoadEnd={() => Image.getCachePathAsync(sitter.cover_photo).then(uri => console.log(uri))}
                    cachePolicy='disk' source={{ uri: sitter.cover_photo }} />

            </View>

            <View style={{ alignItems: 'center', }}>
                <View style={{ width: windowWidth * .9, marginTop: 10, borderRadius: 20, borderWidth: 0 }}>
                    <View style={{}}>
                        <View style={{ backgroundColor: '#fff', marginBottom: 10 }}>
                            <Text style={{ fontSize: 18 }}>{sitter.bio_long}</Text>
                        </View>


                        <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>

                            <View style={{ backgroundColor: '#fafafa', marginBottom: 10, padding: 8, borderRadius: 10 }}>
                                <Text style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 500 }}>Message from {sitter.firstName}</Text>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 8 }} />
                                <Text style={{ fontSize: 18, marginHorizontal: 10, padding: 8 }}>"{sitter.providerMessage}"</Text>
                            </View>

                            <View style={{ backgroundColor: '#fafafa', marginBottom: 10, padding: 8, borderRadius: 10 }}>
                                <Text style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 500 }}>Fun fact</Text>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 8 }} />
                                <Text style={{ fontSize: 18, marginHorizontal: 10, padding: 8 }}>{sitter.funFact}</Text>
                            </View>
                            {/* {sitter.funFacts.map((fact, idx) => {

                                return (
                                    <View key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Octicons name="dot-fill" size={20} color="black" />
                                        <Text style={{ marginLeft: 6, fontSize: 16 }}>{fact}</Text>
                                    </View>
                                )
                            })} */}
                        </View>

                        <View style={{ backgroundColor: '#fafafa', marginBottom: 10, padding: 8, borderRadius: 10 }}>
                            <Text style={{ fontSize: 18 }}> <Text style={{ fontWeight: 500 }}>Base Rate:</Text> ${sitter.rate}/hr</Text>
                        </View>

                    </View>
                </View>

            </View>

            <EasyBook masterState={masterState} navigation={navigation} setMasterState={setMasterState} sitter={sitter} />

        </ScrollView>

    );
}

