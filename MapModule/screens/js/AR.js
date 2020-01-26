import React, {useEffect, useState} from 'react';
import { StyleSheet, Platform } from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants
} from 'react-viro';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const AR = props => {
    const [northPointX, setNorthPointX] = useState(0);
    const [northPointZ, setNorthPointZ] = useState(0);
    const [southPointX, setSouthPointX] = useState(0);
    const [southPointZ, setSouthPointZ] = useState(0);
    const [eastPointX, setEastPointX] = useState(0);
    const [eastPointZ, setEastPointZ] = useState(0);
    const [westPointX, setWestPointX] = useState(0);
    const [westPointZ, setWestPointZ] = useState(0);
    const [heading, setHeading] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [hasARInitialized, setHasARInitialized] = useState(false);
    const [planes, setPlanes] = useState(null);

    const _onTrackingUpdated = (state, reason) => {
        if (!hasARInitialized && state === ViroConstants.TRACKING_NORMAL) {
            setHasARInitialized(true);
            _onInitialized();
        } 
    }
    const _onInitialized = async() => {
        await _getLocationAsync();
        await _drawPlanesAR();

        const worldDirections = _getWorldDirections(location.coords.latutide, location.coords.longitude);
        const northPoint = _transformPointToAR(worldDirections.north.lat, worldDirections.north.lng);
        const southPoint = _transformPointToAR(worldDirections.south.lat, worldDirections.south.lng);
        const westPoint = _transformPointToAR(worldDirections.west.lat, worldDirections.west.lng);
        const eastPoint = _transformPointToAR(worldDirections.east.lat, worldDirections.east.lng);

        setNorthPointX(northPoint.x);
        setNorthPointZ(northPoint.z);
        setSouthPointX(southPoint.x);
        setSouthPointZ(southPoint.z);
        setWestPointX(westPoint.x);
        setWestPointZ(westPoint.z);
        setEastPointX(eastPoint.x);
        setEastPointZ(eastPoint.z);
    }

    const _getLocationAsync = async() => {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          return;
        }
    
        const heading = await Location.getHeadingAsync();
        _serverLog(heading.accuracy);
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setUserLocation(location);
        setHeading(heading.trueHeading);
    }

    const _getWorldDirections = (lat, lng) => {
        const to4Decimals = number => {
            const rounded = number.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
            return +rounded;
        }
        const with4DecimalsLat = to4Decimals(lat)
        const with4DecimalsLng = to4Decimals(lng)
        const diffrence = 0.0005
    
        const north = {
          lat: with4DecimalsLat + diffrence,
          lng: with4DecimalsLng
        }
        const south = {
          lat: parseFloat((with4DecimalsLat - diffrence).toFixed(4)),
          lng: with4DecimalsLng
        }
        const east = {
          lat: with4DecimalsLat,
          lng: with4DecimalsLng + diffrence
        }
        const west = {
          lat: with4DecimalsLat,
          lng: parseFloat((with4DecimalsLng - diffrence).toFixed(4))
        }
    
        return { north: north, south: south, east: east, west: west }
    }

    const _latLongToMerc = (lat_deg, lon_deg) => {
        const lon_rad = (lon_deg / 180.0 * Math.PI)
        const lat_rad = (lat_deg / 180.0 * Math.PI)
        const sm_a = 6378137.0
        const xmeters = sm_a * lon_rad
        const ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
        return ({ x: xmeters, y: ymeters });
    }
    const _transformPointToAR = (lat, long) => {
        const objPoint = _latLongToMerc(lat, long);
        const devicePoint = _latLongToMerc(location.coords.latitude, location.coords.longitude);
        // latitude(north,south) maps to the z axis in AR
        // longitude(east, west) maps to the x axis in AR
        const objFinalPosZ = objPoint.y - devicePoint.y;
        const objFinalPosX = objPoint.x - devicePoint.x;
        //flip the z, as negative z(is in front of us which is north, pos z is behind(south).
        const angle = heading;
        const angleRadian = (angle * Math.PI) / 180; // degree to radian
        const newRotatedX = objFinalPosX * Math.cos(angleRadian) - objFinalPosZ * Math.sin(angleRadian)
        const newRotatedZ = objFinalPosZ * Math.cos(angleRadian) + objFinalPosX * Math.sin(angleRadian)
    
        return ({ x: newRotatedX, z: -newRotatedZ });
    }

    const _drawPlanesAR = async () => {
        const planes = await _getPlanesFromAPI(location.coords.latitude, location.coords.longitude);
        const calculatedARPlanes = [];

        planes.forEach(plane => {
            const arPoint = _transformPointToAR(plane.arLatitude, plane.arLongitude);
            plane.arX = arPoint.x;
            plane.arZ = arPoint.z;
        });

        setPlanes(calculatedARPlanes);
    }

    const _getPlanesFromAPI = async(userLatitude, userLongitude, range) => {
        return fetch(`http://192.168.74.254:8080/plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=50`).then(res => {
            return res.json();
        }).then(data => {
            return data;
        });
    }

    const _serverLog = (message) => {
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

    
    return (
        <ViroARScene onTrackingUpdated={_onTrackingUpdated} >
        {heading ? <ViroText text={heading.toString()} scale={[.2, 2, .2]} position={[0, -2, -5]} style={styles.helloWorldTextStyle} /> : null}
        {northPointX ? <ViroText text={"North Text" + northPointX} scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[northPointX, 0, northPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {southPointX ? <ViroText text="South Text" scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[southPointX, 0, southPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {westPointX ? <ViroText text="West Text" scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[westPointX, 0, westPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {eastPointX ? <ViroText text="East Text" scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[eastPointX, 0, eastPointZ]} style={styles.helloWorldTextStyle} /> : null}
      

        {planes ? planes.map((plane) => {
          return <ViroText 
          key={plane.latutide} 
          text={plane.currentPositionDescription.toString()} 
          scale={[1.75, 1.75, 1.75]} 
          transformBehaviors={["billboard"]} 
          position={[plane.arX, 0, plane.arZ]} 
          style={styles.helloWorldTextStyle} />
        }) : null}

      </ViroARScene>
    )
}

const styles = StyleSheet.create({
    helloWorldTextStyle: {
      fontFamily: 'Arial',
      fontSize: 30,
      color: '#ff0000',
      textAlignVertical: 'center',
      textAlign: 'center',
    },
  });

export default AR;