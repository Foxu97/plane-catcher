'use strict';

import React, { Component } from 'react';

import { StyleSheet, Platform } from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants
} from 'react-viro';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: "Initializing AR...",
      northPointX: 0,
      northPointZ: 0,
      southPointX: 0,
      southPointZ: 0,
      eastPointX: 0,
      eastPointZ: 0,
      westPointX: 0,
      westPointZ: 0,
      churchPointX: 0,
      churchPointZ: 0,
      heading: null,
      userLocation: null,
      hasARInitialized: false,
      planes: null
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._latLongToMerc = this._latLongToMerc.bind(this);
    this._transformPointToAR = this._transformPointToAR.bind(this);
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._getWorldDirections = this._getWorldDirections.bind(this);

    this.serverLog = this.serverLog.bind(this);
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let heading = await Location.getHeadingAsync();
    this.serverLog(heading.accuracy);
    let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    this.setState({ location: location });
    this.setState({ heading: heading.trueHeading });

  };


  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onTrackingUpdated} >
        {this.state.heading ? <ViroText text={this.state.heading.toString()} scale={[.2, 2, .2]} position={[0, -2, -5]} style={styles.helloWorldTextStyle} /> : null}
        {this.state.northPointX ? <ViroText text={"North Text" + this.state.northPointX} scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[this.state.northPointX, 0, this.state.northPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {this.state.southPointX ? <ViroText text="South Text" scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[this.state.southPointX, 0, this.state.southPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {this.state.westPointX ? <ViroText text="West Text" scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[this.state.westPointX, 0, this.state.westPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {this.state.eastPointX ? <ViroText text="East Text" scale={[3, 3, 3]} transformBehaviors={["billboard"]} position={[this.state.eastPointX, 0, this.state.eastPointZ]} style={styles.helloWorldTextStyle} /> : null}
        {this.state.churchPointX ? <ViroText text={"Church Text " + this.state.churchPointX.toString()} scale={[13, 13, 13]} transformBehaviors={["billboard"]} position={[this.state.churchPointX, 0, this.state.churchPointZ]} style={styles.helloWorldTextStyle} /> : null}

        {this.state.planes ? this.state.planes.map((plane) => {
          return <ViroText 
          key={plane.icao24} 
          text={plane.icao24} 
          scale={[1.75, 1.75, 1.75]} 
          transformBehaviors={["billboard"]} 
          position={[plane.arPoint.x, 0, plane.arPoint.z]} 
          style={styles.helloWorldTextStyle} />
        }) : <ViroText 
          text="No plane fetched yet"
          position={[0, 0, -2]}
          style={styles.helloWorldTextStyle}
        />}

      </ViroARScene>
    );
  }

  _onTrackingUpdated(state, reason) {
    if (!this.state.hasARInitialized && state === ViroConstants.TRACKING_NORMAL) {
      this.setState(
        {
          hasARInitialized: true,
        },
        () => {
          this._onInitialized();
        }
      );
    }
  };

  _getWorldDirections(lat, lng) {
    function to4Decimals(number) {
      const rounded = number.toString().match(/^-?\d+(?:\.\d{0,4})?/)[0];
      return +rounded;
    }
    var with4DecimalsLat = to4Decimals(lat)
    var with4DecimalsLng = to4Decimals(lng)
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

  async _drawPlanesAR() {
    const planes = await this._getPlanesFromAPI(this.state.location.coords.latitude, this.state.location.coords.longitude, 100, this.state.heading);
    // let calculatedArPlanes = [];

    // planes.forEach((plane) => {
    //   const arPoint = this._transformPointToAR(plane.arLatitude, plane.arLongitude);
    //   plane.arX = arPoint.x;
    //   plane.arZ = arPoint.z;
    //   calculatedArPlanes.push(plane);
    // })
    //this.serverLog(calculatedArPlanes);
    this.setState({planes: planes});
    // this.state.planes.forEach(plane => {
    //   this.serverLog(plane.arPoint.x)
    //   this.serverLog(plane.arPoint.z)
    // })
    this.serverLog(planes)
  }

  async _onInitialized() {
    await this._getLocationAsync();
    await this._drawPlanesAR();
    
    var churchPoint = this._transformPointToAR(50.14234912735104, 18.777355030561928);
    const worldDirections = this._getWorldDirections(this.state.location.coords.latitude, this.state.location.coords.longitude);
    var northPoint = this._transformPointToAR(worldDirections.north.lat, worldDirections.north.lng);
    var eastPoint = this._transformPointToAR(worldDirections.east.lat, worldDirections.east.lng);
    var westPoint = this._transformPointToAR(worldDirections.west.lat, worldDirections.west.lng);
    var southPoint = this._transformPointToAR(worldDirections.south.lat, worldDirections.south.lng);

    // this.serverLog(southPoint.x) 
    this.setState({
      northPointX: northPoint.x,
      northPointZ: northPoint.z,
      southPointX: southPoint.x,
      southPointZ: southPoint.z,
      eastPointX: eastPoint.x,
      eastPointZ: eastPoint.z,
      westPointX: westPoint.x,
      westPointZ: westPoint.z,
      churchPointX: churchPoint.x,
      churchPointZ: churchPoint.z,
      text: "AR Init called."
    });
  }

  _latLongToMerc(lat_deg, lon_deg) {
    var lon_rad = (lon_deg / 180.0 * Math.PI)
    var lat_rad = (lat_deg / 180.0 * Math.PI)
    var sm_a = 6378137.0
    var xmeters = sm_a * lon_rad
    var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
    return ({ x: xmeters, y: ymeters });
  }

  _transformPointToAR(lat, long) {
    var objPoint = this._latLongToMerc(lat, long);
    var devicePoint = this._latLongToMerc(this.state.location.coords.latitude, this.state.location.coords.longitude);
    console.log("objPointZ: " + objPoint.y + ", objPointX: " + objPoint.x)
    // latitude(north,south) maps to the z axis in AR
    // longitude(east, west) maps to the x axis in AR
    var objFinalPosZ = objPoint.y - devicePoint.y;
    var objFinalPosX = objPoint.x - devicePoint.x;
    //flip the z, as negative z(is in front of us which is north, pos z is behind(south).
    let angle = this.state.heading;
    const angleRadian = (angle * Math.PI) / 180; // degree to radian
    let newRotatedX = objFinalPosX * Math.cos(angleRadian) - objFinalPosZ * Math.sin(angleRadian)
    let newRotatedZ = objFinalPosZ * Math.cos(angleRadian) + objFinalPosX * Math.sin(angleRadian)

    return ({ x: newRotatedX, z: -newRotatedZ });
  }

  async _getPlanesFromAPI(userLatitude, userLongitude, range, heading) {
    return fetch(`http://192.168.74.254:8080/plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=50&heading=${heading}`).then(res => {
      return res.json();
  }).then(data => {
      return data;
  });
  }

  serverLog(message) {
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

}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ff0000',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

module.exports = HelloWorldSceneAR;
