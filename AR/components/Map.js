import React, { useState, useMemo, useEffect } from 'react';
import { StyleSheet, Dimensions, ToastAndroid, View } from 'react-native';
import UserMarker from './UserMarker';
import PlaneMarker from './PlaneMarker';
import MapView from 'react-native-maps';
import RangeSlider from './RangeSlider';
import * as API from '../api';

const Map = props => {
    const [observationRange, setObservationRange] = useState(80);
    const [latDelta, setLatDelta] = useState(2.8522);
    const [lngDelta, setLngDelta] = useState(2.7421);
    const [mapLat, setMapLat] = useState(props.userLat);
    const [mapLng, setMapLng] = useState(props.userLng);
    const [planes, setPlanes] = useState();

    useEffect(() => {
        API.connectToSocket();
        const planeSubject = API.getPlaneSubject();
        API.getPlanes(props.userLat, props.userLng, observationRange);
        let toastAlreadyShown;
        planeSubject.subscribe(data => {
            if (data.length) {
                toastAlreadyShown = false;
                setPlanes(data);
            } 
            else if (toastAlreadyShown === false && data.length === 0){
                toastAlreadyShown = true;
                ToastAndroid.show('No planes in given range!', ToastAndroid.LONG);
                setPlanes([]);
            }
        });
        return () => {
            API.disconnectPlaneScoket();
        }
    }, []);

    const onRegionChangeHandler = (region) => {
        setMapLat(region.latitude)
        setMapLng(region.longitude)
        setLatDelta(region.latitudeDelta);
        setLngDelta(region.longitudeDelta);
    }
    const setRegion = (lat, lng) => ({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 2.8522,
        longitudeDelta: 2.7421
    });

    const sliderSlidingHandler = (value) => {
        API.getPlanes(props.userLat, props.userLng, value);
    };
    const updateObservationRangeHandler = (value) => {
        setObservationRange(value);
    }

    let MapComponent = useMemo(() => (

        <MapView
        onRegionChangeComplete={(reg) => onRegionChangeHandler(reg)}
        showsCompass
        rotateEnabled={false}
        region={{
            latitude: mapLat,
            longitude: mapLng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta
        }} style={styles.mapStyle} >
        <UserMarker
            setRegion={setRegion}
            userLat={props.userLat}
            userLng={props.userLng}
        />
        {planes ? planes.map((plane => {
            return (
                <PlaneMarker key={plane.icao24} plane={plane} onPlaneTapHandler={props.onPlaneTapHandler} setRegion={setRegion} />
            )
        })) : null }

    </MapView>
   ), [planes])

   let Slider = useMemo(() => (
    <RangeSlider 
    sliderSlidingHandler={sliderSlidingHandler}
    updateObservationRangeHandler={updateObservationRangeHandler}
    observationRange={observationRange}
/>
   ), [observationRange])
    return (
        <View style={styles.container}>
            {MapComponent}
            {Slider}
        </View>
    )
}

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
    }
})
export default Map;