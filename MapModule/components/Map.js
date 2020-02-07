import React, { useState, useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import UserMarker from './UserMarker';
import PlaneMarker from './PlaneMarker';
import MapView from 'react-native-maps';
const Map = props => {
    console.log("Map component rendered")
    const [latDelta, setLatDelta] = useState(2.8522);
    const [lngDelta, setLngDelta] = useState(2.7421);
    const [mapLat, setMapLat] = useState(props.userLat);
    const [mapLng, setMapLng] = useState(props.userLng);
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
    const Planes = useMemo(() => {
        console.log("Planes rendered")
        return props.planes ? props.planes.map((plane => {
            return (
                <PlaneMarker key={plane.icao24} plane={plane} onPlaneTapHandler={props.onPlaneTapHandler} setRegion={setRegion} />
            )
        })) : null
    }, [props.planes])
    return (
        useMemo(() => (

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
                {props.planes ? props.planes.map((plane => {
                    return (
                        <PlaneMarker key={plane.icao24} plane={plane} onPlaneTapHandler={props.onPlaneTapHandler} setRegion={setRegion} />
                    )
                })) : null}

            </MapView>
        ), [props.planes])

    )
}

const styles = StyleSheet.create({
    mapStyle: {
        position: 'absolute',
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})
export default Map;