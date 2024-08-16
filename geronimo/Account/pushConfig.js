import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';


export default async function pushConfig() {
        return registerForPushNotificationsAsync().then(async token => {
            await AsyncStorage.setItem('ExpoPushToken', token)
            return token
        })
    .catch( e => {
        // error reading value
        console.log('error get push token: ', e)
        return null
     })
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('step1: ', existingStatus)
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            console.log('step2: ', status)
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // token = (await Notifications.getExpoPushTokenAsync({projectId: Constants.expoConfig.extra.eas.projectId})).data;
        token = (await Notifications.getExpoPushTokenAsync({projectId: 'ef351239-8922-4a5d-ac35-a9d64e9afd73'})).data;
        console.log('step3: ', token)
        console.log(token);


        const { status } = await Notifications.requestPermissionsAsync();
        console.log('status: ', status)

    } else {
        token = 'simulator'
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}