import { StyleSheet, Text, TouchableOpacity, View, TextInput, Image, Dimensions, FlatList, AppState, Animated } from 'react-native';
import { useEffect, useState, useCallback, } from 'react';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';

const windowWidth = Dimensions.get('window').width;

export default SplashScreen = ({ appIsReady, stopAnim }) => {

    const [translateValueSchedule, setTranslatedValueSchedule] = useState(new Animated.Value(windowWidth / 2 - 120))
    const [showApp, setShowApp] = useState(false)

    const animateTabSchedule = (selection) => {
        Animated.timing(translateValueSchedule, {
            duration: 700,
            toValue: -300,
            useNativeDriver: false,
        })
            .start(({ finished }) => {
                setShowApp(true)
            })
    }

    const [translateValueSchedule2, setTranslatedValueSchedule2] = useState(new Animated.Value(0))

    const animateTabSchedule2 = (selection) => {
        Animated.timing(translateValueSchedule2, {
            duration: 550,
            toValue: -400,
            useNativeDriver: false,
        })
            .start(({ finished }) => {
            })
    }


    const [animFinished, setAnimFinished] = useState(false)

    useEffect(() => {
        // setTimeout(() => {
        //     animateTabSchedule()
        //     animateTabSchedule2()
        // }
        //     , 1000)



        if (appIsReady && animFinished) {
            animateTabSchedule()
            animateTabSchedule2()
        }


    }, [appIsReady, animFinished])

    return (

        <>
            <StatusBar hidden={true} />

            {!showApp

                ?


                <View style={{ position: 'absolute', zIndex: 2, height: '100%', width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', }}>

                    <Animated.View style={[{
                        position: 'absolute',
                        zIndex: 3,
                        left: translateValueSchedule,
                        height: 240, width: 240, 
                       
                    },]} >

                        <LottieView speed={1.2} style={{ height: 240, width: 240, }} source={require('../assets/mountain.json')} autoPlay loop={false} onAnimationFinish={() => {  setAnimFinished(true) }} />

                    </Animated.View>


                    <Animated.View style={{ zIndex: 2, right: translateValueSchedule2, height: '100%', width: '100%', flex: 1, backgroundColor: '#FFCF56', }} />


                </View>

                :
                null}

        </>
    )
}
