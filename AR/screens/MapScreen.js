import React, { useState, useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';

import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man-.png';
import planeMarker from '../assets/plane.png';
import { ActivityIndicator } from 'react-native';
//import CustomHeaderButton from '../components/CustomHeaderButton';

import { useSelector, useDispatch } from 'react-redux';

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

const MapScreen = props => {
    const planes = useSelector(state => state.planes.planes);
    const userLat = useSelector(state => state.planes.latitude);
    const userLng = useSelector(state => state.planes.longitude);
    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    return (
        <View style={styles.container}>
            {
                userLat && userLng ?
                    <MapView region={{
                        latitude: userLat,
                        longitude: userLng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }} style={styles.mapStyle} >

                        <MapView.Marker
                            coordinate={setRegion(userLat, userLng)}
                            image={manMarker}
                        />
                        {planes ? planes.map((plane => {
                            return <MapView.Marker
                            coordinate={setRegion(plane.latitude, plane.longitude)}
                            image={planeMarker}
                            key={plane.icao24}
                        />
                        })) : null}
                    </MapView>
                    : <ActivityIndicator/>
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