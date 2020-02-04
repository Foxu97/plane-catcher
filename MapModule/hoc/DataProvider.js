import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ToastAndroid } from 'react-native'

import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { useDispatch } from 'react-redux';
import * as planeActions from '../store/planes/planes-actions';
import AskPermissions from '../components/AskPermissions';


import { ActivityIndicator } from 'react-native-paper';

const DataProvider = props => {
    const dispatch = useDispatch();
    const [hasPermissions, setHasPermissions] = useState(false);
    const [hasLocation, setHasLocation] = useState(false);

    const verifyPermissions = async () => {
            try {
                const result = await Permissions.askAsync(Permissions.LOCATION, Permissions.CAMERA_ROLL, Permissions.CAMERA);
                if (result.status !== 'granted') {
                    setHasPermissions(false);
                    setHasLocation(false);
                    ToastAndroid.show('Cant run app without permissions granted :(', ToastAndroid.LONG);
                } else {
                    setHasPermissions(true);
                    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
                    const headingRes = await Location.getHeadingAsync();
                    dispatch(planeActions.setLocation(location.coords.latitude, location.coords.longitude));
                    dispatch(planeActions.setHeading(headingRes.trueHeading));
                    setHasLocation(true);
                }
            } catch (err) {
                setHasPermissions(false);
            }
    }

    useEffect(() => {
        verifyPermissions()
    }, [dispatch]);

    return (
        hasPermissions ? ( hasLocation ? <View style={styles.view} >{props.children}</View> : <ActivityIndicator style={styles.view}/>) :
            <View style={styles.view}>
                <AskPermissions
                    verifyPermissionsHandler={verifyPermissions}
                />
            </View>
    )

}

const styles = StyleSheet.create({
    view: {
        flex: 1
    }
})

export default DataProvider;