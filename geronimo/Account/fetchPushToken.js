import AsyncStorage from '@react-native-async-storage/async-storage';
import pushConfig from './pushConfig';
import axios from 'axios';
import { Alert } from 'react-native';
import {url} from '../url_toggle'

export default fetchPushToken = async (userId) => {
    console.log('with REF userId: ', userId)
    let push_token = await AsyncStorage.getItem('ExpoPushToken')
    if (push_token) {
        console.log('saved push token: ', push_token)
    } else {
        async function waitForAlertResponse () {
            return new Promise ((resolve, reject) => {
                Alert.alert("Please Accept", "Please hit ALLOW on the next prompt so that we can notify you when you've received a message from our team. Thank you!", [
                    {
                        text: 'OK',
                        onPress: () => {console.log('ok selected'); resolve()},//alertAccepted = false,
                    },
                ])
            })
    }

    // await waitForAlertResponse()

        push_token = await pushConfig()
        console.log('chat push token fetch: ', push_token)



        if (push_token) {
            axios({
                method: 'post',
                url: `${url}/auth/saveExpoPushToken?`,
                data: { userId, push_token}

            })
                .then(res => {
                    console.log('push token save response: ', res)
                })
                .catch((err) => console.log('push token save error: ', err))
        }



    }
}