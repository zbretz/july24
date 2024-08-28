import registerRootComponent from 'expo/build/launch/registerRootComponent';
// import { Text, AppRegistry } from 'react-native';

import { Text, TextInput } from 'react-native';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

import App from './CoreNav/App';

registerRootComponent(App);
