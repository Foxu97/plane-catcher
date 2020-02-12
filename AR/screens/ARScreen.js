import React, { useState, useEffect } from 'react';
import { withNavigationFocus } from 'react-navigation';
import { useSelector } from 'react-redux';
import {
  AppRegistry,
  ViroScene,
  ViroARSceneNavigator,
} from 'react-viro';

import * as API from '../api';



const InitialARScene = require('./js/ARScene');
const MAP = "MAP";
const AR = "AR";

const ARScreen = props => {
  const [navigationType, setNavigationType ] = useState("AR");
  const userLatitude = useSelector(state => state.planes.latitude);
  const userLongitude = useSelector(state => state.planes.longitude);

  const userCoords = { 
    latitude: userLatitude,
    longitude: userLongitude
  }

  useEffect(() => {
    API.connectToSocket();
  }, []);


  const _exitViro = () => {
    setNavigationType("MAP")
  }
  const _returnToMapScreen = () => {
    props.navigation.navigate("Map");
  }

  const _getARNavigator = () => {
    return (
      <ViroARSceneNavigator
        initialScene={{ scene: InitialARScene }} onExitViro={_exitViro} viroAppProps={userCoords}
          />
    );
  }

  return (
    navigationType === AR ? _getARNavigator() : _returnToMapScreen()
  );
}

ARScreen.navigationOptions = {
  header: null
}


export default withNavigationFocus(ARScreen);
