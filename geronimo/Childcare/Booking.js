import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, Linking, Platform, LayoutAnimation } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import SitterData from './SitterData.js';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default Booking = ({ isConnected, masterState, setMasterState, navigation }) => {

    let booking = masterState.user?.childcareBookings?.length ? masterState.user.childcareBookings[0] : null

    const video = useRef(null);
    const [showBookingOptions, setShowBookingOptions] = useState(false)

    let numOfChildren = 1 + (!booking.age2 ? 0 : 1 + (!booking.age3 ? 0 : 1 + (!booking.age4 ? 0 : 1)))

    const sitter = booking.provider

    return (


        <ScrollView style={{ backgroundColor: '#fff', height: '100%' }}>



            <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, marginTop: 20, flexDirection: 'row' }} name="arrow-back-ios" size={24} color="black" >
                <MaterialIcons style={{ marginLeft: 10, paddingTop: 10, marginLeft: -10 }} name="arrow-back-ios" size={24} color="black" />
                <View>
                    <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 32, marginTop: 0, }}>Childcare</Text>
                    <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, marginTop: 0, }}>in Park City</Text>
                </View>
            </TouchableOpacity>


            <View style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#FFCF56', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                <Image style={{ height: 40, width: 40, borderRadius: 30 }} source={require('../assets/yellow-icon-bold.png')} />
            </View>

            <TouchableOpacity onPress={() => setShowBookingOptions(options => !options)} style={{ backgroundColor: '#ffcf56', marginHorizontal: 20, padding: 8, borderRadius: 10, alignSelf: 'flex-start' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ fontSize: 20, color: '#000', marginRight: 10 }}>Book another date</Text>
                    <AntDesign name="pluscircleo" size={20} color="#000" />
                </View>
            </TouchableOpacity>

            {showBookingOptions &&
                <View style={{ borderWidth: 0, margin: 0, borderColor: '#fff', marginTop: 10, flexDirection: 'row', marginHorizontal: 10, padding: 8, borderRadius: 20, }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('EasyBook'); setShowBookingOptions(false) }} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .18, borderRadius: 30, marginRight: 10, alignItems: 'center', paddingVertical: 20 }}>
                        <Image style={{ flex: 1, width: '100%' }} resizeMode='contain' source={require('../assets/android-calendar.png')} />
                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Easy Book</Text>
                        </View>
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => { navigation.navigate('SitterList'); setShowBookingOptions(false) }} style={{ backgroundColor: '#e6e6e6', flex: 1, height: windowHeight * .18, borderRadius: 30, marginLeft: 10, alignItems: 'center', paddingVertical: 20, }}>
                        <Image style={{ flex: 1, width: '100%', margin: 8 }} resizeMode='contain' source={require('../assets/sitter-search.png')} />
                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Search Sitters</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            }





            <View

                style={{
                    marginHorizontal: 20, marginTop: 10, padding: 10,
                    borderRadius: 30, paddingBottom: 30, borderWidth: 0, backgroundColor: '#fafafa', shadowColor: '#000',
                    shadowOpacity: 0.38,
                    shadowRadius: 2,
                    shadowOffset: {
                        width: 0,
                        height: 0,
                    },
                }}

            >

                <View style={{ borderRadius: 20, borderWidth: 0 }}>
                    <View style={{ padding: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 30 }}>Current Booking</Text>
                            {/* <AntDesign name="pluscircleo" size={30} color="black" /> */}
                        </View>
                        <Text style={{ fontSize: 20 }}>{booking.dateTime}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ fontSize: 18 }}>{numOfChildren} {booking.age2 ? <Text>children. Ages: </Text> : <Text>child. Age:</Text>}</Text>

                            {booking.age1 && <Text style={{ fontSize: 18 }}> {booking.age1}</Text>}
                            {booking.age2 && <Text style={{ fontSize: 18 }}>, {booking.age2}</Text>}
                            {booking.age3 && <Text style={{ fontSize: 18 }}>, {booking.age3}</Text>}
                            {booking.age4 && <Text style={{ fontSize: 18 }}>, {booking.age4}</Text>}
                            {/* {booking.childrenAges.map((age) => {
                            return (
                                <Text style={{ fontSize: 18 }}>{age}yo, </Text>
                            )
                        })} */}
                            <Text style={{ fontSize: 18 }}></Text>
                        </View>
                        <Text style={{ fontSize: 18 }}>Notes: {booking.notes.length ? booking.notes : <Text style={{ color: '#a1a1a1', fontWeight: 500 }}>n/a</Text>}</Text>
                    </View>
                </View>

                <View style={{ width: '100%' }}>
                    <View style={{ marginHorizontal: 20, marginTop: 10, borderRadius: 20, borderWidth: .5, borderColor: '#d9d9d9' }} />
                </View>

                <View style={{ marginHorizontal: 10, marginVertical: 10, borderRadius: 20, borderWidth: 0 }}>
                    <View style={{}}>
                        <Text style={{ fontSize: 24 }}>Your Sitter</Text>
                    </View>
                </View>




                {sitter ?

                    <>
                        <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>
                            <Image
                                ref={video}
                                style={{ width: windowWidth * .4, height: windowWidth * .4, marginTop: 0, borderRadius: 20 }}
                                source={{ uri: sitter.cover_photo }}
                                resizeMode={ResizeMode.COVER}
                            />
                            <View onPress={() => navigation.navigate('SitterPage')} style={{ width: windowWidth * .6, height: windowWidth * .4, paddingHorizontal: 10, marginRight: 0, borderRadius: 14, flex: 1, }}>
                                <Text style={{ color: '#000', fontSize: 22, fontWeight: 500 }}>{sitter.firstName}</Text>
                                <Text style={{ color: '#000', fontSize: 18, fontWeight: 400 }}  >{booking.providerMessage}</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 30, marginHorizontal: 20, alignSelf: 'flex-end' }}>
                            <View style={{
                                borderRadius: 30, borderWidth: 0, backgroundColor: '#e6e6e6', shadowColor: '#000', padding: 10, paddingHorizontal: 20,
                                shadowOpacity: 0.28,
                                shadowRadius: 2,
                                shadowOffset: {
                                    width: 0,
                                    height: 0,
                                }
                            }}>
                                <TouchableOpacity onPress={() => { Linking.openURL(`tel:${sitter.phone}`) }} style={{ borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Feather style={{ marginRight: 10 }} name="phone" size={20} color="#000" /><Text style={{ fontWeight: 600, fontSize: 22, fontFamily: 'Aristotelica-Regular', textAlign: 'center', marginBottom: -6 }}>{sitter.firstName}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>

                    :
                    <View style={{ marginHorizontal: 10, flexDirection: 'row' }}>

                        <View style={{ marginTop: 0, borderRadius: 2, width: windowWidth * .4, height: windowWidth * .4, backgroundColor: '#e6e6e6', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ flex: 1, width: windowWidth * .3, height: windowWidth * .3, }} resizeMode='contain' source={require('../assets/person.png')} />
                        </View>
                        <View style={{ width: windowWidth * .6, paddingHorizontal: 8, borderRadius: 14, flex: 1, }}>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <Text style={{ color: '#000', fontSize: 18, fontWeight: 400, textAlign: 'left' }}  >Hi! Your sitter is being assigned. Give us a call if you'd like a faster update.</Text>
                            </View>
                            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${9175751955}`) }} style={{ borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffcf56', alignSelf: 'flex-end', padding: 10, }}>
                                <Feather style={{}} name="phone" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                }





            </View>



        </ScrollView>






    );
}

