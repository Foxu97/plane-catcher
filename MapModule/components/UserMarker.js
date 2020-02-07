import React, { useEffect, useState, useRef } from 'react';
import {}from 'react-native';
import * as Location from 'expo-location';
import {Marker} from 'react-native-maps'

import headingMarker from '../assets/blue-dot-heading.png';

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
        deviceHeading ? <Marker
            coordinate={props.setRegion(props.userLat, props.userLng)}
            image={headingMarker}
            rotation={parseInt(deviceHeading)}
        /> : null
    );
}

export default UserMarker;