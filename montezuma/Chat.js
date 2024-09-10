import { useState, useEffect, useRef, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, Image, TextInput, ScrollView, Platform, } from 'react-native';
import { socket } from "./socket";
import { Feather } from '@expo/vector-icons';

// import fetchPushToken from './fetchPushToken';
import useKeyboard from './useKeyboard';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { useFocusEffect } from '@react-navigation/native';


export default Chat = ({ route, navigation, masterState, setMasterState, isConnected, }) => {

    const { rideId } = route.params;
    console.log(rideId)
    console.log(masterState.myScheduledRides)
    let rideDetail = masterState.myScheduledRides.find(ride => ride._id == rideId)
    const { user } = masterState
    const chatLog = rideDetail.chatLog
    const [text, setText] = useState("")

    let keyboardHeight = useKeyboard()

    const sendMessage = async () => {
        socket.emit('message', { toUser: true, userid: rideDetail.user._id, driverid: user._id, rideid: rideDetail._id, text, createdAt: Date.now() })
        setText("")
    }

    useFocusEffect(
        useCallback(() => {
            if (masterState.unreadMessage) setMasterState(masterState => ({ ...masterState, unreadMessage: null }))
        }, [masterState])
    )

    useEffect(() => {
        setTimeout(() => scrollviewRef.current.scrollToEnd({ animated: true }), 50) // the set timeout (i think) allows time for chat log to load before scrolling to bottom.
    }, [masterState])

    const scrollviewRef = useRef()

    return (

        <View style={{ padding: 20,paddingTop:30,bottom:10, zIndex: 20, maxHeight: windowHeight - 120, paddingBottom: Platform.OS == 'ios' ? keyboardHeight - 80 : 0, width: '100%', backgroundColor: 'rgba(0,0,0,0)', }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', position: 'absolute', top: 20, right: 20 }}>
                <View style={{ height: 9, width: 9, borderRadius: 30, backgroundColor: isConnected ? '#85ba78' : 'red' }}></View>
            </View>

            <TouchableOpacity style={{ position: 'absolute', top: 20, left: 20, zIndex: 11 }} onPress={() => navigation.goBack()}>
                <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={36} color="black" />
            </TouchableOpacity>

            <ScrollView ref={scrollviewRef} showsVerticalScrollIndicator={false} style={{ height: windowHeight, paddingTop: 20 }}>

                {chatLog && chatLog.map((comment, idx) => {
                    let is_sender = comment.toUser
                    return (
                        <View key={idx} style={{ marginBottom: 10, }}>
                            <View key={idx} style={{ alignSelf: is_sender ? 'flex-end' : 'flex-start' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                    {is_sender ?
                                        <>
                                            {/* <Text style={{ fontSize: 15, color: '#fff', }}>{moment.unix(comment.createdAt / 1000).format('ddd h:mm A')}</Text> */}
                                            <Text style={{ fontWeight: 'bold', color: 'blue', marginBottom: 2, marginLeft: 20, }}>{"me"}</Text>
                                        </>
                                        :
                                        <>
                                            <Text style={{ fontWeight: 'bold', color: '#000', marginBottom: 2, marginRight: 20, }}>{comment.user}</Text>
                                            {/* <Text style={{ fontSize: 15, color: '#fff', }}>{moment.unix(comment.createdAt / 1000).format('ddd h:mm A')}</Text> */}
                                        </>
                                    }
                                </View>
                                <View style={{ padding: 6, paddingHorizontal: 10, backgroundColor: is_sender ? '#d7e1d0' : '#f3f3f1', borderRadius: 16, maxWidth: '80%', borderWidth: 0, borderColor: 'white', alignSelf: is_sender ? 'flex-start' : 'flex-end' }}>
                                    <Text selectable={true} style={{ fontSize: 17, fontWeight: '500', color: is_sender ? '#000' : '#000' }}>{comment.text}</Text>
                                </View>
                            </View>
                        </View>
                    )
                })}

                <View style={{ height: 16 }} />


                
            </ScrollView>

            {!chatLog?.length && <View style={{ position: 'absolute', bottom: windowHeight * .5, alignSelf: 'center' }}><Text style={{ color: '#77756e', fontSize: 20, }}>Chat with us</Text></View>}

            <View style={{
                backgroundColor: 'rgba(0,0,0,0)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingTop: 0, marginBottom: 20
            }}>
                <TextInput
                    // autoFocus={true}
                    // placeholder="Eg. 'Main Street', 'Canyons Base Area'"
                    multiline={true}
                    placeholderTextColor={'#000'}
                    textAlignVertical='top'
                    value={text}//{cancelationReason}
                    onChangeText={(text) => setText(text)}
                    style={{ maxHeight: 120, minHeight: 40, fontSize: 18, backgroundColor: '#fff', width: windowWidth - 60, borderWidth: 2, borderColor: '#cececa', borderRadius: 40, padding: 15, paddingTop: 9 }}
                />
                <TouchableOpacity
                    onPress={() => sendMessage()}
                    style={{ padding: 8, borderRadius: 20, backgroundColor: '#b7caaa', marginLeft: 10, }} >
                    <Image style={{ height: 24, width: 24, }} source={require('./assets/icons8-up-arrow-48.png')} />
                </TouchableOpacity>
            </View>


        </View>





    )
}


