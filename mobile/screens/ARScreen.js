import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import CameraComponent from '../components/CameraComponent';

const samplePlane = {
    bearingInDegrees: 27.05050,
    angleBetweenPlaneAndObserverInDegrees: 17.888
}

const ARScreen = () => {
    const [hasLocationPermission, setHasLocationPermission] = useState();
    const [heading, setHeading] = useState();

    const askForLocationPermission = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        setHasLocationPermission(status === 'granted');

        Location.watchHeadingAsync((heading) => {
            console.log(heading)
        })
    }

    useEffect(() => {
        askForLocationPermission();
    }, [])

  return (
    <View style={styles.screen}>
      <CameraComponent style={styles.cameraOutput}/>
      <View style={styles.planeInfo}>
          <Text>Plane info</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    cameraOutput: {
        flex: 4
    },

    planeInfo: {
        flex: 1
    }
});

ARScreen.navigationOptions = navData => {
    return {
        headerTitle: 'AR',
        headerTintColor: 'white'
    }
}

export default ARScreen;