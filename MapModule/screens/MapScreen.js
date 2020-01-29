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

import axios from 'axios';

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

    let timeoutIDS = [];
    const BASE_URL = "http://plane-catcher-backend.herokuapp.com/"
    //const BASE_URL = "http://192.168.74.107:8082/";

    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 2.8522,
        longitudeDelta: 2.7421
    });

    useEffect(() => {
        runGetPlanes();
        return () => {
            timeoutIDS.forEach(id => {
                clearTimeout(id);
            })
        }
    }, [observationRange])

    const runGetPlanes = useCallback(() => {
        timeoutIDS.forEach(id => {
            clearTimeout(id);
        })
        let url = `${BASE_URL}plane?latitude=${userLat.toString()}&longitude=${userLng.toString()}&range=${observationRange}&heading=-1`;
        getPlanes(url);
    }, [observationRange]);

    const getPlanes = (url) => {
        axios.get(url).then(res => {
            if(res.data.data){
                setPlanes(res.data.data);
                let timeoutid = setTimeout(() => runGetPlanes(), 2000);
                timeoutIDS.push(timeoutid);
            }
        }).catch(err => {
            ToastAndroid.show('No planes in given range!', ToastAndroid.LONG);
            setPlanes([])
        })
    }
 
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
    const sliderSlidingHandler = (value) => {
        setObservationRange(value);
    }


    return (

        useMemo(() => (
            <View style={styles.container}>

                {userLat && userLng ?
                    <View style={styles.container}>
                    <View style={styles.rangeStyles}><Text style={styles.rangeTextStyles}>{observationRange + "KM"}</Text></View>
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
                        />
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
    sliderStyle: {
        position: "relative",
        zIndex: 10,
        marginLeft: "65%",
        marginBottom: 120,
        width: 350,
        height: 40,
        transform: [{ rotate: `-90deg` }]
    },
    rangeStyles: {
        zIndex: 100,
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: Colors.primary,
        padding: 3,
        borderTopLeftRadius: 6
       
    },
    rangeTextStyles: {
        fontSize: 24,
        color: "white"
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
        headerTitle: "Map",
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