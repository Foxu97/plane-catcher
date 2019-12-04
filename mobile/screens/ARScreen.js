import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';

const ARScreen = props => {
    const [hasPermission, setHasPermission] = useState();
    useEffect(() => {

        const verifyPermissions = async () =>{
            const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
            if (result.status !== 'granted') {
                Alert.alert(
                    'Insufficient permissions!',
                    'You need to grant location permissions to use this app.',
                    [{ text: 'Okay' }]
                );
                return false;
            }
            return true;
        };
        verifyPermissions().then(result => {
            console.log("result: ", result)
            setHasPermission(result);
            console.log("hasPErmisssion: ", hasPermission)
        });
    }, [hasPermission])

    return (
        <Text>ARScreen</Text>
    )
};

const styles = StyleSheet.create({

});

export default ARScreen;