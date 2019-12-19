

import React from 'react';

import {
  AppRegistry,
  ViroScene,
  ViroVRSceneNavigator,
} from 'react-viro';


// Sets the default scene you want for AR and VR
var InitialARScene = require('./js/HelloWorldScene');



const ARScene = props => {


  return (
    <ViroVRSceneNavigator
      initialScene={{ scene: InitialARScene }} />
  );
}


export default ARScene;
