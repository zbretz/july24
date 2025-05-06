import { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput, ScrollView, Platform, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socket } from "../CoreNav/socket";
import { Entypo, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import useKeyboard from '../useKeyboard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useFocusEffect } from '@react-navigation/native';


export default Chat = ({ navigation, route, masterState, setMasterState, isConnected, }) => {

    const { user } = masterState
    const { rideId } = route.params;
    console.log(rideId)

    let rideDetail = user.activeRides.find(ride => ride._id == rideId)
    const chatLog = rideDetail.chatLog

    let keyboardHeight = useKeyboard()
    const [text, setText] = useState("")
    const scrollviewRef = useRef()

    const sendMessage = async () => {
        socket.emit('message', { toDriver: true, userid: user._id, driverid: rideDetail.driver._id, rideid: rideDetail._id, text, createdAt: Date.now() })
        setText("")
    }

    useEffect(() => {
        setTimeout(() => scrollviewRef.current.scrollToEnd({ animated: true }), 50) // the set timeout (i think) allows time for chat log to load before scrolling to bottom.
    }, [masterState])

    return (

        <View style={{ padding: 20, position: 'absolute', bottom: 0, zIndex: 20, maxHeight: windowHeight - 60, paddingBottom: Platform.OS == 'ios' ? keyboardHeight - 10 : 0, width: '100%', backgroundColor: '#fff', }}>

            <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={36} color="black" />
            </TouchableOpacity>

            <ScrollView ref={scrollviewRef} showsVerticalScrollIndicator={false} style={{ height: windowHeight, paddingTop: 20, backgroundColor: '#fff', }}>

                {chatLog && chatLog.map((comment, idx) => {
                    let is_sender = comment.toDriver
                    return (
                        <View key={idx} style={{ marginBottom: 10 }}>
                            <View key={idx} style={{ alignSelf: is_sender ? 'flex-end' : 'flex-start' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    {is_sender ?
                                        <>
                                            {/* <Text style={{ fontSize: 15, color: '#fff', }}>{moment.unix(comment.createdAt / 1000).format('ddd h:mm A')}</Text>  */}
                                            <Text style={{ fontWeight: 'bold', color: '#000', marginBottom: 2, marginLeft: 20, }}>{"me"}</Text>
                                        </>
                                        :
                                        <>
                                            <Text style={{ fontWeight: 'bold', color: '#000', marginBottom: 2, marginRight: 20, }}>{comment.driver}</Text>
                                            {/* <Text style={{ fontSize: 15, color: '#fff', }}>{moment.unix(comment.createdAt / 1000).format('ddd h:mm A')}</Text>  */}
                                        </>
                                    }
                                </View>
                                <View style={{ padding: 8, paddingHorizontal: 10, backgroundColor: is_sender ? '#e6e6e6' : '#f2f2f2', borderRadius: 20, maxWidth: '80%', borderWidth: 0, borderColor: 'white', alignSelf: is_sender ? 'flex-start' : 'flex-end' }}>
                                    <Text selectable={true} style={{ fontSize: 19, fontWeight: '500', color: is_sender ? '#000' : '#000', fontFamily: 'LexendRegular', marginBottom: -0 }}>{comment.text}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}

                <View style={{ height: 16 }} />
            </ScrollView>


            {!chatLog?.length && <View style={{ position: 'absolute', bottom: windowHeight * .5, alignSelf: 'center' }}><Text style={{ color: '#77756e', fontSize: 20, }}>Chat with us</Text></View>}

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 0, marginBottom: 20, width: windowWidth * .9 }}>
                <TextInput
                    // autoFocus={true}
                    multiline={true}
                    placeholderTextColor={'#a1a1a1'}
                    placeholder='Message'
                    textAlignVertical='top'
                    value={text}
                    onChangeText={(text) => setText(text)}
                    style={{ maxHeight: 120, fontSize: 18, backgroundColor: '#fff', flex: 1, borderWidth: 1.5, borderColor: '#000', borderRadius: 40, padding: 10, fontFamily: 'LexendRegular', }}
                />
                <TouchableOpacity
                    onPress={() => sendMessage()}
                    style={{ padding: 16, borderRadius: 20, backgroundColor: '#ffcf56', marginLeft: 10 }} >
                    <FontAwesome name="send" size={18} color="#000" />
                </TouchableOpacity>
            </View>


        </View>



    )
}





const styles = StyleSheet.create({

    bottomTabs: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: 20,
        paddingHorizontal: 20,
        width: windowWidth,
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
        // width: '100%',
        color: '#ccc',
        fontWeight: 'bold'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },

});