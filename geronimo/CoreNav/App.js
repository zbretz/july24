import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import populateData from './populateData';

import InitSocket from './InitSocket';
import MainStack from './BottomTabs'
import SplashScreen from './SplashScreen'
import UpdateAvailable from './UpdateAvailable';

// AsyncStorage.clear()
export default function App() {

  const [fontsLoaded, fontError] = useFonts({
    'Aristotelica-DemiBold': require('../assets/fonts/Aristotelica/Aristotelica-DemiBold.ttf'),
    'Aristotelica-Regular': require('../assets/fonts/Aristotelica/Aristotelica-Regular.ttf'),
    'Aristotelica-SmallCaps': require('../assets/fonts/Aristotelica/AristotelicaSmallCaps-Regular.ttf'),

    'PointSoftSemiBold': require('../assets/fonts/PointSoft/PointSoftSemiBold.otf'),
    'PointSoftLight': require('../assets/fonts/PointSoft/PointSoftLight.otf'),

    'LexendRegular': require('../assets/fonts/Lexend/Lexend-Regular.ttf'),
    'LexendMedium': require('../assets/fonts/Lexend/Lexend-Medium.ttf'),
    'LexendLight': require('../assets/fonts/Lexend/Lexend-Light.ttf'),
  });

  // const getUser = async () => {
  //     let user = JSON.parse(await AsyncStorage.getItem('User'))
  //     console.log('async user: ', user)
  // }
  // getUser()

  const [masterState, setMasterState] = useState({ user: null, chatLog: [] })

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  useEffect(() => {

    const startApp = async () => {
      populateData({ masterState, setMasterState })
    }

    !masterState.appIsReady && startApp()

    const networkRetry = setInterval(() => {
      if (!masterState.appIsReady) {
        console.log('trying again')
        startApp()
      }
      if (masterState.appIsReady) clearInterval(networkRetry)
    }, 6000)

    return () => clearInterval(networkRetry)

  }, [masterState.appIsReady])

  const [stopAnim, setStopAnim] = useState(false)

  useEffect(() => {
    //allows animation to play a few frames
    setTimeout(() => {
      setStopAnim(true)
    }, 1900)
  }, [])

  useEffect(() => {

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('why dem', appState.current, nextAppState)
        populateData({ masterState, setMasterState })
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  // }, [masterState.user]);
}, []);


  if (!fontsLoaded && !fontError) {
    { return (<View style={{ height: '100%', width: '100%', backgroundColor: '#ffcf56' }} />) }
  }

  return (
    <>
    {/* <View style={{backgroundColor:'#fff', height:'100%', width:'100%', alignItems:'center', justifyContent:'center'}}><Text>Hello</Text></View> */}
      {masterState.updateAvailable && <UpdateAvailable />}
      <SplashScreen appIsReady={masterState.appIsReady} stopAnim={stopAnim} />
      <InitSocket masterState={masterState} setMasterState={setMasterState} />
      {masterState.updateAvailable && <UpdateAvailable />}
    </>
  )
}

