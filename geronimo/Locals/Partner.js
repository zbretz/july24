import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, ScrollView, Alert, SectionList, Animated, Modal } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import partnerData from './LocalsData';
import LocalsCheckout from './LocalsCheckout';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Partner = ({ route, isConnected, masterState, navigation, item, setItem, basket, setBasket, partner, setPartner }) => {

    let { selectedPartner } = route.params

    // let hours = [[6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15], [6, 15]] // ordered sun (day 0) -> sat (day 6)
    const [hours, setHours] = useState(null)
    let now = new Date()

    const [isOpen, setIsOpen] = useState(null)

    const fetchPartnerData = () => {
        axios.get(`http://10.0.0.135:7100/locals/partnerData?partner=${selectedPartner}`)
            .then(res => {
                console.log('DATA: ', res.data)
                let hours = res.data
                setHours(hours)
                setIsOpen(now.getHours() >= hours[now.getDay()][0] && now.getHours() <= hours[now.getDay()][1])
            })
            .catch(e => console.log('order  error: ', e))
    }

    useEffect(() => {
        fetchPartnerData()
        setPartner(partnerData[selectedPartner])
    }, [selectedPartner])

    let scrollOffsetY = useRef(new Animated.Value(0)).current;
    console.log('scrollOFfset: ', scrollOffsetY)

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


    const changeQty = (item, amount) => {
        console.log('change qty item: ', item)
        console.log('change qty item name: ', item.name)
        setBasket(basket => {
            let idx = basket.items.findIndex(basketItem => basketItem.name == item.name && basketItem.temp == item.temp && basketItem.size == item.size)
            if (basket.items[idx].qty == 1 && amount == -1) {
                basket.items.splice(idx, 1)
            } else {
                basket.items[idx].qty = basket.items[idx].qty + amount
            }
            return { ...basket }
        })
    }

    let checkoutTotal = Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty * currentItem.price, 0)
    checkoutTotal = (Math.round(checkoutTotal * 100) / 100).toFixed(2);
    const [showBasket, setShowBasket] = useState(false)
    const basketLength = basket.items.length ? Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0) : 0

    let openPaymentSheet = LocalsCheckout(basket, setBasket, masterState, navigation)

    if (!partner) return

    return (
        <View style={{ height: '100%', backgroundColor: '#fff', padding: 20 }}>


            <Modal
                animationType='slide'
                transparent={true}
                visible={showBasket}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,0.88)', alignItems: 'center', justifyContent: 'center' }}>

                    <TouchableOpacity style={{ position: 'absolute', top: 80, left: 40, zIndex: 11 }} onPress={() => setShowBasket(false)}>
                        <Ionicons name="chevron-back-outline" size={36} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { console.log('close modal'); setShowBasket(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                    <View style={{ backgroundColor: '#fff', height: windowHeight * .9, borderRadius: 20, padding: 20, justifyContent: 'space-between', width: windowWidth * .9 }}>

                        <View>
                            <Image style={{ height: 60, width: 60, alignSelf: 'center' }} source={require('../assets/basket.png')} />
                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 10 }}>{basket.partner}</Text>
                        </View>

                        <View style={{ backgroundColor: '#f2f2f2', flex: 1, borderRadius: 20, padding: 20 }}>
                            {/* <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, }}>My Items</Text> */}
                            {basket.items.map((item, idx) => {
                                return (
                                    <View key={idx} style={{ borderRadius: 20, width: '100%', marginBottom: 10, paddingVertical: 0, }}>
                                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>

                                            <View style={{ flexDirection: 'row', flex: 3, alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap' }}>
                                                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 19, marginRight: 4 }}>{item.name}</Text>
                                                {item.is_drink &&
                                                    <View style={{ backgroundColor: '#e6e6e6', borderRadius: 10, paddingHorizontal: 6 }}>
                                                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 16, color: '#000', marginBottom: 1, }}>{item.size}, {item.temp}</Text>
                                                    </View>
                                                }
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', flex: 1 }}>
                                                <TouchableOpacity onPress={() => changeQty(item, -1)}>
                                                    <AntDesign style={{ marginRight: 13 }} name="minuscircleo" size={20} color="black" />
                                                </TouchableOpacity>
                                                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 19, }}>{item.qty}</Text>
                                                <TouchableOpacity onPress={() => changeQty(item, 1)}>
                                                    <AntDesign style={{ marginLeft: 13 }} name="pluscircleo" size={20} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 14, color: 'gray' }} numberOfLines={1}>{item.notes}</Text>

                                    </View>
                                )
                            })}
                        </View>

                        <TouchableOpacity onPress={openPaymentSheet} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#ffcf56', borderRadius: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0 }}>Checkout</Text>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0 }}>${checkoutTotal}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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


                <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 20, left: 16, backgroundColor: '#fff', height: 48, width: 48, zIndex: 98, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }} name="arrow-back-ios" size={24} color="black" >
                    <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={24} color="black" />
                </TouchableOpacity>

                <Animated.View style={{ position: 'absolute', zIndex: 100, bottom: 20, left: magicBottom, borderRadius: 30, backgroundColor: 'rgba(255,255,255,1)' }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 30, marginBottom: -10, padding: 16 }}>{selectedPartner}</Text>
                </Animated.View>
                <Animated.Image style={{ height: magicHeight, width: '100%', borderRadius: 30, }} resizeMode='cover' source={partnerData[selectedPartner].cover_photo} />
            </Animated.View>

            <View style={{ width: '100%', alignItems: 'center', }}>
                <View style={{ width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#353431', fontFamily: 'Aristotelica-Regular', marginTop: 6 }}>{isOpen ? 'open' : 'closed'}</Text>
                    <MaterialIcons style={{ marginLeft: 4 }} name={isOpen ? "check-circle-outline" : "do-not-disturb"} size={16} color={isOpen ? "green" : "red"} />
                </View>
            </View>

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
                            onPress={() => { setItem(item); navigation.navigate('Item', { selectedPartner }) }}
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