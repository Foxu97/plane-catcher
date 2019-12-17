import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import * as Permissions from 'expo-permissions';
import Colors from '../constants/Colors';

const ARScreen = props => {
    const [hasPermission, setHasPermission] = useState(false);

    const verifyPermissions = async () =>{
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{ text: 'Okay' }]
            );
            setHasPermission(false);
        } else {
            setHasPermission(true);
        }
       
    };

    useEffect(() => {
        verifyPermissions();
    }, [])

    return (
        hasPermission ? <Text>Has Permission</Text> : <Button title="Grant permissions" onPress={verifyPermissions} />
        
    )
};

ARScreen.navigationOptions = navData => {
    return {
        headerTitle: 'VR',
        headerStyle: {
            backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
    }
}

const styles = StyleSheet.create({

});

export default ARScreen;