import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Entypo, Feather, Octicons, FontAwesome5, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import LocalsCheckout from './LocalsCheckout';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default Item = ({ route, isConnected, masterState, navigation, basket, setBasket, item, setItem }) => {

    let { selectedPartner } = route.params

    console.log('basket: ', basket)
    console.log('selected partner: ', selectedPartner)

    const [size, setSize] = useState('medium')
    const [temp, setTemp] = useState('hot')
    const [notes, setNotes] = useState(null)

    console.log('item!!!!!!!!!: ', item)


    const [inputFocused, setInputFocused] = useState(false)
    const inputRef = useRef(null);

    const [showBasket, setShowBasket] = useState(false)
    const [showItemConfirmation, setShowItemConfirmation] = useState(false)

    const addToBasket = async () => {

        if (!masterState.user) {

            Alert.alert('Please Sign In', `Thanks for using The Park City App! \n To complete your order, first sign in.`, [
                {
                    text: 'Go', onPress: () => { navigation.navigate('Account') }
                }
            ])

        } else {

            if (basket && basket.partner && (selectedPartner !== basket.partner)) {

                async function waitForAlertResponse() {

                    return new Promise((resolve, reject) => {
                        Alert.alert('Your cart', `Your basket contains items from ${basket.partner}. Would you like to clear your basket and add this item?`, [
                            {
                                text: 'Yes, replace items.', onPress: () => {
                                    setBasket({
                                        partner: selectedPartner,
                                        items: []
                                    })
                                    resolve()
                                }
                            },
                            {
                                text: 'No, keep existing items.', onPress: () => { return }
                            }
                        ])
                    })
                }
                await waitForAlertResponse()
            }

            console.log('all items: ', basket)

            if (item.is_drink) {
                setBasket(basket => {
                    let idx = basket.items.findIndex(basketItem => basketItem.name == item.name && basketItem.temp == temp && basketItem.size == size)
                    if (idx == -1) {
                        basket.items.push({ ...item, price: item.price[size], temp, size, qty: 1, notes })
                    } else {
                        basket.items[idx] = { ...basket.items[idx], qty: basket.items[idx].qty + 1, notes }
                    }
                    return { ...basket, partner: selectedPartner }
                })
            } else {
                setBasket(basket => {
                    let idx = basket.items.findIndex(basketItem => basketItem.name == item.name)
                    if (idx == -1) {
                        basket.items.push({ ...item, price: item.price, qty: 1, notes })
                    } else {
                        basket.items[idx] = { ...basket.items[idx], qty: basket.items[idx].qty + 1, notes }
                    }
                    return { ...basket, partner: selectedPartner }
                })
            }


            setShowItemConfirmation(true)
        }
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
    // let checkoutTotal = 1
    console.log('checkout total: ', checkoutTotal)
    const basketLength = basket.items.length ? Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty, 0) : 0

    let openPaymentSheet = LocalsCheckout(basket, setBasket, masterState, navigation)

    return (

        <>

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






            <Modal
                animationType='slide'
                transparent={true}
                visible={showItemConfirmation}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,0.88)', alignItems: 'center', justifyContent: 'center' }}>


                    <TouchableOpacity onPress={() => { console.log('close modal'); setShowItemConfirmation(false) }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />

                    <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, justifyContent: 'space-between', width: windowWidth * .9 }}>

                        <View>
                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 0 }}>{basket.partner}</Text>
                            <Text style={{ fontSize: 26, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 10 }}>Item Added</Text>
                        </View>

                        <View style={{ backgroundColor: '#f2f2f2', borderRadius: 20, padding: 10 }}>
                            <Text style={{ fontSize: 32, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', margin: 10, marginBottom: -4 }}>{item.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { setShowBasket(true); setShowItemConfirmation(false) }} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#00a1ff', borderRadius: 30, width: '100%', }}>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0, textAlign: 'center', color: '#fff' }}>View Cart</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowItemConfirmation(false) }} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#00a1ff', borderRadius: 30, width: '100%', }}>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0, textAlign: 'center', color: '#fff' }}>Keep Shopping</Text>
                        </TouchableOpacity>




                    </View>
                </View>
            </Modal>






            <View style={{ height: '100%', backgroundColor: '#fff', padding: 20 }}>

                <View style={{ backgroundColor: null, zIndex: 20, marginBottom: 4 }}>
                    <TouchableOpacity style={{ zIndex: 11, borderRadius: 30, backgroundColor: 'rgba(255,255,255,.8)' }} onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back-outline" size={36} color="black" />
                    </TouchableOpacity>
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
                </View>

                <View>



                    <View style={{ position: 'absolute', zIndex: 10, bottom: 20, left: 20, borderRadius: 30, backgroundColor: 'rgba(255,255,255,1)' }}>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 30, marginBottom: -10, padding: 16 }}>{item.name}</Text>
                    </View>



                    <Image style={{ height: windowHeight * .25, width: '100%', borderRadius: 30, }} resizeMode='cover' source={require('../assets/dailyrise.jpeg')} />
                </View>

                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 17, marginTop: 10, color: '#333' }}>{item.description}</Text>

                {item.is_drink &&
                    <>
                        {!inputFocused &&
                            <>
                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginTop: 10 }}>Size</Text>

                                <View style={{ flexDirection: 'row', width: '100%', marginVertical: 0, }}>
                                    <TouchableOpacity onPress={() => {
                                        setSize('small')
                                    }} style={{ backgroundColor: size == 'small' ? '#ffcf56' : '#f2f2f2', padding: 14, borderRadius: 20, flex: 1 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginBottom: -4, textAlign: 'center' }}>Small</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setSize('medium')
                                    }} style={{ backgroundColor: size == 'medium' ? '#ffcf56' : '#f2f2f2', padding: 14, borderRadius: 20, flex: 1 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginBottom: -4, textAlign: 'center' }}>Medium</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setSize('large')
                                    }} style={{ backgroundColor: size == 'large' ? '#ffcf56' : '#f2f2f2', padding: 14, borderRadius: 20, flex: 1 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginBottom: -4, textAlign: 'center' }}>Large</Text>
                                    </TouchableOpacity>
                                </View>


                                <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginTop: 10 }}>Drink Temp</Text>


                                <View style={{ flexDirection: 'row', width: '66.6%', marginVertical: 0, }}>
                                    <TouchableOpacity onPress={() => {
                                        setTemp('hot')
                                    }} style={{ backgroundColor: temp == 'hot' ? '#ffcf56' : '#f2f2f2', padding: 14, borderRadius: 20, flex: 1 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginBottom: -4, textAlign: 'center' }}>Hot</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => {
                                        setTemp('cold')
                                    }} style={{ backgroundColor: temp == 'cold' ? '#ffcf56' : '#f2f2f2', padding: 14, borderRadius: 20, flex: 1 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 18, marginBottom: -4, textAlign: 'center' }}>Cold</Text>
                                    </TouchableOpacity>
                                </View>


                            </>
                        }
                    </>

                }

                <View style={{ backgroundColor: '#f2f2f2', marginVertical: 10, padding: 10, borderRadius: 20, width: '100%', }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 22, marginTop: 10 }}>Notes</Text>
                    <View style={{ backgroundColor: '#fff', borderRadius: 20 }}>

                        <TextInput style={{ maxHeight: 80, borderRadius: 16, backgroundColor: '#fff', padding: 8, fontSize: 20, fontFamily: 'PointSoftSemiBold', marginBottom: 0 }}
                            ref={inputRef}
                            autoCapitalize={'none'}
                            placeholderTextColor={'#d3d3d3'}
                            onFocus={() => setInputFocused(true)}
                            onBlur={() => { setInputFocused(false); }}
                            placeholder={'no notes'}
                            value={notes}
                            onChangeText={(text) => { setNotes(text) }}
                        // multiline={true}
                        />

                    </View>
                </View>

                {!inputFocused &&
                    <TouchableOpacity onPress={() => { addToBasket(); setNotes(null); }} style={{ backgroundColor: '#ffcf56', alignSelf: 'flex-start', marginVertical: 10, borderRadius: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14 }}>
                        {/* <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 24, marginBottom: -6, alignSelf: 'center', padding: 20, }}>Add to Basket</Text>
                        <Text style={{ fontSize: 20, borderRadius: 20, fontFamily: 'PointSoftSemiBold', position: 'absolute', left: 0, bottom: 1, padding: 20, }}> <Text style={{ fontSize: 18 }}>$</Text>{item.is_drink ? item.price[size] : item.price}</Text> */}
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 24, marginBottom: -6, alignSelf: 'center', padding: 20, }}>Add to Basket</Text>
                        <Text style={{ fontSize: 20, borderRadius: 20, fontFamily: 'PointSoftSemiBold', bottom: 1, padding: 20, }}> <Text style={{ fontSize: 18 }}>$</Text>{item.is_drink ? item.price[size].toFixed(2) : item.price}</Text>
                    </TouchableOpacity>
                }

            </View>
        </>

    );
}



