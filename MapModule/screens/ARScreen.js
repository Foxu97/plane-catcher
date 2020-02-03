import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import SafeAndroidView from '../hoc/SafeAndroidView';

const ARScreen = props => {

  return (
    <SafeAndroidView>
      <Text>AR Component!</Text>
    </SafeAndroidView>
  )
}

ARScreen.navigationOptions = {
  header: null
}

export default ARScreen;
