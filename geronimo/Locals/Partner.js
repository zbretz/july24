import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, AppState, SectionList, Animated, Modal, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import partnerData from './LocalsData';
import LocalsCheckout from './LocalsCheckout';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import CheckoutModal from './CheckoutModal.js'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Partner = ({ route, isConnected, masterState, setMasterState, navigation, item, setItem, basket, setBasket, partner, setPartner }) => {


    let { selectedPartner } = route.params

    const [hours, setHours] = useState(null)     // let hours = [[6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15]] // ordered sun (day 0) -> sat (day 6)
    const [dates, setDates] = useState(null)
    let now = new Date()

    const [isOpenHours, setIsOpenHours] = useState(null)
    const [isOpenDates, setIsOpenDates] = useState(true)

    const fetchPartnerData = () => {
        console.log('fetch partner data: ')
        axios.get(`http://10.0.0.135:7100/locals/partnerData?partner=${selectedPartner}`)
            .then(res => {
                // console.log('DATA: ', res.data)
                let hours = res.data.hours
                let dates = res.data.deactivatedDates
                if (dates.length) {
                    let isOpen = true
                    dates.forEach((date) => {
                        date = new Date(date)
                        console.log('89yg498hru93uhr983hirvi3nrvc0i3rvi30rinv03inrv0in3rv: ', date.getDate())
                        console.log('hours: ', hours, 'day: ', now.getDay(), 'hours: ', now.getHours())
                        if ((date.getDate() == now.getDate()) && (date.getMonth() == now.getMonth())) {
                            isOpen = false
                        }
                        setIsOpenDates(isOpen)
                    })
                }
                setHours(hours)
                setIsOpenHours(now.getHours() >= hours[now.getDay()][0] && now.getHours() <= hours[now.getDay()][1])
            })
            .catch(e => console.log('order  error: ', e))
    }


    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') { fetchPartnerData() }
            appState.current = nextAppState;
        });
        return () => { subscription.remove() };
    }, []);

    useEffect(() => {
        fetchPartnerData()
        setPartner(partnerData[selectedPartner])
    }, [selectedPartner])




    let scrollOffsetY = useRef(new Animated.Value(0)).current;
    console.log('scrollOffset: ', scrollOffsetY)

    const Header_Max_Height = windowHeight * .3;
    const magicHeight = scrollOffsetY.interpolate({
        inputRange: [0, Header_Max_Height],
        outputRange: [Header_Max_Height, 100],
        extrapolate: 'clamp',
    });

    const magicBottom = scrollOffsetY.interpolate({
        inputRange: [0, 80],
        outputRange: [20, 34],
        // extrapolate: 'clamp',
    });

    const [slideValue] = useState(new Animated.Value(80));
    const slideUp = (selection) => {

        Animated.spring(slideValue, {
            toValue: selection == 'up' ? 0 : 80,
            useNativeDriver: false,
            friction: 10
        }).start();
    }

    const [showBasket, setShowBasket] = useState(false)
    const basketLength = basket.items.length ? Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0) : 0

    let openPaymentSheet = LocalsCheckout(basket, setBasket, masterState, setMasterState, navigation)

    if (!partner) return

    return (
        <View style={{ height: '100%', backgroundColor: '#fff', padding: 20 }}>

            <CheckoutModal basket={basket} showBasket={showBasket} setShowBasket={setShowBasket} setBasket={setBasket} openPaymentSheet={openPaymentSheet} masterState={masterState} />

            <Animated.View style={{ height: magicHeight, zIndex: 100, }}>

                {basket.items.length ?
                    <>
                        <TouchableOpacity onPress={() => setShowBasket(true)} style={{ alignItems: "center", position: 'absolute', zIndex: 20, top: -10, right: -10, backgroundColor: 'rgba(255,255,255,1)', borderRadius: 60, padding: 14 }}>
                            <View style={{ borderRadius: 60, padding: 7, position: 'absolute', right: -1, top: -7, backgroundColor: '#fff', }}>
                                {basketLength && <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 28, }}>{basketLength}</Text>}
                            </View>
                            <Image style={{ height: 50, width: 50, }} source={require('../assets/basket.png')} />
                        </TouchableOpacity>
                    </>
                    : null
                }


                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 20, left: 16, backgroundColor: '#fff', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}  >
                    <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={24} color="black" />
                </TouchableOpacity>

                <Animated.View style={{ position: 'absolute', zIndex: 100, bottom: 20, left: magicBottom, borderRadius: 30, backgroundColor: 'rgba(255,255,255,1)' }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 30, marginBottom: -10, padding: 16 }}>{selectedPartner}</Text>
                </Animated.View>
                <Animated.Image style={{ height: magicHeight, width: '100%', borderRadius: 30, }} resizeMode='cover' source={partnerData[selectedPartner].cover_photo} />
            </Animated.View>


            <View style={{ alignItems: 'center', backgroundColor: '#f2f2f2', alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: 6, marginVertical: 6 }}>
                {!isOpenDates ?
                    <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#353431', fontFamily: 'Aristotelica-Regular', marginTop: 6 }}>closed today</Text>
                        <MaterialIcons style={{ marginLeft: 4 }} name="do-not-disturb" size={16} color="red" />
                    </View>
                    :
                    <>
                        {isOpenHours == null ?
                            <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#353431', fontFamily: 'Aristotelica-Regular', marginTop: 6 }}>Hours </Text>
                                <LottieView speed={1.5} style={{ height: 14, width: 14, alignSelf: 'center', margin: 0 }} source={require('../assets/loading.json')} autoPlay loop />
                            </View>
                            :
                            <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: '#353431', fontFamily: 'Aristotelica-Regular', marginTop: 6 }}>{isOpenHours ? 'open' : 'closed'}</Text>
                                <MaterialIcons style={{ marginLeft: 4 }} name={isOpenHours ? "check-circle-outline" : "do-not-disturb"} size={16} color={isOpenHours ? "green" : "red"} />
                                {hours && <Text style={{ fontFamily: 'PointSoftSemiBold', marginLeft: 4 }}>{hours[now.getDay()][0]}a - {hours[now.getDay()][1] % 12}p</Text>}
                            </View>
                        }
                    </>
                }
            </View>



            {/* {isOpenDates ? <Text style={{ fontFamily: 'PointSoftSemiBold', marginLeft: 4 }}>Open</Text> : <Text style={{ fontFamily: 'PointSoftSemiBold', marginLeft: 4 }}>Closed</Text>} */}


            <Animated.View style={{ borderRadius: 20, marginVertical: 0, marginTop: -8, height: slideValue, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, margin: 0, marginBottom: 0, width: '90%' }} >
                    {partner.blurb}
                </Text>
            </Animated.View>

            <SectionList
                showsVerticalScrollIndicator={false}
                onScroll={
                    Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                        {
                            useNativeDriver: false,
                            listener: event => {
                                const scrollOffset = event.nativeEvent.contentOffset.y
                                // console.log(scrollOffset);
                                scrollOffset > 10 ? slideUp('up') : slideUp('down')
                            }
                        }
                    )
                }
                stickySectionHeadersEnabled
                sections={partner.menu}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => {
                                if (!isOpenDates || !isOpenHours) {
                                    Alert.alert("Not Open", `Sorry, ${selectedPartner} is closed right now.`, [
                                        {
                                            text: 'OK',
                                            onPress: () => { console.log('ok selected'); },//alertAccepted = false,
                                        },
                                    ])
                                    return
                                }
                                setItem(item); navigation.navigate('Item', { selectedPartner })
                            }
                            }
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={{ fontSize: 17, marginBottom: 0, padding: 0, borderRadius: 20, fontFamily: 'PointSoftSemiBold' }}>{item.is_drink ? item.price.small.toFixed(2) : item.price}</Text>
                            </View>
                            <Text style={{ fontSize: 12, fontFamily: 'Aristotelica-Regular', color: '#333' }}>{item.description}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={{ backgroundColor: '#e6e6e6', fontFamily: 'Aristotelica-Regular', fontSize: 24, marginBottom: -10, padding: 10, borderRadius: 20, }}>
                        <Text style={styles.header}>{title}</Text>
                    </View>
                )}
            />

        </View>

    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
    },
    item: {
        // backgroundColor: '#f9c2ff',
        padding: 20,
        paddingBottom: 8,
        marginVertical: 8,
        fontFamily: 'Aristotelica-Regular',
        fontSize: 22, marginBottom: -10, padding: 16, borderRadius: 20


    },
    header: {
        fontFamily: 'Aristotelica-Regular',
        fontSize: 24, padding: 10, paddingBottom: -4, borderRadius: 20,


    },
    title: {
        fontFamily: 'Aristotelica-Regular',
        fontSize: 22, marginBottom: 0, padding: 0, borderRadius: 20,

    },
});