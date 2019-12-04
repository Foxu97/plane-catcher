import {  createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform } from 'react-native';

import MapScreen from '../screens/MapScreen';
import ARScreen from '../screens/ARScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import Colors from '../constants/Colors';

const AppNavigator = createStackNavigator({
    Map: MapScreen
    // AR: ARScreen,
    // SignIn: SignInScreen,
    // SignUp: SignUpScreen
}, {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
    }
}
);

export default createAppContainer(AppNavigator);