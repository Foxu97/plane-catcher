import React from 'react';

import {
  AppRegistry,
  ViroScene,
  ViroARSceneNavigator,
} from 'react-viro';


var InitialARScene = require('./js/HelloWorldSceneAR');

const ARScreen = props => {

  return (
    <ViroARSceneNavigator
      initialScene={{ scene: InitialARScene }} />
  );
}

ARScreen.navigationOptions = navData => {
  return {
      headerTitle: 'AR'
  }
}


export default ARScreen;
