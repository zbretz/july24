import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import populateData from './populateData';

import InitSocket from './InitSocket';
import LoginScreen from './LoginScreen';

export default function App() {
  // AsyncStorage.clear()

  const [masterState, setMasterState] = useState({
    user: null,
    myScheduledRides: [],
    newScheduledRides: [],
    myLocalRides: [],
    newLocalRides: [],
    chatLog: []
  })


  const getDriver = async () => {
    let user = JSON.parse(await AsyncStorage.getItem('User'))
    console.log('user: ', user)
    if (user) {
      setMasterState(masterState => ({ ...masterState, user }))
    }
  }

  useEffect(() => {
    getDriver()
  }, [])



  if (!masterState.user) {
    return <LoginScreen masterState={masterState} setMasterState={setMasterState} />
  } else {
    return <AppContent masterState={masterState} setMasterState={setMasterState} />
  }

}



const AppContent = ({masterState, setMasterState}) => {

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const startApp = async () => {
    populateData({ masterState, setMasterState })
  }

  useEffect(() => {

    !masterState.appIsReady && startApp()

    const networkRetry = setInterval(() => {
      if (!masterState.appIsReady) {
        console.log('trying againnn')
        startApp()
      }
      if (masterState.appIsReady) clearInterval(networkRetry)
    }, 6000)

    return () => clearInterval(networkRetry)

  }, [masterState.appIsReady])

  useEffect(() => {

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        populateData({ masterState, setMasterState })
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [masterState.user]);

  if (!masterState.user) return <LoginScreen masterState={masterState} setMasterState={setMasterState} />

  return (
    <>
      {
        masterState.appIsReady &&
        <>
          <InitSocket masterState={masterState} setMasterState={setMasterState} />
        </>
      }
    </>
  )
}

