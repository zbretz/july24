import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState } from 'react-native';
import { useFonts } from 'expo-font';
import { useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, } from '@expo/vector-icons';
import axios from 'axios';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';


import { socket } from './socket';
import BottomTabs from './BottomTabs';

// AsyncStorage.clear()
export default function InitSocket({ masterState, setMasterState }) {

  const [isConnected, setIsConnected] = useState(false); //setting this state here causes re-render on MainStack

  let userid = masterState.user._id

  let userType = 'driver'
  const [rideTakenModal, setRideTakenModal] = useState(false)
  const [removeLocalRide, setRemoveLocalRide] = useState(null)


  useEffect(() => {

    if (socket.connected) {
      onConnect()
    }

    function onConnect() {
      setIsConnected(true);
      socket.emit('register socket', { userid, userType })
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('disconnected')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('ride_taken', (data) => {
      setRideTakenModal(true)
    })

    socket.on('message', (data) => {
      console.log('message received: ', data)
      setMasterState(masterState => {
        let myScheduledRides = [...masterState.myScheduledRides]
        for (const ride of myScheduledRides) {
          if (ride._id === data.rideid) {
            // console.log('rrrrride: ', ride)
            ride.chatLog = [...ride.chatLog, data]
            ride.unreadMessageFromUser = true
          }
        }
        // let activeRides = masterState.user.activeRides.map(ride => { console.log ('target: ', ride._id); return ride._id === data.rideid ? {...ride, chatLog: [...ride.chatLog, data]} : ride})
        return { ...masterState, myScheduledRides }
      })
    });

    socket.on('local_ride_request', (data) => {
      console.log('local ride requested: ', data)
      // setNewLocalRides(localRides => [...localRides, { ...data }])

      setMasterState(masterState => {
        return { ...masterState, newLocalRides: [...masterState.newLocalRides, { ...data }] }
      })
    });

    socket.on('remove_local_ride', (data) => {
      console.log('remove local ride data: ', data)

      setRemoveLocalRide(data)

      setMasterState(masterState => {
        return { ...masterState, newLocalRides: masterState.newLocalRides.filter(ride => ride._id !== data._id) }
      })

    })

    socket.on('request_scheduled_ride', (data) => {
      console.log('scheduled ride requested: ', data)

      setMasterState(masterState => {
        return { ...masterState, newScheduledRides: [...masterState.newScheduledRides, { ...data }] }
      })

    });


    socket.on('scheduled_ride_paid', (data) => {
      console.log('scheduled ride paid: ', data)

      setMasterState(masterState => {
        let myScheduledRides = [...masterState.myScheduledRides]
        for (const ride of myScheduledRides) {
          console.log('ride id (scheduled ride paid): ', ride)
          if (ride._id === data._id) {
            // console.log('rrrrride: ', ride)
            ride.paid = data.paid
          }
        }
        return { ...masterState, user: { ...masterState.user, myScheduledRides } }
      })

    });

    socket.on('scheduled_ride_canceled', (data) => {
      console.log('scheduled ride canceled: ', data)

      setMasterState(masterState => {
        let myScheduledRides = [...masterState.myScheduledRides]
        for (const ride of myScheduledRides) {
          console.log('ride id (scheduled ride canceled): ', ride)
          if (ride._id === data._id) {
            // console.log('rrrrride: ', ride)
            ride.rideCanceledByRider = data.rideCanceledByRider
            ride.rideCanceledByDriver = data.rideCanceledByDriver
          }
        }
        return { ...masterState, user: { ...masterState.user, myScheduledRides } }
      })

    });


    socket.on('remove_scheduled_ride', (data) => {
      console.log('removing scheduled ride: ', data)


      // setNewScheduledRides(scheduledRides => {
      //   return scheduledRides.filter(ride => ride._id !== data._id)
      // })


      setMasterState(masterState => {
        return { ...masterState, newScheduledRides: masterState.newScheduledRides.filter(ride => ride._id !== data._id) }
      })

    });







    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);

      //DON'T FORGET TO 'SOCKET OFF' OTHER SOCKET FUNCTIONS



    };
  }, []);


  return (
    <NavigationContainer>

      <BottomTabs masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} rideTakenModal={rideTakenModal} setRideTakenModal={setRideTakenModal} removeLocalRide={removeLocalRide} />

    </NavigationContainer>
  )
}

