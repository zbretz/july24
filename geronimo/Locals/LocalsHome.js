import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, Modal } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { AntDesign, MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';
import LocalsCheckout from './LocalsCheckout';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default LocalsHome = ({ isConnected, masterState, navigation, basket, setBasket, partner, setPartner }) => {

    const comingSoonAlert = (type) => {
        Alert.alert('Coming soon', "This feature is not yet active. We're working on it! For help with orders, text Zach at 917-575-1955. Thanks!"
            , [{ text: 'Ok', onPress: () => { null } },])
    }

    const [showBasket, setShowBasket] = useState(false)
    let checkoutTotal = Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty * currentItem.price, 0)
    checkoutTotal = (Math.round(checkoutTotal * 100) / 100).toFixed(2);
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

    let openPaymentSheet = LocalsCheckout(basket, setBasket, masterState, navigation)

    return (



        <ScrollView style={{ backgroundColor: '#fff', height: '100%' }}>


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






            <View style={{ backgroundColor: '#FFCF56', margin: 20, marginBottom: 0, borderRadius: 40, padding: 10, paddingVertical: 30, }}>

                <View style={{ zIndex: 11, }}>
                    <TouchableOpacity style={{ position: 'absolute', top: 3, left: 0, }} onPress={() => navigation.goBack()}>
                        <MaterialIcons style={{ marginLeft: 10 }} name="arrow-back-ios" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{}}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 40, marginBottom: -14, textAlign: 'center' }} adjustsFontSizeToFit={true} numberOfLines={1}>   Locals Takeout</Text>
                </View>

                {masterState.user &&
                    <View style={{ marginTop: 20, }}>
                        <TouchableOpacity onPress={comingSoonAlert} style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 40, padding: 10, height: 50, backgroundColor: '#fff' }} >
                            <Text style={{ marginVertical: 0, fontSize: 18, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Order History</Text>
                        </TouchableOpacity>
                    </View>
                }

                {
                    masterState.user?.user_type === 'driver' &&
                    <View style={{ height: windowWidth * .2, width: windowWidth * .2, position: 'absolute', top: 0, right: 0,}}>
                        <View style={{ zIndex: 6, backgroundColor: 'transparent', borderBottomLeftRadius: 30, borderLeftWidth: windowWidth * .1, borderLeftColor: '#f4bb29', borderBottomWidth: windowWidth * .1, borderBottomColor: '#f4bb29', borderRightWidth: windowWidth * .1, borderTopWidth: windowWidth * .1, borderColor: 'transparent' }} />
                        <Entypo style={{ zIndex: 5, position: 'absolute', right: windowWidth * .02, top: windowWidth * .02 }} name="wallet" size={44} color="black" />
                        <View style={{ zIndex: 4, backgroundColor: '#f4bb29',position:'absolute', borderBottomLeftRadius: 30, borderRightWidth: windowWidth * .1, borderRightColor: 'white', borderTopWidth: windowWidth * .1, borderTopColor: 'white', borderLeftWidth: windowWidth * .1, borderBottomWidth: windowWidth * .1, borderColor: 'transparent' }} />
                        <Text style={{fontFamily: 'PointSoftSemiBold', fontSize: 12, zIndex: 8, position:'absolute',  right: windowWidth * .02 + 8, top: windowWidth * .02 + 44}}>${masterState.user.wallet.balance}</Text>
                    </View>
                }

            </View>


            <View style={{}}>


                <View style={{ zIndex: 100, width: '100%', }}>
                    {basket.items.length ?

                        <>
                            <Text style={{ fontWeight: 600, fontSize: 26, marginBottom: 0, padding: 20, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', marginBottom: 0 }}>My Basket</Text>
                            <View style={{ paddingHorizontal: 20, width: '100%', marginBottom: -20, }}>
                                <View style={{
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    backgroundColor: '#e6e6e6',
                                    borderRadius: 30,
                                    alignItems: 'center'
                                }}>
                                    <Image style={{ height: '80%', width: '30%', marginHorizontal: 10 }} resizeMode='contain' source={require('../assets/basket.png')} />

                                    <View style={{ padding: 10, paddingLeft: 0, flex: 1, borderTopRightRadius: 30, borderBottomRightRadius: 30, justifyContent: 'center' }}>

                                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 16, textAlign: 'center', marginBottom: 6 }}>{basket.partner}</Text>

                                        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 8, paddingHorizontal: 20 }}>
                                            {basket.items.map((item, idx) => {
                                                return (
                                                    <View key={idx} style={{ borderRadius: 20, width: '100%', marginBottom: 0, paddingVertical: 0, }}>
                                                        <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 12, }}>{item.name} <Text style={{ color: '#a9a9a9' }}>... </Text>{item.qty}</Text>
                                                    </View>
                                                )
                                            })}
                                        </View>

                                        <TouchableOpacity onPress={() => setShowBasket(true)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffcf56', borderRadius: 20, marginTop: 8, justifyContent: 'center' }}>
                                            <Text style={{ padding: 10, fontSize: 14, fontFamily: 'PointSoftSemiBold', textAlign: 'center' }}>Open Basket</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </>
                        :
                        <View style={{ flexDirection: 'row', margin: 20, marginBottom: -10, padding: 0, borderRadius: 30, borderColor: '#666', borderWidth: 0, justifyContent: 'center', alignItems: 'center', }}>
                            <Image style={{ height: '100%', width: '40%', marginHorizontal: 0, minHeight: 120 }} resizeMode='contain' source={require('../assets/food-package.png')} />
                            <Text style={{ flex: 3, padding: 0, fontFamily: 'Aristotelica-Regular', fontSize: 40, marginRight: 6 }} adjustsFontSizeToFit={true} numberOfLines={3} >Some of Park City's best local spots. Discover and order.</Text>
                        </View>
                    }




                    <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 20 }}>


                        <View style={{ flex: 1, marginRight: 20, }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Café</Text>

                            {/* <TouchableOpacity onPress={() => { setPartner(partnerData['Daily Rise']); navigation.navigate('Partner') }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}> */}
                            <TouchableOpacity onPress={() => { navigation.navigate('Partner', { selectedPartner: 'Daily Rise' }) }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/dailyrise.jpeg')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, bottom: 20, justifyContent: 'center', position: 'absolute' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Daily Rise</Text>
                                </View>
                            </TouchableOpacity>
                        </View>



                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Mediterranean</Text>

                            <TouchableOpacity onPress={() => { navigation.navigate('Partner', { selectedPartner: 'Nosh' }) }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/nosh.jpeg')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, bottom: 20, justifyContent: 'center', position: 'absolute' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Nosh</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>




                    <View style={{ flexDirection: 'row', marginTop: 10, marginHorizontal: 20 }}>


                        <View style={{ flex: 1, marginRight: 20, }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Lunch</Text>

                            <TouchableOpacity onPress={() => { navigation.navigate('Partner', { selectedPartner: "Clockwork" }) }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/Clockwork2.jpeg')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, bottom: 20, justifyContent: 'center', position: 'absolute' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Clockwork</Text>
                                </View>
                            </TouchableOpacity>
                        </View>



                        <View style={{ flex: 1, }}>
                            <Text style={{ fontWeight: 600, fontSize: 22, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>Bakery</Text>

                            <TouchableOpacity onPress={() => { navigation.navigate('Partner', { selectedPartner: "Auntie Ems" }) }} style={{ height: windowHeight * .22, borderRadius: 30, marginRight: 0, alignItems: 'center', paddingVertical: 0 }}>
                                <Image style={{ width: '100%', height: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/auntie_cover.jpg')} />
                                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, bottom: 20, justifyContent: 'center', position: 'absolute' }}>
                                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginBottom: -8 }}>Auntie Em's</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>




                </View>
            </View >

        </ScrollView>







    );
}

