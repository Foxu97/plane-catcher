import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Dimensions, ToastAndroid, Text, Image, Slider } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man.png';
import planeMarker from '../assets/plane.png';
import headingMarker from '../assets/up.png';
import { ActivityIndicator } from 'react-native';
//import * as API from '../api';
import PlaneInfo from '../components/PlaneInfo';
import CustomHeaderButton from '../components/CustomHeaderButton';
import * as planesActions from '../store/planes/planes-actions';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

import io from 'socket.io-client'

const MapScreen = props => {
    const dispatch = useDispatch();
    const [planes, setPlanes] = useState();
    const [latDelta, setLatDelta] = useState(2.8522);
    const [lngDelta, setLngDelta] = useState(2.7421);
    const userLat = useSelector(state => state.planes.latitude);
    const userLng = useSelector(state => state.planes.longitude);
    const [observationRange, setObservationRange] = useState(80);
    const [mapLat, setMapLat] = useState(userLat);
    const [mapLng, setMapLng] = useState(userLng);
    const store = useStore();
    const [deviceHeading, setDeviceHeading] = useState(null);
    const BASE_URL = "http://192.168.74.254:8082/";

    let socket, planeSocket
    //const BASE_URL = "http://plane-catcher-backend.herokuapp.com/"

    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 2.8522,
        longitudeDelta: 2.7421
    });
    useEffect(() => {
        socket = io();
        planeSocket = io(BASE_URL);
        planeSocket.on('connect', () => {
            console.log('connected to socket server');
        });
        planeSocket.emit('getPlanesInRange', userLat, userLng, observationRange, deviceHeading);
        let toastAlreadyShown = false;
        planeSocket.on('fetchedPlanesInRange', (planes) => {
            if (planes && planes.data) {
                setPlanes(planes.data);
                toastAlreadyShown = false;
            } else {
                setPlanes([]);
                if (!toastAlreadyShown) {
                    ToastAndroid.show('No planes in given range!', ToastAndroid.LONG);
                    toastAlreadyShown = true;
                }
            }
        })

        return () => {
            planeSocket.disconnect();
        }
    }, [])

    const onRegionChangeHandler = (region) => {
        setMapLat(region.latitude)
        setMapLng(region.longitude)
        setLatDelta(region.latitudeDelta);
        setLngDelta(region.longitudeDelta);
    }
    const onPlaneTapHandler = (plane) => {
        dispatch(planesActions.addPlaneToHistory(plane));
        const state = store.getState();
        props.navigation.setParams({ observationHistory: state.planes.observationHistory });
    }
    const sliderSlidingHandler = useCallback((value) => {
        planeSocket.emit('getPlanesInRange', userLat, userLng, value, deviceHeading);
    }, [planeSocket]);
    const updateObservationRangeHandler = (value) => {
        setObservationRange(value);
    }


    return (

        useMemo(() => (
            <View style={styles.container}>

                {userLat && userLng ?
                    <View style={styles.container}>
                        <MapView
                            onRegionChange={(reg) => onRegionChangeHandler(reg)}
                            showsCompass
                            region={{
                                latitude: mapLat,
                                longitude: mapLng,
                                latitudeDelta: latDelta,
                                longitudeDelta: lngDelta
                            }} style={styles.mapStyle} >

                            {/* {deviceHeading ? <MapView.Marker
                                coordinate={setRegion(userLat, userLng)}
                                image={headingMarker}
                                rotation={parseInt(deviceHeading)}
                            /> : null} */}

                            <MapView.Marker
                                coordinate={setRegion(userLat, userLng)}
                                image={manMarker}
                            />
                            {planes ? planes.map((plane => {
                                return (<MapView.Marker
                                    coordinate={setRegion(plane.latitude, plane.longitude)}
                                    key={plane.icao24}
                                    onPress={(e) => { e.stopPropagation(); onPlaneTapHandler(plane) }}
                                >
                                    <Image source={require("../assets/plane.png")} style={{ height: 36, width: 36, transform: [{ rotate: `${plane.trueTrack}deg` }] }} />
                                    {plane.distanceToPlane ? <Text
                                        style={{
                                            color: 'white',
                                            backgroundColor: Colors.primary,
                                            zIndex: 9,
                                            textAlign: "center",
                                            padding: 1,
                                            borderRadius: 2
                                        }}
                                    >{(plane.distanceToPlane / 1000).toFixed() + "km"}</Text> : null}
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

                        </MapView>
                            <View style={styles.sliderWrapper}>
                        <Slider
                            style={styles.sliderStyle}
                            minimumValue={5}
                            maximumValue={200}
                            step={5}
                            value={80}
                            minimumTrackTintColor={Colors.primary}
                            maximumTrackTintColor={Colors.primary}
                            thumbTintColor={Colors.accent}
                            onSlidingComplete={sliderSlidingHandler}
                            onValueChange={updateObservationRangeHandler}
                        />
                        </View>
                        <View style={styles.rangeStyles}><Text style={styles.rangeTextStyles}>{observationRange + "KM"}</Text></View>
                    </View> : <ActivityIndicator />}</View>
        ), [planes, observationRange])

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-end'
    },
    mapStyle: {
        position: 'absolute',
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
    sliderWrapper: {
        width: 20,
        height: 300,
        display: 'flex',
        marginLeft: 'auto',
        zIndex: 10
    },
    sliderStyle: {
        width: 300,
        zIndex: 10,
        flex: 1,
        alignSelf: 'center',
        transform: [{ rotate: `-90deg` }]
    },
    rangeStyles: {
        zIndex: 100,
        backgroundColor: Colors.primary,
        padding: 3,
        borderTopLeftRadius: 6,
        width: 90,
        marginLeft: 'auto'
    },
    rangeTextStyles: {
        fontSize: 24,
        color: "white",
        textAlign:"center"
    }

});

MapScreen.navigationOptions = navData => {
    const observationHistory = navData.navigation.getParam('observationHistory');
    const saveFile = async (data) => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === "granted") {
            const today = new Date();
            const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            const time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
            let fileUri = FileSystem.documentDirectory + `observations-${date}-${time}.txt`;
            try {
                await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data), { encoding: FileSystem.EncodingType.UTF8 });
                const asset = await MediaLibrary.createAssetAsync(fileUri)
                await MediaLibrary.createAlbumAsync("Download", asset, false)
                ToastAndroid.show('All observed planes saved in Download folder!', ToastAndroid.LONG);
            } catch (err) {
                ToastAndroid.show('Something went wrong :(', ToastAndroid.SHORT);
                throw err
            }
        }
    }
    return {
        headerTitle: 'Map',
        headerLeft: <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
                title="AR"
                iconName='md-camera'
                onPress={() => {
                    navData.navigation.navigate("AR");
                }}
            />

        </HeaderButtons>,
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

export default withNavigationFocus(MapScreen);