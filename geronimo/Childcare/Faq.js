import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, Linking, Pressable } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { Feather, Ionicons } from '@expo/vector-icons';

export default Faq = ({ navigation }) => {
    // export default ChildcareHome = ({ isConnected, masterState, setMasterState, navigation, basket, setBasket, partner, setPartner }) => {

    return (
        <View>

            <View style={{ width: '100%', }}>
                <View style={{ marginVertical: 0, marginHorizontal: 0 }}>
                    <View style={{}}>
                        <View style={{ borderRadius: 30, marginRight: 0, alignItems: 'center', paddingBottom: 30, borderWidth: 0 }}>
                            <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>F.A.Q</Text>


                            {/* <View style={{ width: '100%' }}>
                                <CollapsibleView title="What are the sitters' rates?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}><Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$25</Text>/hour when booking through the Easy Book form above. Sitters have individual rates when they are requested specifically. Additional children add <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$5</Text>. </Text>
                                    </View>
                                </CollapsibleView>
                            </View> */}

                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="Which sitter will I get?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0, width: '90%', }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>When using Easy Book, you're matched based on sitter availability. If there's a particular sitter you'd like to book with, you can navigate to <Text onPress={() => navigation.navigate('SitterList')} style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#ffcf56', backgroundColor:'#ffebb3',}}>their profile</Text> and book them directly that way!</Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="Can I request a specific sitter?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Yep, go over to our <Text onPress={() => navigation.navigate('SitterList')} style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, textDecorationLine: 'underline', textDecorationColor: '#ffcf56', backgroundColor:'#ffebb3',}}>sitters page</Text> and find your favorite person. Please note that sitters name their own rates when booked individually.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="How many children per booking?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Our sitters are able to watch up to four children at a time. Remember, they have professional experience safely caring for groups of children in daycare environments.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>

                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="When will I receive confirmation?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>After you submit your booking, a member of the team will reach out to confirm with you.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="I have more questions!">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, marginTop: -4 }}>
                                            <TouchableOpacity onPress={() => { Linking.openURL(`tel:${9175751955}`) }} style={{ marginRight: 6, borderRadius: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#ffcf56', paddingHorizontal: 9, paddingVertical: 6, marginTop: -4 }}>
                                                <Feather style={{}} name="phone" size={22} color="#000" /><Text style={{ fontSize: 20 }}> Call us</Text>
                                            </TouchableOpacity>
                                            <Text style={{}}>directly at any time with questions or for help of any sort.</Text>
                                        </Text>
                                    </View>

                                </CollapsibleView>
                            </View>


                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}




const CollapsibleView = ({ title, children }) => {

    if (Platform.OS === 'ios') {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    const [collapsed, setCollapsed] = useState(false);


    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <View>
            <TouchableWithoutFeedback onPress={toggleCollapse}>
                <View style={{ backgroundColor: '#f2f2f2', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20, }}>{title}</Text>
                </View>
            </TouchableWithoutFeedback>
            {collapsed &&
                <View style={{}}>
                    {children}
                </View>
            }
        </View>
    );
};