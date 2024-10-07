import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import LocalsCheckout from './LocalsCheckout';

import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default CheckoutModal = ({ basket, showBasket, setShowBasket, setBasket, openPaymentSheet, masterState }) => {

    let checkoutTotal = Object.values(basket.items).reduce((accumulator, currentItem) => accumulator + currentItem.qty * currentItem.price, 0)
    checkoutTotal = (Math.round(checkoutTotal * 100) / 100).toFixed(2);
    console.log('checkout total: ', checkoutTotal)

    let adjustWallet = false
    let walletAdjustedPrice = null
    if (masterState.user?.wallet?.balance) {
        adjustWallet = true
        walletAdjustedPrice = masterState.user?.wallet?.balance && (Math.round((Number(checkoutTotal) * 100) - Number(masterState.user.wallet.balance) * 100) / 100)
        walletAdjustedPrice = walletAdjustedPrice < 0 ? 0 : walletAdjustedPrice
        walletAdjustedPrice = (0 < walletAdjustedPrice) && (walletAdjustedPrice < .5) ? 0.5 : walletAdjustedPrice
        console.log('wallet adujsted price: ', checkoutTotal, walletAdjustedPrice, masterState.user?.wallet?.balance)
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

    const emojisWithIcons = [
        { title: 'Asap', icon: 'emoticon-happy-outline' },
        { title: '20 mins', icon: 'clock' },
        { title: '40 mins', icon: 'clock' },
    ];

    return (
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


                    <SelectDropdown
                        data={emojisWithIcons}
                        onSelect={(selectedItem, index) => {
                            console.log(selectedItem, index);
                            setBasket(basket => {

                                return { ...basket, pickupTime: selectedItem.title }
                            })
                        }}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    {selectedItem && (
                                        <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.title) || 'Select Pickup Time'}
                                    </Text>
                                    {!(selectedItem && selectedItem.title) && <Text>20 mins</Text>}
                                    {(selectedItem && selectedItem.title == 'Asap') && <Text>We'll try our best!</Text>}
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />

                    {adjustWallet ?
                        <TouchableOpacity onPress={openPaymentSheet} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#ffcf56', borderRadius: 30, width: '100%', }}>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', }}>
                                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 11, marginBottom: 0 }}>Wallet Applied</Text>
                                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 14, marginBottom: 0, textDecorationLine: 'line-through' }}>${checkoutTotal}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0 }}>Checkout</Text>
                                <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0 }}>${walletAdjustedPrice.toFixed(2)}</Text>
                            </View>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={openPaymentSheet} style={{ marginTop: 10, padding: 14, paddingHorizontal: 40, alignSelf: 'center', backgroundColor: '#ffcf56', borderRadius: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0 }}>Checkout</Text>
                            <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 20, marginBottom: 0 }}>${checkoutTotal}</Text>
                        </TouchableOpacity>
                    }

                </View>
            </View>
        </Modal>

    )
}




const styles = StyleSheet.create({
    dropdownButtonStyle: {
        // width: 200,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginTop: 10
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
});