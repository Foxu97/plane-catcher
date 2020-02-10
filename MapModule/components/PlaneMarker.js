import React from 'react';
import { StyleSheet, Image, Text } from 'react-native';
import PlaneInfo from '../components/PlaneInfo';
import { Marker, Callout } from 'react-native-maps';
import Colors from '../constants/Colors';
const PlaneMarker = props => {
    return (
        <Marker
            coordinate={props.setRegion(props.plane.latitude, props.plane.longitude)}
            key={props.plane.icao24}
            onPress={(e) => { e.stopPropagation(); props.onPlaneTapHandler(props.plane) }}
        >
            <Image source={require("../assets/plane.png")} style={{...styles.imageStyle, transform: [{ rotate: `${props.plane.trueTrack}deg` }] }} />
            {props.plane.distanceToPlane ? <Text
                style={styles.planeDistance}
            >{(props.plane.distanceToPlane / 1000).toFixed() + "km"}</Text> : null}
            <Callout>
                <PlaneInfo
                    icao24={props.plane.icao24}
                    callsign={props.plane.callsign}
                    velocity={props.plane.velocity ? (props.plane.velocity * 60 * 60 / 1000).toFixed() + "km/h" : "N/A"}
                    altitude={props.plane.altitude ? props.plane.altitude.toFixed() + "m" : "N/A"}
                />
            </Callout>
        </Marker>
    )
    d
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 36,
        width: 36,
    },
    planeDistance: {
        color: 'white',
        backgroundColor: Colors.primary,
        zIndex: 9,
        textAlign: "center",
        padding: 1,
        borderRadius: 2
    }
})

export default PlaneMarker;