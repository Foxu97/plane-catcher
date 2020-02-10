import React from 'react'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform } from 'react-native';
import MapScreen from '../screens/MapScreen';
import ARScreen from '../screens/ARScreen';
import Colors from '../constants/Colors';

const defaultNavigationOptions = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
    }
}

const AppNavigator = createStackNavigator({
    Map: MapScreen,
    AR: ARScreen
}, defaultNavigationOptions);


export default createAppContainer(AppNavigator);