import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Accelerometer, Gyroscope } from 'expo-sensors';

import CameraComponent from '../components/CameraComponent';

const samplePlane = {
    bearingInDegrees: 27.05050,
    angleBetweenPlaneAndObserverInDegrees: 17.888
}

const ARScreen = () => {
    const [hasLocationPermission, setHasLocationPermission] = useState();
    const [heading, setHeading] = useState();
    const [gyroscopeData, setGyroscopeData] = useState();
    const [accelerometerData, setAccelerometerData] = useState();

    const askForLocationPermission = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        setHasLocationPermission(status === 'granted');

        Location.watchHeadingAsync((heading) => {
           // console.log(heading)
           setHeading(heading)
        })
    }

    useEffect(() => {
        askForLocationPermission();

        Accelerometer.addListener(accelerometerData => {
            //console.log("Accelerometer: ", accelerometerData);
            setAccelerometerData(accelerometerData)
        });

        Gyroscope.addListener(gyroscopeData => {
            console.log("Gyroscope: ", gyroscopeData);
            setGyroscopeData(gyroscopeData)
        })

    }, [])

  return (
    <View style={styles.screen}>
      <CameraComponent style={styles.cameraOutput}/>
      <View style={styles.planeInfo}>
      {accelerometerData ? 
          <View style={{flex: 1}}>
                <Text>Accelerometer</Text>
                <Text>x {accelerometerData.x}</Text>
                <Text>y: {accelerometerData.y}</Text>
                <Text>z: {accelerometerData.z}</Text>
          </View> : null }
          {gyroscopeData ? 
          <View style={{flex: 1}}>
              <Text>Gyroscope</Text>
              <Text>x {gyroscopeData.x}</Text>
              <Text>y: {gyroscopeData.y}</Text>
              <Text>z: {gyroscopeData.z}</Text>
          </View> : null }
          {heading ? 
          <View style={{flex: 1}}>
              <Text>Location Heading</Text>
              <Text>{heading.trueHeading}</Text>
          </View> : null}
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
        flex: 1,
        flexDirection: 'row'
    }
});

ARScreen.navigationOptions = navData => {
    return {
        headerTitle: 'AR',
        headerTintColor: 'white'
    }
}

export default ARScreen;