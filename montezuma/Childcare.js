import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import url from './url_toggle'
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Childcare = ({ navigation, masterState, setMasterState }) => {

    const [bookings, setBookings] = useState([])
    const [providers, setProviders] = useState([])

    let fetchBookings = () => {

        axios.get(`${url}/bookings`)
            .then(res => {
                let { bookings, providers } = res.data
                console.log('sdfdsfs:', res.data.providers)
                setBookings(bookings)
                setProviders(providers)
            })
            .catch(e => console.log('error: ', e))

    }

    let removeBooking = (booking_id, user_id) => {

        console.log("booking_id: ", typeof booking_id)

        axios.delete(`${url}/booking`, { data: { booking_id, user_id } })
            .then(res => {
                setBookings(bookings => {
                    console.log('bookings: ', bookings)
                    let new_bookings = bookings.filter(booking => booking._id !== booking_id)
                    return [...new_bookings]
                });
            })
            .catch(e => console.log('error: ', e))
    }

    useEffect(() => {
        fetchBookings()
    }, [])



    const { user } = masterState



    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: '#fff', }}>

            <TouchableOpacity onPress={fetchBookings}>
                <Text>Refresh</Text>
            </TouchableOpacity>



            <View style={{ padding: 20, flex: 1 }}>

                {/* <Text style={{ textAlign: 'center' }}>Providers</Text>
                {providers.map(provider => <Text>{provider.firstName}</Text>)} */}

                <Text style={{ textAlign: 'center' }}>Bookings</Text>
                {bookings && bookings.map(booking => {
                    return (
                        <View
                            style={{ minHeight: 100, backgroundColor: '#eee', borderRadius: 20, margin: 10, padding: 20 }}>
                            <View style={{ backgroundColor: 'rgba(255,255,255,.7)', width: '100%', position: 'absolute', zIndex: 99 }} />
                            <Text>{booking.dateTime}</Text>
                            <Text>{booking.user.firstName}</Text>
                            <Text>{booking.user._id}</Text>
                            <Text>{booking.notes}</Text>

                            <View style={{ borderTopWidth: 1, marginVertical: 10 }} />

                            {booking.provider ?
                                <Text>{booking.provider.firstName}</Text>
                                :
                                <SitterPicker providers={providers} setProviders={setProviders} setBookings={setBookings} booking_id={booking._id} user_id={booking.user._id} />
                            }

                            <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => removeBooking(booking._id, booking.user._id)}>
                                <Text>Remove</Text>
                            </TouchableOpacity>

                        </View>
                    )
                })
                }


            </View>

        </SafeAreaView>

    );

}





function SitterPicker({ providers, bookings, setBookings, booking_id, user_id }) {

    const [open, setOpen] = useState(false)
    const [provider, setProvider] = useState(null)


    providers = providers.map(provider => { return { label: provider.firstName, value: provider } })

    const assignSitter = (provider) => {
        provider = provider.value
        console.log('assign: ', provider)


        axios.post(`${url}/assignProvider`, { booking_id, provider, user_id })
            .then(res => {
                if (res.data) {
                    setModalVisible(true)
                } else {
                    null
                }
            })
            .catch(e => console.log('sign in error: ', e))



        setBookings(bookings => {
            console.log('bookings: ', bookings)
            bookings = bookings.map(booking => { return booking._id === booking_id ? { ...booking, provider: provider } : booking })
            return [...bookings]
        })

    }

    return (

        <DropDownPicker
            style={{ marginBottom: 10 }}
            dropDownContainerStyle={{}}
            itemKey="label"
            open={open}
            onClose={() => setOpen(false)}
            value={provider}
            items={providers}
            setOpen={setOpen}
            onSelectItem={assignSitter}
            // setValue={setProvider}
            // setItems={setProviders}
            placeholder={'Choose a provider.'}
        />

    );
}