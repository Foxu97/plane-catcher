import React, { useState, useEffect } from 'react';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, Button, StyleSheet, Dimensions, Alert } from 'react-native';

import Colors from '../constants/Colors';

const MapScreen = props => {
    const [userLocation, setUserLocation] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
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

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000
            });
            mapRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }

            setUserLocation(location)
        } catch (err) {
            Alert.alert(
                'Could not fetch location!',
                'Please try again later or pick a location on the map.',
                [{ text: 'Okay' }]
            );
        }
    };

    return (
        <View style={styles.container}>
            {
                userLocation ? <MapView region={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }} style={styles.mapStyle} /> :
                    <Button
                        title="Get User Location"
                        color={Colors.primary}
                        onPress={getLocationHandler}
                    />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default MapScreen;