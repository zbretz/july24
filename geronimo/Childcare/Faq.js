import { StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Platform, LayoutAnimation, TextInput, } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';

export default Faq = () => {
    // export default ChildcareHome = ({ isConnected, masterState, setMasterState, navigation, basket, setBasket, partner, setPartner }) => {

    return (
        <View>
     
            <View style={{ width: '100%', }}>
                <View style={{ marginVertical: 0, marginHorizontal: 10 }}>
                    <View style={{}}>
                        <View style={{ borderRadius: 30, marginRight: 0, alignItems: 'center', paddingBottom: 30, borderWidth: 0 }}>
                            <Text style={{ fontWeight: 600, fontSize: 32, marginTop: 20, padding: 0, paddingBottom: 0, fontFamily: 'Aristotelica-Regular', }}>F.A.Q</Text>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="Which sitter will I get?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0, width: '90%', }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>You're matched with a sitter based on availability. Every one of our sitters is trusted by families throughout Park City as a professional teacher and childcare provider.</Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="What are the sitters' rates?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}><Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$25</Text>/hour when booking through the Easy Book form above. Sitters have individual rates when they are requested specifically. Additional children add <Text style={{ fontFamily: 'PointSoftSemiBold', fontSize: 18 }}>$5</Text>. </Text>
                                    </View>
                                </CollapsibleView>
                            </View>


                            <View style={{ width: '100%' }}>
                                <CollapsibleView title="Can I request a specific sitter?">
                                    <View style={{ padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginLeft: 20, justifyContent: 'center', marginTop: 0 }}>
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>Yep, go over to our sitters page and find your favorite person. Please note that sitters name their own rates when booked individually.</Text>
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
                                        <Text style={{ fontFamily: 'Aristotelica-Regular', fontSize: 20 }}>And we have answers! Call us directly at any time for questions or help of any sort.</Text>
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