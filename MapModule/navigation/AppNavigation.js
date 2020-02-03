import React from 'react'
import {  createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapScreen from '../screens/MapScreen';
import ARScreen from '../screens/ARScreen';
//import SignInScreen from '../screens/SignInScreen';
//import SignUpScreen from '../screens/SignUpScreen';
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
    // SignIn: SignInScreen,
    // SignUp: SignUpScreen
}, defaultNavigationOptions);

// const ARScreenNavigator = createStackNavigator({
//     AR: {screen: ARScreen,
//         navigationOptions: {
//             headerStyle: {
//                 backgroundColor: Colors.accent
//             }
//         }
//     }

// })

// const AppBottomTabNavigation = createMaterialBottomTabNavigator({
//     Map: {
//         screen: AppNavigator,
//         navigationOptions: {
//             tabBarIcon: (tabInfo) => {
//                 return <Ionicons name='md-map' size={25} color={tabInfo.tintColor} />
//             },
//             tabBarColor: Colors.primaryColor,
//         }
//     }
//     // AR: {
//     //     screen: ARScreenNavigator,
//     //     navigationOptions: {
//     //         tabBarIcon: (tabInfo) => {
//     //             return <Ionicons name='md-camera' size={25} color={tabInfo.tintColor} />
//     //         },
//     //         tabBarColor: Colors.accent
//     //     }

//     // }
// }, {
//     initialRouteName: 'Map',
//     shifting: false,
//     barStyle: {
//         backgroundColor: Colors.primary
//     }
    
// });

export default createAppContainer(AppNavigator);