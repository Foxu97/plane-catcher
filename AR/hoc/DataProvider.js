import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ToastAndroid } from 'react-native'

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import * as planeActions from '../store/planes/planes-actions';

import * as API from '../api';


import { ActivityIndicator } from 'react-native-paper';

const serverlog = (message) => {
    fetch('http://192.168.74.254:8080/debug/consolelog', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message
        }),
    });
}

const DataProvider = props => {
    serverlog("Data provider init")
    const dispatch = useDispatch();
    const [planesFetched, setPlanesFetched] = useState(false);

    const verifyPermissions = async () => {
            try {
                const result = await Permissions.askAsync(Permissions.LOCATION, Permissions.CAMERA_ROLL, Permissions.CAMERA);
                if (result.status !== 'granted') {
                    await serverlog("No location permissions!");
                    ToastAndroid.show('Cant run app without permissions granted :(', ToastAndroid.LONG);
                } else {
                    await serverlog("location permissions granted");
                    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                    const headingRes = await Location.getHeadingAsync();
                    dispatch(planeActions.setLocation(location.coords.latitude, location.coords.longitude));
                    dispatch(planeActions.setHeading(headingRes.trueHeading));
                    API.getPlanes(location.coords.latitude, location.coords.longitude, 300, headingRes.trueHeading);
                    setPlanesFetched(true);
                }
            } catch (err) {
                console.log(err);
            }
    }

    useEffect(() => {
        verifyPermissions()
    }, [dispatch]);

    return (
        planesFetched ? <View style={styles.view} >{props.children}</View> :
            <View style={styles.view}>
                <ActivityIndicator style={styles.view}/>
            </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    }
})

export default DataProvider;