import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Image, Dimensions, AppState, SectionList, Animated, Modal, Alert } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { locals_url } from '../url_toggle'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default SitterPage = ({ route, isConnected, masterState, setMasterState, navigation, item, setItem, basket, setBasket, partner, setPartner }) => {



    return (
        <View style={{ width: '100%', height: '100%' }}>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CollapsibleView title="What are your rates?">
                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}><Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$25</Text>/hour when booking through with the Easy Book form above. Sitters have individual rates when they are requested specifically. Additional children add <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$5</Text>. </Text>
                    </View>
                </CollapsibleView>
            </View>


            <View style={{ marginVertical: 30, marginHorizontal: 10 }}>
                <View style={{}}>
                    <View style={{ borderRadius: 30, marginRight: 0, alignItems: 'center', paddingBottom: 30, borderWidth: 0 }}>
                        <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>F.A.Q</Text>



                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>What are your rates?</Text>
                        </View>

                        <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}><Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$25</Text>/hour when booking through with the Easy Book form above. Sitters have individual rates when they are requested specifically. Additional children add <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$5</Text>. </Text>
                        </View>


                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Who will I get?</Text>
                        </View>

                        <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>You're matched with a sitter based on availability. Every one of our sitters is trusted by families throughout Park City as a professional teacher and childcare provider.</Text>
                        </View>



                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>When will I receive confirmation?</Text>
                        </View>

                        <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>After you submit your booking, a member of the team will reach out to confirm within an hour.</Text>
                        </View>



                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Can I request a specific sitter?</Text>
                        </View>


                        <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Yep, go over to our sitters page and find your favorite person. Please note that sitters name their own rates when booked individually.</Text>
                        </View>


                        <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>I have more questions.</Text>
                        </View>


                        <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                            <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>You can call us directly at any time for questions or help of any sort.</Text>
                        </View>




                    </View>
                </View>
            </View>
        </View>
    );
}



const CollapsibleView = ({ title, children }) => {
    const [collapsed, setCollapsed] = useState(true);
    const [animation] = useState(new Animated.Value(0));

    const toggleCollapse = () => {
        if (collapsed) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false
            }).start();
        }
        setCollapsed(!collapsed);
    };

    const heightInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 200]
    });

    return (
        <View>
            <TouchableWithoutFeedback onPress={toggleCollapse}>

                <View style={{ backgroundColor: '#f2f2f2',  padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, }}>{title}</Text>
                </View>

            </TouchableWithoutFeedback>
            <Animated.View style={{ height: heightInterpolate }}>
                {children}
            </Animated.View>
        </View>
    );
};

