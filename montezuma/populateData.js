import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version as app_version } from './package.json';
import { Alert } from 'react-native';
import url from './url_toggle'

// AsyncStorage.clear()
export default async function populateData({ masterState, setMasterState }) {

    let user = masterState.user 

    // console.log('populate data body -- app is ready: ', masterState.appIsReady, user)


        await axios({
            method: 'get',
            url: `${url}/driver/populateData?_id=${user._id}`
        })
            .then(async res => {
                // console.log('user data: ', res.data)
                console.log('populate data')


                const user = res.data.driver


                if (user && !user.driverIsAuthorized) {
                    setMasterState(masterState => ({ ...masterState, user: null }))
                    Alert.alert("Not Authorized", "You are not authorized to use this app.", [
                        {
                            text: 'OK',
                            onPress: () => { console.log('ok selected') },
                        },
                    ])
                    AsyncStorage.clear()
                    return
                }

                let { newScheduledRides } = res.data
                let { newLocalRides } = res.data





                // console.log('new scheduled rides: ', newScheduledRides)
                // console.log('new local rides: ', newLocalRides)



                let myScheduledRides = user.activeRides
                let myLocalRides = user.localRides ? user.localRides : []
                let directBookings = user.directBookings || []


                setMasterState(masterState => {
                    return { ...masterState, user, newScheduledRides, myScheduledRides, newLocalRides, myLocalRides, directBookings, appIsReady: true }
                })

                // removing these properties from local storage
                user.activeRides = []
                user.localRides = []

                await AsyncStorage.setItem('User', JSON.stringify(user))



            })
            .catch(
                (err) => {
                    console.log('driver populate data: ', err)
                }
            )

    
    
   
    // We can fetch driver Data on each populateData callMicrotasks...or just on first login and then each subsequent visit to Account page
    // This impacts when driver data is pulled for user.
    // If it's only refreshed for driver on those occasions, then we need to pull fresh driver data to send to user on ride confirmation etc. If it's always current, we can send straight to user.

    return


}

