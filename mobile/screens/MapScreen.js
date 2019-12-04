import React, { useState, useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { View, Text, Button, StyleSheet, Dimensions, Alert, Platform } from 'react-native';

import Colors from '../constants/Colors';
import CustomHeaderButton from '../components/CustomHeaderButton';

const MapScreen = props => {
    const [userLocation, setUserLocation] = useState();

    const planes = [
        {title: "uno", coordinates: {
            latitude: 50.300421, longitude: 18.681935
        }},
        {title: "secundo", coordinates: {
            latitude: 50.543212, longitude: 18.770099
        }}
    ] 


    useEffect(() => {
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
        verifyPermissions().then(result => {
            if (!result){
                return;
            }
            Location.getCurrentPositionAsync({timeout: 5000}).then((location) => {
                setUserLocation(location)
            }).catch(err => {
                Alert.alert(
                    'Could not fetch location!',
                    'Please try again later or pick a location on the map.',
                    [{ text: 'Okay' }]
            );
            });
        });
    }, [])


    return (
        <View style={styles.container}>
            {
                userLocation ? <MapView region={{
                    latitude: userLocation.coords.latitude,
                    longitude: userLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                    }} style={styles.mapStyle} >{planes.map(plane => (
                       <MapView.Marker  
                       coordinate={plane.coordinates}
                       title={plane.title}/>
                    ))}</MapView> :
                    <Text>We need your location permission granted</Text>
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
                iconName={Platform.OS === 'android' ? 'md-camera' : 'ios-add'}
                onPress={() => {
                    navData.navigation.navigate('AR');
                }}
                />
            
            </HeaderButtons>
    }
}

export default MapScreen;