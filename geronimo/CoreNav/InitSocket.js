import { useEffect, useState, useCallback, useRef } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LocalRideNav from '../LocalRides/LocalRideNav';
import ScheduleRide from '../ScheduleRides/ScheduleRide';
import DriverPages from '../ScheduleRides/DriverPages';
import Locals from '../Locals/LocalsNav';
import Childcare from '../Childcare/ChildcareNav';

const Stack = createStackNavigator();

import { socket } from './socket';
import BottomTabs from './BottomTabs';

// AsyncStorage.clear()
export default function InitSocket({ masterState, setMasterState }) {

  const [isConnected, setIsConnected] = useState(false); //setting this state here causes re-render on MainStack

  let userid = masterState.user?._id
  let userType = 'user'

  // console.log('init socket id: ', userid,)//'user: ', masterState.user)

  const [chatLog, setChatLog] = useState([])

  useEffect(() => {

    let userid = masterState.user?._id

    if (socket.connected) {
      onConnect()
    }

    function onConnect(initial = true) {
      userid && setIsConnected(true);
      userid && socket.emit('register socket', { userid, userType })
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('disconnected')
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);



    socket.on('message', (data) => {
      console.log('message received: ', data)

      setMasterState(masterState => {

        // let ride = masterState.user.activeRides.find(ride => ride._id == data.rideid)

        let rideIdx = masterState.user.activeRides.findIndex(ride => ride._id == data.rideid)
        let activeRides = [...masterState.user.activeRides]
        activeRides[rideIdx].chatLog = [...activeRides[rideIdx].chatLog, data]
        let newLog = { ...masterState, user: { ...masterState.user, activeRides } }
        console.log('new log: ', newLog)
        return newLog

      })

    });

    // Local Ride Listeners
    socket.on('local_ride_accepted', (data) => {
      console.log('local ride accepted: ', data)
      // setLocalRideRequest(data)
      setMasterState(masterState => {
        return ({ ...masterState, user: { ...masterState.user, localRide: data } })
      })
    });

    socket.on('local_ride_completed', (data) => {
      console.log('local ride completed: ', data)
      // setLocalRideRequest(false)
      setMasterState(masterState => {
        return ({ ...masterState, user: { ...masterState.user, localRide: null } })
      })
    });

    // Scheduled Ride Listeners
    socket.on('scheduled_ride_accepted', (rideRequest) => {
      console.log('scheduled ride accepted: ', rideRequest)
      setMasterState(masterState => {
        console.log('active rides: ', masterState.user.activeRides)
        let activeRides = masterState.user.activeRides.map(ride => { console.log('target: ', ride._id); return ride._id === rideRequest._id ? rideRequest : ride })
        return { ...masterState, user: { ...masterState.user, activeRides } }
      })
    });

    socket.on('scheduled_ride_en_route', (rideRequest) => {
      console.log('scheduled ride en route: ', rideRequest)
      setMasterState(masterState => {
        console.log('active rides: ', masterState.user.activeRides)
        let activeRides = masterState.user.activeRides.map(ride => { return ride._id === rideRequest._id ? rideRequest : ride })
        return { ...masterState, user: { ...masterState.user, activeRides } }
      })
    });

    socket.on('scheduled_ride_completed', (rideRequest) => {
      setMasterState(masterState => {
        console.log('scheduled ride completed: ', rideRequest)
        //need to also move to ride history wth updated status 
        let activeRides = masterState.user.activeRides.filter(ride => ride._id !== rideRequest._id)
        return ({ ...masterState, user: { ...masterState.user, activeRides } })
      });
    })

    socket.on('scheduled_ride_canceled', (rideRequest) => {
      setMasterState(masterState => {
        console.log('scheduled ride completed: ', rideRequest)
        //need to also move to ride history wth updated status 
        let activeRides = masterState.user.activeRides.filter(ride => ride._id !== rideRequest._id)
        return ({ ...masterState, user: { ...masterState.user, activeRides } })
      });
    });

    socket.on('scheduled_ride_paid', (rideRequest) => {
      //same replacement approach of ride accepted above
      setMasterState(masterState => {
        let rideIdx = masterState.user.activeRides.findIndex(ride => ride._id == rideRequest._id)
        let activeRides = [...masterState.user.activeRides]
        activeRides[rideIdx] = rideRequest
        let newState = { ...masterState, user: { ...masterState.user, activeRides } }
        return newState
      });
    })

    socket.on('scheduled_ride_reassigned', (rideRequest) => {
      //same replacement approach of ride accepted above
      setMasterState(masterState => {
        let rideIdx = masterState.user.activeRides.findIndex(ride => ride._id == rideRequest._id)
        let activeRides = [...masterState.user.activeRides]
        activeRides[rideIdx] = rideRequest
        let newState = { ...masterState, user: { ...masterState.user, activeRides } }
        return newState
      });
    })




    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message')
    };
  }, [masterState.user?._id]);
  // }, []);


  return (
    <NavigationContainer>



      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="SignIn" options={{ animationEnabled: false, }} >
          {props => <BottomTabs masterState={masterState} setMasterState={setMasterState} isConnected={isConnected} chatLog={chatLog} setChatLog={setChatLog} />}
        </Stack.Screen>

        {/* <Stack.Screen name="ScheduleRide">
          {props => <ScheduleRide {...props} isConnected={isConnected} masterState={masterState} setMasterState={setMasterState} chatLog={chatLog} setChatLog={setChatLog} />}
        </Stack.Screen> */}

        <Stack.Screen name="ScheduleRide">
          {props => <DriverPages {...props} isConnected={isConnected} masterState={masterState} setMasterState={setMasterState} chatLog={chatLog} setChatLog={setChatLog} />}
        </Stack.Screen>

        <Stack.Screen name="LocalRide">
          {props => <LocalRideNav {...props} type={'signup'} masterState={masterState} setMasterState={setMasterState} />}
        </Stack.Screen>

        <Stack.Screen name="Locals">
          {props => <Locals {...props} type={'signup'} masterState={masterState} setMasterState={setMasterState} />}
        </Stack.Screen>

        <Stack.Screen name="Childcare">
          {props => <Childcare {...props} type={'signup'} masterState={masterState} setMasterState={setMasterState} />}
        </Stack.Screen>


      </Stack.Navigator>



    </NavigationContainer>
  )
}

