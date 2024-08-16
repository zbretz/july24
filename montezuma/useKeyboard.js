import { useState, useEffect } from "react";
import { Keyboard, Platform } from "react-native";

function useKeyboard() {

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {

        console.log('PLATFORM: ', Platform.OS)
        // let keyboardDidShowListener;
        // let keyboardDidHideListener;

        if (Platform.OS == 'ios') {
            keyboardShowListener = Keyboard.addListener('keyboardWillShow', (e) => {
                // console.log('keyboard: ', e.endCoordinates);
                setKeyboardHeight(e.endCoordinates.height)
            });

            keyboardHideListener = Keyboard.addListener('keyboardWillHide', (e) => {
                // console.log('keyboard: ', e.endCoordinates);
                setKeyboardHeight(0)
            });
        }
        else {
            keyboardShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
                // console.log('keyboard: ', e.endCoordinates);
                setKeyboardHeight(e.endCoordinates.height)
            });

            keyboardHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
                // console.log('keyboard: ', e.endCoordinates);
                setKeyboardHeight(0)
            });
        }

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();

        };

    }, [])

    return keyboardHeight

}

export default useKeyboard