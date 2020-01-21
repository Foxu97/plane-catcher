import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'

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

    const fetchPlanes = useCallback(async (userLatitude, userLongitude, range, heading) => {
        try {
            await dispatch(planeActions.fetchPlanes(userLatitude, userLongitude, range, heading))
        } catch (err) {
            console.log(err);
        }
    }, [dispatch])


    const verifyPermissions = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Permissions.askAsync(Permissions.LOCATION);
                if (result.status !== 'granted') {
                    Alert.alert('Insufficient permissions!', [{ text: 'OK!' }]);
                    await serverlog("No location permissions!");
                } else {
                    await serverlog("location permissions granted");
                    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }); // watch position should be better
                    const headingRes = await Location.getHeadingAsync();
                    await fetchPlanes(location.coords.latitude, location.coords.longitude, 300, headingRes.trueHeading);
                    API.getPlanes(location.coords.latitude, location.coords.longitude, 300, headingRes.trueHeading);
                    resolve();
                }
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    useEffect(() => {
        verifyPermissions().then(() => {
            serverlog("Permission veryfied")
            setPlanesFetched(true);
        })
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