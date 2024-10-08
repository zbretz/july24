import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, Dimensions } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigationContainerRef, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocalsHome from './LocalsHome';
import OrderHistory from './OrderHistory'
// import DailyRise from './DailyRise';
import Partner from './Partner';
import Item from './Item';
import { StripeProvider } from '@stripe/stripe-react-native';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Stack = createStackNavigator();

export default LocalsNav = ({ isConnected, masterState, setMasterState, chatLog, setChatLog, navigation }) => {

    const [basket, setBasket] = useState({
        partner: null, items: [], pickupTime: '20 mins'
    })

    const [item, setItem] = useState(null)
    const [partner, setPartner] = useState(null)

    const [modalVisible, setModalVisible] = useState(false)
    useFocusEffect(
        useCallback(() => {
            let modalTimeout = setTimeout(() => setModalVisible(!!masterState.localsDisabled), 500)
            return () => clearTimeout(modalTimeout)
        }, [])
    )

    return (
        <StripeProvider
            // publishableKey="pk_test_51Nj9WRAUREUmtjLCVtihPOMA6K9A28JW0goEfBW14Poj6Y6AJJUBBXcHhwUfrTsEQEJ15S26FBGDGbkVjm84x8f900VG5onWlT"
            publishableKey="pk_live_51Nj9WRAUREUmtjLCliIgWk6tgmUXBHSOGsmmaNIC6Tb9UT4BVNEAK40DNXsrljEJHLHxJsj0CyU0qdU5ozO4I1Eb00SdEyvrQ9"
        >

            <Modal
                animationType='slide'
                transparent={true}
                visible={modalVisible}
                style={{ height: windowHeight, width: windowWidth, }}>
                <View style={{ height: windowHeight, width: windowWidth, backgroundColor: 'rgba(0,0,0,.6)', }}>
                    <TouchableOpacity onPress={() => { setModalVisible(false); navigation.goBack() }} style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'transparent', }} />
                    <View style={{ width: windowWidth * .9, backgroundColor: '#f2f2f2', alignItems: 'center', justifyContent: 'center', top: windowHeight * .1, alignSelf: 'center', borderRadius: 40, padding: 20, }}>
                        <View style={{ marginTop: 0, padding: 30, backgroundColor: '#e6e6e6', borderRadius: 30, alignItems: 'center', }}>
                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', marginBottom: 20 }}>{masterState.localsDisabled && masterState.localsDisabled[0]}</Text>
                            <Image source={require('../assets/cooking.png')} style={{ height: windowWidth * .5, width: windowWidth * .5, marginTop: -30, backgroundColor: null }} />
                            <Text style={{ fontSize: 20, color: '#353431', textAlign: 'center', fontFamily: 'Aristotelica-Regular', }}>{masterState.localsDisabled && masterState.localsDisabled[1]}</Text>
                            <TouchableOpacity style={{ padding: 14, backgroundColor: '#ffcf56', borderRadius: 20, marginTop: 30 }} onPress={() => { setModalVisible(false); navigation.goBack() }}>
                                <Text style={{ fontSize: 18, fontFamily: 'Aristotelica-Regular', marginBottom: -8 }}>Go Back</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>


            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="LocalsHome">
                    {props => <LocalsHome {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
                <Stack.Screen name="OrderHistory" options={{ presentation: "modal" }}>
                    {props => <OrderHistory {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} />}
                </Stack.Screen>
                {/* <Stack.Screen name="DailyRise" options={{ presentation: "modal" }}>
                    {props => <DailyRise {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} partner={partner} setPartner={setPartner} />}
                </Stack.Screen> */}
                <Stack.Screen name="Partner" options={{ presentation: "modal" }}>
                    {props => <Partner {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} partner={partner} setPartner={setPartner} />}
                </Stack.Screen>
                <Stack.Screen name="Item" options={{ presentation: "modal" }}>
                    {props => <Item {...props} masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} basket={basket} setBasket={setBasket} item={item} setItem={setItem} />}
                </Stack.Screen>


            </Stack.Navigator>
        </StripeProvider>
    )
}