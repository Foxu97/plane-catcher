import React, {useState, useEffect} from 'react';
import { withNavigationFocus } from 'react-navigation';
import { useSelector } from 'react-redux';
import {
  AppRegistry,
  ViroScene,
  ViroARSceneNavigator,
} from 'react-viro';


// const serverlog = (message) => {
//   fetch('http://192.168.74.254:8080/debug/consolelog', {
//       method: 'POST',
//       headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//           message: message
//       }),
//   });
// }

const InitialARScene = require('./js/HelloWorldSceneAR');
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

  const _exitViro = () => {
    setNavigationType("MAP")
  }
  const _returnToMapScreen = () => {
    props.navigation.navigate("Map");
  }

  const _getARNavigator = (lat, lng) => {
    return (
      <ViroARSceneNavigator
        initialScene={{ scene: InitialARScene }} onExitViro={_exitViro} viroAppProps={userCoords}
          />
    );
  }

  return (
    navigationType === AR ? _getARNavigator(userLatitude, userLongitude) : _returnToMapScreen()
  );
}



ARScreen.navigationOptions = navData => {
  return {
      headerTitle: 'AR'
  }
}


export default  withNavigationFocus(ARScreen);
