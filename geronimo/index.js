// import registerRootComponent from '/expo/build/launch/registerRootComponent';
// import { Text, AppRegistry } from 'react-native';
import { registerRootComponent } from "expo";


import React from 'react';
import { Text, TextInput } from 'react-native';

function patchAllowFontScaling(Component, name) {
  if (!Component?.render) {
    console.warn(`[FontScaling] ${name} has no render method`);
    return;
  }

  const originalRender = Component.render;
  Component.render = function (...args) {
    const rendered = originalRender.call(this, ...args);
    return React.isValidElement(rendered)
      ? React.cloneElement(rendered, {
          ...rendered.props,
          allowFontScaling: false,
        })
      : rendered;
  };
}

patchAllowFontScaling(Text, 'Text');
patchAllowFontScaling(TextInput, 'TextInput');

import App from './CoreNav/App';

console.log("Text defaultProps at runtime:", Text.defaultProps);


registerRootComponent(App);
