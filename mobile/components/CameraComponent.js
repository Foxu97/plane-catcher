import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Colors from '../constants/Colors';

const CameraComponent = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  const askForCameraPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === 'granted');
  }

  useEffect(() => {
    askForCameraPermissions();
  }, []);

  let displayingElement;

  if (hasCameraPermission === null) {
    displayingElement = (
      <View style={{flex: 4}}>
        <ActivityIndicator style={{ flex: 4 }} size="large" color={Colors.primary}/>
      </View>
    )
  }
  else if (hasCameraPermission === false) {
    displayingElement = (
      <View style={{ flex: 4 }}>
        <Text>No access co device camera!</Text>
      </View>)
  }
  else {
    displayingElement = (
      <View style={{ flex: 4 }}>
        <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
          </View>
        </Camera>
      </View>
    )
  }

  return (
    displayingElement
  )

}

export default CameraComponent;