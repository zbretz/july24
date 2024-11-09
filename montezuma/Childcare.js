import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import url from './url_toggle'
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Childcare = ({ navigation, masterState, setMasterState }) => {

    const [bookings, setBookings] = useState([])
    const [providers, setProviders] = useState([])

    let fetchBookings = () =>

        axios.get(`${url}/bookings`)
            .then(res => {
                let { bookings, providers } = res.data
                console.log('sdfdsfs:', res.data.providers)
                setBookings(bookings)
                setProviders(providers)
            })
            .catch(e => console.log('error: ', e))



    // let fetchProviders = () =>

    //     axios.get(`${url}/bookings`)
    //         .then(res => {
    //             if (!res.data) {
    //                 return
    //             }
    //             setBookings(res.data)
    //         })
    //         .catch(e => console.log('error: ', e))


    useEffect(() => {
        fetchBookings()
        // fetchProviders()

    }, [])



    const { user } = masterState



    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff', }}>


            <View style={{ padding: 20, flex: 1 }}>
                <Text style={{ textAlign: 'center' }}>Providers</Text>

                {providers.map(provider => <Text>{provider.firstName}</Text>)}

                <Text style={{ textAlign: 'center' }}>Bookings</Text>

                {bookings.map(bookings => {
                    return (
                        <View
                            style={{ minHeight:100, backgroundColor: '#eee', borderRadius: 20, margin: 10, padding:20 }}>
                            <View style={{ backgroundColor: 'rgba(255,255,255,.7)', width: '100%', position: 'absolute', zIndex: 99 }} />
                            <Text>{bookings.dateTime}</Text>
                            <Text>{bookings.user.firstName}</Text>
                            <Text>{bookings.notes}</Text>
                        </View>
                    )
                })
                }

                {/* <TouchableOpacity onPressIn={fetchBookings} style={{ flex: 1, backgroundColor: '#eee', borderRadius: 20, margin: 10 }}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,.7)', height: '100%', width: '100%', position: 'absolute', zIndex: 99 }} />
                    <Image style={{ height: '80%', width: '100%', backgroundColor: null, }} source={require('./assets/profile.png')} resizeMode='contain' />
                </TouchableOpacity> */}


            </View>

        </SafeAreaView>

    );

}