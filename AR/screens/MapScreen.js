import React, { useState, useEffect, useMemo } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MapView from 'react-native-maps';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Dimensions, ToastAndroid, Text } from 'react-native';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import Colors from '../constants/Colors';
import manMarker from '../assets/standing-up-man.png';
import planeMarker from '../assets/plane.png';
import headingMarker from '../assets/up.png';
import { ActivityIndicator } from 'react-native';
import * as API from '../api';
import PlaneInfo from '../components/PlaneInfo';
import CustomHeaderButton from '../components/CustomHeaderButton';
import * as planesActions from '../store/planes/planes-actions';

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';

import CompassHeading from 'react-native-compass-heading';


const MapScreen = props => {
    const dispatch = useDispatch();
    const [planes, setPlanes] = useState();
    const [latDelta, setLatDelta] = useState(2.8522);
    const [lngDelta, setLngDelta] = useState(2.7421);
    const userLat = useSelector(state => state.planes.latitude);
    const userLng = useSelector(state => state.planes.longitude);

    const [compassHeading, setCompassHeading] = useState(null);

    const [mapLat, setMapLat] = useState(userLat);
    const [mapLng, setMapLng] = useState(userLng);
    const store = useStore();

    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 2.8522,
        longitudeDelta: 2.7421
    });

    useEffect(() => {
        if (!props.isFocused) {
            API.stopWatchingPlanes();
            CompassHeading.stop();
        } else {
            const degree_update_rate = 3;
            CompassHeading.start(degree_update_rate, degree => {
              setCompassHeading(degree);
            });
            API.getPlanes(userLat, userLng, 130)
            const planesSubscription = API.getPlaneSubject();
            planesSubscription.subscribe(value => {
                if (value.length){
                    setPlanes(value);
                }
            });
        }
    }, [props.isFocused]);

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


    useEffect(() => {
        const degree_update_rate = 3;
        
        CompassHeading.start(degree_update_rate, degree => {
          setCompassHeading(degree);
        });
        
        return () => {
          CompassHeading.stop();
        };
    }, []) // maybe i should call it only once on isFocused

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
                            {compassHeading ? <MapView.Marker
                                coordinate={setRegion(userLat, userLng)}
                                image={headingMarker}
                                rotation={compassHeading}
                            /> : null}
                            {planes ? planes.map((plane => {
                                return (<MapView.Marker
                                    coordinate={setRegion(plane.latitude, plane.longitude)}
                                    rotation={plane.trueTrack}
                                    image={planeMarker}
                                    key={plane.icao24}
                                    onPress={(e) => { e.stopPropagation(); onPlaneTapHandler(plane) }}
                                >   
                                    
                                    {plane.altitude ? <Text
                                    style={{
                                        transform: [{ rotate: `-${plane.trueTrack}deg`}],
                                        color: Colors.accent,
                                        zIndex: 9,
                                        width: 40,
                                        height: 40,
                                        textAlign: "center",
                                        marginTop: 36
                                    }}
                                    >{(plane.altitude / 1000).toFixed() + "km"}</Text> : null}
                                    


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
                ), [planes, compassHeading])
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

export default withNavigationFocus(MapScreen);