import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated, LayoutAnimation, ActivityIndicator } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, Octicons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ScheduleRideStripeConfig from './ScheduleRideStripeConfig';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useTheme } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default PaymentPage = ({ masterState, setMasterState, navigation, route }) => {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // const rideDetail = masterState.user.rideDetails.length ? masterState.user.rideDetails[0] : null
    // if (!rideDetail) { return null }

    const { rideId } = route.params
    let rideDetail = masterState.user.activeRides.length ? masterState.user.activeRides.find(ride => ride._id == rideId) : null

    const [tipSection, setTipSection] = useState(false)
    const [tipAmount, setTipAmount] = useState(0)
    const [loadingPayForm, setLoadingPayForm] = useState(false)
    const [keyboardFocused, setKeyboardFocused] = useState(false)

    rideDetail = { ...rideDetail, tipAmount }

    let openPaymentSheet = ScheduleRideStripeConfig(rideDetail, setLoadingPayForm, masterState, setMasterState, navigation)


    useEffect(() => {
        setTimeout(() => {
            setTipSection(true)
        }, 1000)
        return () => setTipSection(false)
    }, [])


    if (!rideDetail) { navigation.goBack(); return null }


    return (

        <StripeProvider
            // publishableKey='pk_test_51Ov1U9JhmMKAiBpVk0Yi4caz54y15SeJmshn5treNiYIEK5hB9z5z0CoOcqTUccG6pSifKP3cvLThjXJKzwq7egw00zhn8XsAI' // pc payments
            publishableKey="pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT"  //pc app
            // publishableKey="pk_live_51Nj9WRAUREUmtjLCliIgWk6tgmUXBHSOGsmmaNIC6Tb9UT4BVNEAK40DNXsrljEJHLHxJsj0CyU0qdU5ozO4I1Eb00SdEyvrQ9"  //pc app
            urlScheme="your-url-scheme"
        >
            <SafeAreaView style={{ height: '100%', backgroundColor: '#f2f2f2' }}>

                <TouchableOpacity style={{ margin: 10, padding: 20, zIndex: 11, alignItems: 'flex-end', justifyContent: 'center' }} onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={20} color="black" />
                </TouchableOpacity>

                <View style={{ margin: 10, padding: 20, paddingTop: 20, borderColor: '#f2f2f2', borderBottomWidth: 0, borderRadius: 10, backgroundColor: '#fff' }}>

                    <View style={{}}>
                        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 0, margin: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                            <FontAwesome5 name="money-check" size={16} style={{ marginRight: 20 }} color="black" />
                            <Text style={{ color: '#000', fontSize: 18, }}>Payment</Text>
                        </View>
                    </View>

                    {!keyboardFocused &&
                        < View style={{ padding: 10, borderRadius: 10, marginTop: 0, }}>
                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: '#595959' }}>Pickup</Text>
                            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '500' }}>{rideDetail.pickupAddress}</Text>
                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: '#595959', marginTop: 4 }}>Dropoff</Text>
                            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '500' }}>{rideDetail.dropoffAddress}</Text>
                            {/* <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '500' }}>{rideDetail.paid}</Text> */}
                            <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '500', color: '#595959' }}>Fare</Text>
                            <Text numberOfLines={1} style={{ fontSize: 17, fontWeight: '500' }}>${rideDetail.fare}</Text>
                        </View>
                    }

                    {tipSection &&
                        <View style={{ height: 120, margin: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 0, borderRadius: 10, backgroundColor: '#f2f2f2' }}>
                            <Text style={{ fontSize: 17 }}>If you'd like to tip:</Text>

                            <TextInput style={{ backgroundColor: '#fff', padding: 10, marginTop: 6, borderRadius: 20, width: 60, }} textAlign='center' onChangeText={(text) => {setTipAmount(Number(text)) }}
                                placeholderTextColor={'#737373'}
                                value={tipAmount}
                                keyboardType='numeric'
                                onFocus={() => setKeyboardFocused(true)} onBlur={() => setKeyboardFocused(false)}
                            />
                        </View>
                    }

                    {loadingPayForm ?
                        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, padding: 10, margin: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                            <ActivityIndicator />
                        </View>
                        :
                        <TouchableOpacity onPress={() => { setLoadingPayForm(true); openPaymentSheet() }} style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, padding: 10, margin: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                            <FontAwesome5 name="money-check" size={16} style={{ marginRight: 20 }} color="black" />
                            <Text style={{ color: '#000', fontSize: 18, }}>Pay By Card</Text>
                        </TouchableOpacity>
                    }

                </View>

            </SafeAreaView>
        </StripeProvider >

    );
}






