import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated, Platform, LayoutAnimation, ActivityIndicator, Linking } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, Octicons, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ScheduleRideStripeConfig from './ScheduleRideStripeConfig';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useTheme } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export default PaymentPage = ({ masterState, setMasterState, navigation, route }) => {

    Platform.OS == 'ios' && LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // const rideDetail = masterState.user.rideDetails.length ? masterState.user.rideDetails[0] : null
    // if (!rideDetail) { return null }

    const { rideId } = route.params
    let rideDetail = masterState.user.activeRides.length ? masterState.user.activeRides.find(ride => ride._id == rideId) : null

    const [tipSection, setTipSection] = useState(false)
    const [tipAmount, setTipAmount] = useState(0)
    const [loadingPayForm, setLoadingPayForm] = useState(false)
    const [keyboardFocused, setKeyboardFocused] = useState(false)

    rideDetail = { tipAmount, fare: rideDetail.fare, _id: rideDetail._id, user: rideDetail.user, driver: rideDetail.driver }
    // rideDetail = {...rideDetail, tipAmount }

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
            // publishableKey="pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT"  //pc app
            publishableKey="pk_live_51Nj9WRAUREUmtjLCliIgWk6tgmUXBHSOGsmmaNIC6Tb9UT4BVNEAK40DNXsrljEJHLHxJsj0CyU0qdU5ozO4I1Eb00SdEyvrQ9"  //pc app
            urlScheme="your-url-scheme"
        >
            <SafeAreaView style={{ height: '100%', backgroundColor: '#f2f2f2' }}>


                <TouchableOpacity style={{ position: 'absolute', top: -10, right: -10, zIndex: 11, padding: 30, }} onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="x" size={24} color="black" />
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 20, width: '100%', marginTop: 40 }}>



                    <View style={{
                        marginVertical: 10,
                        backgroundColor: '#e6e6e6',
                        borderRadius: 30,
                        padding: 20
                    }}>



                        <View style={{ margin: 10, padding: 20, paddingTop: 20, borderColor: '#f2f2f2', borderBottomWidth: 0, borderRadius: 10, backgroundColor: '#fff' }}>

                            <View style={{}}>
                                <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 0, margin: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} >
                                    {/* <FontAwesome5 name="money-check" size={34} style={{ marginRight: 20 }} color="black" /> */}
                                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontSize: 36, fontFamily: 'Aristotelica-Regular', textAlign: 'center', marginBottom: -8 }}>Payments</Text>
                                </View>
                            </View>

                            {!keyboardFocused &&
                                < View style={{ padding: 10, borderRadius: 10, marginTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                    <Text numberOfLines={1} style={{ fontSize: 34, color: '#595959', fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Ride Fare</Text>
                                    <Text numberOfLines={1} style={{ fontSize: 34, fontFamily: 'PointSoftSemiBold', }}>${rideDetail.fare}</Text>
                                </View>
                            }

                            {tipSection &&
                                <View style={{ height: 120, margin: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 0, borderRadius: 10, backgroundColor: '#f2f2f2', }}>
                                    <Text style={{ fontSize: 17, fontFamily: 'Aristotelica-Regular', }}>If you'd like to leave a tip: </Text>

                                    <TextInput style={{ backgroundColor: '#fff', color:'#000', fontFamily: 'PointSoftSemiBold', fontSize:16, padding: 10, marginTop: 6, borderRadius: 20, width: 60, }} textAlign='center' onChangeText={(text) => { setTipAmount(Number(text)) }}
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
                                <TouchableOpacity onPress={() => { setLoadingPayForm(true); openPaymentSheet() }} style={{ backgroundColor: '#ffcf56', padding: 20, borderRadius: 20, borderWidth: 0, marginTop: 10, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }} >
                                    <FontAwesome5 name="money-check" size={22} style={{ marginRight: 20 }} color="black" />
                                    <Text style={{ color: '#000', fontSize: 24, fontFamily: 'Aristotelica-SmallCaps', marginBottom: -6 }}>Pay By Card</Text>
                                </TouchableOpacity>
                            }


                            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center', }}>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', }}>
                                    Or you can use this link:
                                </Text>
                                <TouchableOpacity onPress={() => Linking.openURL("https://buy.stripe.com/8wMdSlfvN9OZgRW6oq")}
                                    style={{ borderRadius: 30, padding: 8, backgroundColor: '#e2e2e2', marginLeft: 10 }} >
                                    <Text style={{ color: '#000', fontSize: 14, fontFamily: 'Aristotelica-Regular', marginBottom: -4, textAlign: 'center' }}>Pay here</Text>
                                </TouchableOpacity>
                            </View>


                        </View>



                    </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Account', { screen: 'ReceiptScreen' })}
                    style={{ borderRadius: 30, padding: 8, backgroundColor: '#fff', padding: 20, paddingHorizontal: 28, borderRadius: 80, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 40, right: 40 }} >
                    <Ionicons name="receipt-outline" size={38} color="black" />
                    <Text style={{ color: '#000', fontSize: 14, fontFamily: 'Aristotelica-Regular', marginBottom: -4, textAlign: 'center' }}>Receipt</Text>
                    <Text style={{ color: '#000', fontSize: 14, fontFamily: 'Aristotelica-Regular', marginBottom: -4, textAlign: 'center' }}>Options</Text>
                </TouchableOpacity>


            </SafeAreaView>
        </StripeProvider >

    );
}




// import Ionicons from '@expo/vector-icons/Ionicons';

