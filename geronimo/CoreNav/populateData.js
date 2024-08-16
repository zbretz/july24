import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { version as app_version } from '../package.json';

import url from '../url_toggle'

export default async function populateData({ masterState, setMasterState }) {

    // AsyncStorage.clear()

    let user = masterState.user ? masterState.user : JSON.parse(await AsyncStorage.getItem('User'))
    // console.log('populate data user: ', user)

    // if (!user) {
    //     console.log('no user')
    //     setMasterState(masterState => {
    //         return { ...masterState, appIsReady: true }
    //     })
    //     return
    // }

    // let showBottomAd = false//res.data[3]
    // let localsPromo = false//res.data[4]
    // let updateAvailable //= res.data[2].includes(app_version)
    // let onDemandActive = true//!res.data[2].includes(app_version)
    // console.log('update version: ', res.data[2], updateAvailable, app_version)

    console.log('populate data user: ', user)

    axios({
        method: 'get',
        // url: user ? `${url}/user/populateData?_id=${user._id}` : `${url}/user/populateData?_id=${null}` // no need to fetch 'nothing' data when no user found
        url: user?._id ? `${url}/user/populateData?_id=${user._id}` : `${url}/user/populateData?_id=${null}` // no need to fetch 'nothing' data when no user found
    })
        .then(async res => {
            console.log('user data: ', res.data)

            // onDemandActive = !res.data[1]
            const {user, live_versions, onDemandActive} = res.data
            console.log('user2: ', user)

            const updateAvailable = !live_versions.includes(app_version)
            await AsyncStorage.setItem('User', JSON.stringify(user))

            setMasterState(masterState => {
                return { ...masterState, user, onDemandActive, appIsReady: true, updateAvailable }
            })

        })
        



    // if (updateAvailable) {

    //     setMasterState(masterState => {
    //         return { ...masterState, appIsReady: true, updateAvailable: true }
    //     })

    //     return

    // } else {

    //     await AsyncStorage.setItem('User', JSON.stringify(user))

    //     setMasterState(masterState => {
    //         return { ...masterState, user, activeRide, appIsReady: true, updateAvailable: false, showBottomAd, localsPromo }
    //     })

    //     return

    // }
    // // })
    // // .catch((err) => console.log('statusCheck: ', err))


}




