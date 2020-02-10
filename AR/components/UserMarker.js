import React, { useEffect, useState, useRef } from 'react';
import * as Location from 'expo-location';
import {Marker} from 'react-native-maps'

const UserMarker = props => {
    const [deviceHeading, setDeviceHeading] = useState(0);
    const prevDeviceHeading = useRef();
    useEffect(() => {
        prevDeviceHeading.current = deviceHeading;
    });
    useEffect(() => {
        Location.watchHeadingAsync((heading) => {
            let prevHeading = prevDeviceHeading.current;
            let newHeading = parseInt(heading.trueHeading);
            let phi = Math.abs(newHeading - prevHeading) % 360;
            let distance = phi > 180 ? 360 - phi : phi;
            if (distance >= 10){
                setDeviceHeading(newHeading);
            }
        });
    }, [])

    return (
        <Marker
            coordinate={props.setRegion(props.userLat, props.userLng)}
            image={deviceHeading ? require('../assets/blue-dot-heading.png') : require('../assets/blue-dot.png')}
            rotation={parseInt(deviceHeading)}
        />
    );
}

export default UserMarker;