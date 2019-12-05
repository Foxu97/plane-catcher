import React, { useState, useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import { View, Text, Button, StyleSheet, Dimensions, Alert, Platform } from 'react-native';

import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man-.png';
import CustomHeaderButton from '../components/CustomHeaderButton';

const MapScreen = props => {
    const [userLocation, setUserLocation] = useState();
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const setRegion = () => ({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    const verifyPermissions = async () => {
        try {
            const result = await Permissions.askAsync(Permissions.LOCATION);
            if (result.status !== 'granted') {
                Alert.alert('Insufficient permissions!', [{ text: 'OK!' }]);
                //console.log("No permission for LOCATION granted");
            } else {
                setHasLocationPermission(true);
                //console.log("Permission for LOCATION granted");
                const watchID = navigator.geolocation.watchPosition(
                    (position) => {
                        //console.log("New position: ", position)
                        setUserLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        })
                    },
                    (err) => console.log(err),
                    { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
                )
                return watchID;
            }
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        const watchID = verifyPermissions(); //not shure if ok
        return () => {
            console.log("Component unmount")
            navigator.geolocation.clearWatch(watchID);
        }
    }, []);


    return (
        <View style={styles.container}>
            {
                userLocation && hasLocationPermission ?
                    <MapView region={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }} style={styles.mapStyle} >

                        <MapView.Marker
                            coordinate={setRegion()}
                            image={manMarker}
                        />
                    </MapView>
                    :
                    <View>
                        <Text>We need your location permission granted</Text>
                        <Button title="Grant GPS Permission" onPress={verifyPermissions}/>
                    </View>
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

MapScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Map',
        headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title="Add Place"
                iconName='md-camera'
                onPress={() => {
                    navData.navigation.navigate('AR');
                }}
            />

        </HeaderButtons>
    }
}

export default MapScreen;