import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated, LayoutAnimation, Modal, Alert, Platform } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default AddressInput = ({ navigation, route, destination, setDestination, pickupLocation, setPickupLocation }) => {

    const { type } = route.params;

    const [addressError, setAddressError] = useState(false)
    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef(null);
    const [searchResults, setSearchResults] = useState([])
    const [addressModal, setAddressModal] = useState(false)

    const [address, setAddress] = useState(null)

    const API_KEY = 'AIzaSyBTBjSD9lnO2dmVBCt3Lm8LS3OhDckcrEI';
    const searchLocation = async (text) => {
        if (!text.length) { setSearchResults([]); return }
        console.log(text)
        axios
            .request({
                method: 'post',
                url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${text}&location=40.6856%111.5563&radius=50000&region=US`,
            })
            .then((response) => {
                setSearchResults(response.data.predictions)
            })
            .catch((e) => {
                console.log(e.response);
            })

    };

    return (

        <View style={{ paddingBottom: 6, backgroundColor: '#fff', flex: 1, }}>


            <Modal visible={addressModal}
                animationType='slide'
                transparent={true}
                style={{ flex: 1, zIndex: 11 }}
            >
                <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: '100%', alignItems: 'center', }} onPress={() => setAddressModal(false)}>
                        <View style={{ width: '90%', backgroundColor: '#fff', padding: 10, borderRadius: 20 }}>
                            <View style={{ marginBottom: 0, padding: 10 }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18 }}>Please select an address from the dropdown options.</Text>
                            </View>
                            <View style={{ borderBottomWidth: 1, width: '100%', }} />
                            <TouchableOpacity onPress={() => setAddressModal(false)} style={{ padding: 14 }}>
                                <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18 }}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <View style={{ backgroundColor: '#fff', padding: 32, }}>
                <TouchableOpacity onPress={() => {
                    type == 'Arrivals' ? setDestination('') : setPickupLocation('')
                    navigation.goBack()
                }}><Ionicons name="chevron-back-outline" size={24} color="black" /></TouchableOpacity>
            </View>

            <View style={{ position: 'absolute', top: 24, right: 24, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center', }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <View style={{ flexDirection: 'row', marginHorizontal: 20, marginBottom: 10, borderRadius: 30, justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ flex: 4, justifyContent: 'center' }}>
                    <Text style={{ flexWrap: 'wrap', fontSize: 26, padding: 0, fontFamily: 'LexendRegular', }} adjustsFontSizeToFit={true} numberOfLines={1}>{type == 'Arrivals' ? "Dropoff Address" : "Pickup Location"}</Text>
                </View>
            </View>






            <View style={{ marginTop: 0, marginHorizontal: 20, justifyContent: 'center', backgroundColor: '#e6e6e6', borderRadius: 30, paddingBottom: 0 }}>



                <TextInput style={{ height: 40, borderRadius: 16, backgroundColor: '#f2f2f2', fontSize: 16, fontFamily: 'PointSoftSemiBold', marginBottom: 10, paddingHorizontal: 20 }}
                    ref={inputRef}
                    autoFocus
                    autoCapitalize={'none'}
                    placeholderTextColor={'#77756e'}
                    onFocus={() => setInputFocused('pickup')}
                    onBlur={() => { setInputFocused(false); setSearchResults([]) }}
                    // placeholder={'Pickup Address'}
                    value={type == 'Arrivals' ? destination : pickupLocation}
                    onChangeText={(text) => {
                        if (type == 'Arrivals') {
                            console.log('arrivals text: ', text)
                            searchLocation(text); setDestination(text);
                            //  validateAddress(text); 
                            // if (text.length === 0) setDropoffAddressNotRecognized(true)
                        } else {
                            searchLocation(text); setPickupLocation(text);
                            // validateAddress(text); 
                            // if (text.length === 0) setPickupAddressNotRecognized(true)
                        }
                    }}

                    blurOnSubmit={false}
                    onSubmitEditing={() => { setAddressModal(true) }}
                />




            </View>





            <View style={{ marginHorizontal: 20 }}>
                {
                    searchResults.map((item, index) => {
                        return (
                            <View style={{ borderTopWidth: index == 0 ? 0 : 1, borderTopColor: '#e6e6e6', }} key={item.place_id}>
                                <TouchableHighlight
                                    underlayColor="#DDDDDD"
                                    style={{ zIndex: 10, flexDirection: 'row', paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' }}
                                    onPress={() => {
                                        if (type == 'Arrivals') {
                                            setDestination(item.description);
                                            // setDropoffAddressNotRecognized(false);
                                            inputRef.current.blur(); navigation.goBack()// setSearchResults([])
                                        } else {
                                            setPickupLocation(item.description);
                                            // setPickupAddressNotRecognized(false);
                                            inputRef.current.blur(); navigation.goBack()// setSearchResults([])
                                        }
                                    }}>
                                    <View style={{ flexDirection: 'row', padding: 6, alignItems: 'center' }}>
                                        <FontAwesome6 name="location-dot" size={14} color="#e6e6e6" />
                                        <Text numberOfLines={2} style={{ marginLeft: 10, fontSize: 16, color: '#000', fontFamily: 'PointSoftSemiBold' }}>{item.description}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        );
                    })
                }
            </View>

            {addressError &&
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 80, zIndex: 3, }}>
                    <View style={{ width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1 }}>
                        <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18 }}>Address not recognized.</Text>
                        <Text style={{ textAlign: 'center', fontFamily: 'LexendMedium', fontSize: 18, marginTop: 8 }}>Please re-input your location.</Text>
                    </View>
                </View>
            }

        </View>
    )
}



