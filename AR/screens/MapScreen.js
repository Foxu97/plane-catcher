import React, { useState, useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Permissions from 'expo-permissions';
import { View, Text, Button, StyleSheet, Dimensions, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';

import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man-.png';
//import CustomHeaderButton from '../components/CustomHeaderButton';

const MapScreen = props => {
    const [userLocation, setUserLocation] = useState();
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const [watchId, setWatchID] = useState();

    const setRegion = () => ({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    let locationResult

    const verifyPermissions = async () => {
        try {
            const result = await Permissions.askAsync(Permissions.LOCATION);
            if (result.status !== 'granted') {
                Alert.alert('Insufficient permissions!', [{ text: 'OK!' }]);
            } else {
                setHasLocationPermission(true);
                console.log("Permission for LOCATION granted");
                locationResult = await Location.watchPositionAsync({accuracy:Location.Accuracy.High}, (newUserLocation) => {
                    setUserLocation({
                        latitude: newUserLocation.coords.latitude,
                        longitude: newUserLocation.coords.longitude
                });
                });
            }
        } catch (err) {
            console.log(err)
        }

    }
    useEffect(() => {
        verifyPermissions();

        return () => {
            locationResult.remove();
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
        headerTitle: 'Map'
        // headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        //     <Item
        //         title="Add Place"
        //         iconName='md-camera'
        //         onPress={() => {
        //             navData.navigation.navigate('AR');
        //         }}
        //     />

        // </HeaderButtons>
    }
}

export default MapScreen;