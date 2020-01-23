import React, { useState, useEffect, useMemo } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Dimensions, ToastAndroid } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';


import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man-.png';
import planeMarker from '../assets/plane.png';
import { ActivityIndicator } from 'react-native';
import * as API from '../api';
import PlaneInfo from '../components/PlaneInfo';
import CustomHeaderButton from '../components/CustomHeaderButton';
import * as planesActions from '../store/planes/planes-actions';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

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
    const dispatch = useDispatch();
    const [planes, setPlanes] = useState();
    const [latDelta, setLatDelta] = useState(0.0922);
    const [lngDelta, setLngDelta] = useState(0.0421);
    const userLat = useSelector(state => state.planes.latitude);
    const userLng = useSelector(state => state.planes.longitude);
    const [mapLat, setMapLat] = useState(userLat);
    const [mapLng, setMapLng] = useState(userLng);
    const store = useStore();

    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });

    useEffect(() => {
        const planesSubscription = API.getPlaneSubject();
        planesSubscription.subscribe(value => {
            setPlanes(value)
        });

        // return () => {
        //     API.planesSubject.unsubscribe();
        // }
    }, []);

    const onRegionChangeHandler = (region) => {
        setMapLat(region.latitude)
        setMapLng(region.longitude)
        setLatDelta(region.latitudeDelta);
        setLngDelta(region.longitudeDelta);
    }
    const onPlaneTapHandler = (plane) => {
        dispatch(planesActions.addPlaneToHistory(plane));
        const state = store.getState();
        props.navigation.setParams({observationHistory: state.planes.observationHistory});
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
                                    onPress={(e) => {e.stopPropagation(); onPlaneTapHandler(plane)}}
                                >
                                    <Callout>
                                        <PlaneInfo
                                            icao24={plane.icao24}
                                            callsign={plane.callsign}
                                            velocity={plane.velocity ? (plane.velocity * 60 * 60 / 1000).toFixed() + "km/h" : "N/A"}
                                            altitude={plane.altitude ? plane.altitude.toFixed() + "m" : "N/A"}
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
    const observationHistory = navData.navigation.getParam('observationHistory');
    const saveFile = async (data) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        serverlog(status)
        if (status === "granted") {
            const today = new Date();
            const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
            let fileUri = FileSystem.documentDirectory + `observations-${date}-${time}.txt`;
            serverlog(fileUri)
            try {
                await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 });
                const asset = await MediaLibrary.createAssetAsync(fileUri)
                await MediaLibrary.createAlbumAsync("Download", asset, false)
                ToastAndroid.show('All observed planes saved in Download folder!', ToastAndroid.LONG);
            } catch(err) {
                ToastAndroid.show('Something went wrong :(', ToastAndroid.SHORT);
                serverlog("error")
                serverlog(err);
            }
        }
    }
    return {
        headerTitle: 'Map',
        headerRight: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title="Save to file"
                iconName='md-save'
                onPress={async () => {
                    if (observationHistory.length) {
                        saveFile(observationHistory);
                    }
                }}
            />

        </HeaderButtons>
    }
}

export default MapScreen;