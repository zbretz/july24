import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default async function pushConfig() {

    const { status } = await Notifications.requestPermissionsAsync();
    console.log('step2: ', status)

    if (status !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
    }

    const token = (await Notifications.getExpoPushTokenAsync({projectId: '4e895a0e-e7bc-4236-9ccc-9320483f8d2a'})).data;

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