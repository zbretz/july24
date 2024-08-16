import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, ScrollView, Alert, SectionList, Animated, Modal } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default DailyRise = ({ route, isConnected, masterState, navigation, item, setItem, basket }) => {

    const DATA = [
        {
            title: 'Espresso Drinks',
            data: [
                { choice: 0, name: 'Latte', description: 'Espresso with steamed milk', price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
                { choice: 0, name: 'Mocha', description: 'Espresso with steamed milk', price: { 'small': 4.95, 'medium': 5.95, 'large': 6.95 } },
            ],
        },
        {
            title: 'Chai',
            data:
                [
                    { choice: 0, name: 'Chai Latte', description: 'Chai tea with steamed milk', is_drink: true, menu_price: 4.42, },
                    { choice: 1, name: 'Chai Charger', description: 'Chai Latte with Espresso', is_drink: true, menu_price: 4.94, },
                    { choice: 2, name: 'Sugar Free Chai Latte', description: 'Chai - but sugar free!', is_drink: true, menu_price: 4.30, },
                    { choice: 3, name: 'Sugar Free Chai Charger', description: '', is_drink: true, menu_price: 4.85, },
                    { choice: 4, name: 'Mountain Chiller Chai Charger', description: '', is_drink: true, menu_price: 4.94, },
                    { choice: 5, name: 'Mountain Chiller Chai Latte', description: '', is_drink: true, menu_price: 5.15, },
                ],
        },
        {
            title: 'Coffee, Cocoa, & Tea',
            data:
                [
                    { choice: 0, name: 'Cold Brew', description: '', is_drink: true, menu_price: 2.60, },
                    { choice: 1, name: 'Drip Coffee', description: '', is_drink: true, menu_price: 2.60, },
                    { choice: 2, name: 'Hot Chocolate', description: '', is_drink: true, menu_price: 3.64, },
                    { choice: 3, name: 'Hot Tea', description: 'Varieties of Organic Rishi Tea', is_drink: true, menu_price: 2.81, },
                    { choice: 4, name: 'London Fog', description: '', is_drink: true, menu_price: 3.75, },
                    { choice: 5, name: 'Matcha', description: '', is_drink: true, menu_price: 5.15, },
                ],
        },
    ];


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

    const [slideValue] = useState(new Animated.Value(100));
    const slideUp = (selection) => {

        Animated.spring(slideValue, {
            toValue: selection == 'up' ? 0 : 100,
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
                                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 19, flex: 3 }}>{item.name} {item.size} {item.temp}</Text>
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
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#00a1ff', borderRadius: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
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
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 30, marginBottom: -10, padding: 16 }}>Daily Rise</Text>
                </Animated.View>
                <Animated.Image style={{ height: magicHeight, width: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/dailyrise.jpeg')} />
            </Animated.View>

            <Animated.View style={{ backgroundColor: '#fff', borderRadius: 20, marginVertical: 10, height: slideValue, alignItems: 'center', }}>
                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, margin: 20, marginBottom: -6, height: '100%', width: '90%' }} >
                    Located inside of The Market, this is our favorite place in all of Park City to get a coffee.
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
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <TouchableOpacity
                            onPress={() => { setItem(item); navigation.navigate('Item', { partner: null }) }}
                        >
                            <Text style={styles.title}>{item.name}</Text>
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
        marginVertical: 8,
        fontFamily: 'Aristotelica-Regular',
        fontSize: 22, marginBottom: -10, padding: 16, borderRadius: 20


    },
    header: {
        fontFamily: 'Aristotelica-Regular',
        fontSize: 24, padding: 10, paddingBottom: -4, borderRadius: 20,


    },
    title: {
        fontSize: 24,
        fontFamily: 'Aristotelica-Regular',
        fontSize: 22, marginBottom: 0, padding: 0, borderRadius: 20,

    },
});