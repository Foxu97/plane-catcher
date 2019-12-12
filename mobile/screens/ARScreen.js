import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import CameraComponent from '../components/CameraComponent';

const ARScreen = () => {

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