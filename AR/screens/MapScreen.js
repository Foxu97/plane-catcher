import React, { useState, useEffect, useMemo } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Dimensions } from 'react-native';

import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man-.png';
import planeMarker from '../assets/plane.png';
import { ActivityIndicator } from 'react-native';
import * as API from '../api';
import PlaneInfo from '../components/PlaneInfo';
import CustomHeaderButton from '../components/CustomHeaderButton';

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
    const [planes, setPlanes] = useState();
    const [latDelta, setLatDelta] = useState(0.0922);
    const [lngDelta, setLngDelta] = useState(0.0421);
    const userLat = useSelector(state => state.planes.latitude);
    const userLng = useSelector(state => state.planes.longitude);
    const [mapLat, setMapLat] = useState(userLat);
    const [mapLng, setMapLng] = useState(userLng);
    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    useEffect(() => {
        API.planesSubject.subscribe(value => {
            setPlanes(value)
        });

        return () => {
            API.planesSubject.unsubscribe();
        }
    }, []);

    const onRegionChangeHandler = (region) => {
        setMapLat(region.latitude)
        setMapLng(region.longitude)
        setLatDelta(region.latitudeDelta);
        setLngDelta(region.longitudeDelta);
    }

    return (
        <View style={styles.container}>
            {
                useMemo(() => (
                    userLat && userLng ?
                        (<MapView
                            onRegionChange={(reg) => onRegionChangeHandler(reg)}
                            region={{
                                latitude: mapLat,
                                longitude: mapLng,
                                latitudeDelta: latDelta,
                                longitudeDelta: lngDelta
                            }} style={styles.mapStyle} >

                            <MapView.Marker
                                coordinate={setRegion(userLat, userLng)}
                                image={manMarker}
                            />
                            {planes ? planes.map((plane => {
                                return (<MapView.Marker
                                    coordinate={setRegion(plane.latitude, plane.longitude)}
                                    rotation={plane.trueTrack}
                                    image={planeMarker}
                                    key={plane.icao24}

                                >
                                    <Callout>
                                        <PlaneInfo
                                            departure={plane.departure}
                                            aircraft={plane.aircraft}
                                            flight={plane.flight}
                                            arrival={plane.arrival}
                                            airline={plane.airline}
                                        />
                                    </Callout>
                                </MapView.Marker>)
                            })) : null}
                        </MapView>) : <ActivityIndicator />
                ), [planes])
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
                title="Save to file"
                iconName='md-save'
                onPress={() => {
                    console.log('save to file');
                }}
            />

        </HeaderButtons>
    }
}

export default MapScreen;