import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, SafeAreaView, ScrollView, Animated } from 'react-native';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RideType from '../ScheduleRides/RideType';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Feather } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Stack = createStackNavigator();

export default LocationInput = ({ isConnected, masterState, navigation, address, setAddress }) => {

    const [translateValue] = useState(new Animated.Value(windowWidth * .5));
    const [translateValue2] = useState(new Animated.Value(100));


    const [thing, setThing] = useState(false)


    const animateTab = (selection) => {
        Animated.spring(translateValue, {
            toValue: selection == 'shrink' ? 100 : 200,
            // velocity: 10,
            // speed:2,
            useNativeDriver: false,
            // bounciness:4,
            friction: 20
            // }).start();

            // }).start(({ finished }) => finished && setThing(true));
        }).start()

        setThing(true);

    }

    const animateTab2 = (selection) => {
        Animated.spring(translateValue2, {
            toValue: selection == 'shrink' ? 100 : 100,
            // velocity: 10,
            // speed:2,
            useNativeDriver: false,
            // bounciness:4,
            friction: 20
            // }).start();

            // }).start(({ finished }) => finished && setThing(true));
        }).start()

        setThing(true);

    }

    const [date, setDate] = useState(new Date(1598051730000));


    return (
        <View style={{ height: '100%', }}>
            <Animated.View style={{ height: 100, width: '100%', }}>
                <Image style={{ height: '100%', width: '100%', borderRadius: 0 }} source={require('./assets/9.jpeg')} />
                <Text style={{ color: 'white', position: 'absolute', padding: 0, fontWeight: '600', fontSize: 42, bottom: 10, left: 20 }}>Airport Ride</Text>
            </Animated.View>
            <View style={{ padding: 20 }}>
                {/* <Text style={{ color: 'black', padding: 10, paddingBottom: 0, fontWeight: '600', fontSize: 22 }}>Airport Ride</Text> */}

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather style={{ marginBottom: 0 }} name="arrow-left-circle" size={32} color="black" />
                </TouchableOpacity>


                <Text style={{ marginTop: 14, marginBottom: 6, fontSize: 18, fontWeight: '600' }}>Where to?</Text>
                <TextInput style={{ height: 50, borderRadius: 10, borderWidth: 2, backgroundColor: '#fff', paddingHorizontal: 8, fontSize: 16 }}
                // onFocus={() => animateTab2('shrink')}
                // onFocus={() => navigation.navigate('LocationInput')}
                />

                {/* <View style={{
                    marginVertical: 0,
                    flexDirection: 'row',
                    backgroundColor: '#fff', height: 140, borderRadius: 20,
                    shadowColor: '#000',
                    shadowOpacity: 0.38,
                    shadowRadius: 6,
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                }}>
                    <Image style={{ height: '100%', width: '50%', borderRadius: 20 }} source={require('./assets/9.jpeg')} />
                    <View style={{ padding: 20 }}>
                        <Text style={{ marginVertical: 0, fontSize: 24, fontWeight: '500' }}>Airport</Text>
                        <Text style={{ marginVertical: 0, fontSize: 16 }}>Pickups &</Text>
                        <Text style={{ marginVertical: 0, fontSize: 16 }}>Dropoffs</Text>
                    </View>
                </View> */}

                {thing &&
                    <View style={{}}>
                        <Text style={{ marginTop: 14, marginBottom: 6, fontSize: 18, fontWeight: '600' }}>Where to?</Text>
                        <TextInput style={{ height: 50, borderRadius: 10, borderWidth: 2, backgroundColor: 'white', paddingHorizontal: 8, fontSize: 16 }}
                            onFocus={() => animateTab2('shrink')}
                        />



                        {/* <View style={{
                            width: '100%',
                            maxHeight: 200,
                            // backgroundColor: '#f2f2f2',
                            // position: 'absolute',
                            // top: 64,
                            zIndex: 10,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,


                        }}>
                            {[{ id: 'dfdfd', description: 'dfdsdsfs sdfsdfs sdfsdfsfd ffd' }, { id: 'dfdfd', description: 'dfdsdsfs sdfsdfs sdfsdfsfd ffd' }, { id: 'dfdfd', description: 'dfdsdsfs sdfsdfs sdfsdfsfd ffd' }, { id: 'dfdfd', description: 'dfdfd' }].map((item, index) => {
                                return (
                                    <TouchableOpacity key={item.place_id}
                                        style={{ zIndex: 10, flexDirection: 'row', borderTopWidth: index == 0 ? 0 : 1, borderTopColor: '#b2b9ac', paddingVertical: 10, backgroundColor: '#fff' }}
                                        onPress={() => { enterPickup(item.description); setShowList(''); pickupRef.current.blur(); }}
                                    >
                                        <Text numberOfLines={1} style={{ paddingLeft: 6, fontSize: 16, flex: 1, color: '#000' }}>{item.description}</Text>
                                    </TouchableOpacity>
                                );
                            })}

                        </View>


 */}




                    </View>

                }



            </View>
            <TouchableOpacity style={{ backgroundColor: '#000', height: 56, width: '85%', alignSelf: 'center', position: 'absolute', bottom: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} onPress={() => { setAddress(true); navigation.goBack() }}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Enter</Text>
            </TouchableOpacity>
        </View>

    );
}

