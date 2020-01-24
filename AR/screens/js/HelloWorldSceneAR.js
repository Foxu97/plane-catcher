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
import * as API from '../../api';

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: "Initializing AR...",
      heading: null,
      userLocation: null,
      hasARInitialized: false,
      planes: null
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
//    this._latLongToMerc = this._latLongToMerc.bind(this);
  //  this._transformPointToAR = this._transformPointToAR.bind(this);
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    // this._getWorldDirections = this._getWorldDirections.bind(this);
    this._getHeadingAsync = this._getHeadingAsync.bind(this);

    this.serverLog = this.serverLog.bind(this);
  }

  componentDidMount(){
    //this._getHeadingAsync()
  }

  _getHeadingAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access heading was denied',
      });
    }

    let heading = await Location.getHeadingAsync();
    heading = heading.trueHeading.toFixed();
    // API.getPlanes(userLat, userLng, 150, heading)
    this.serverLog(heading);
    //let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    //this.setState({ location: location });
    return heading;

  };


  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onTrackingUpdated} >
        {this.state.planes ? this.state.planes.map((plane) => {
          return <ViroText 
          key={plane.icao24} 
          text={plane.icao24} 
          scale={[1, 1, 1]} 
          transformBehaviors={["billboard"]} 
          position={[plane.arPoint.x, plane.arPoint.y, plane.arPoint.z]} 
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
        async () => {
          await this._onInitialized();
        }
      );
    }else if (state == ViroConstants.TRACKING_NONE) {
      // Handle loss of tracking
      this.serverlog("stopping watching planes from AR")
      API.stopWatchingPlanesAR();
    }
  };



  async _onInitialized() {
    const heading = await this._getHeadingAsync()
    API.getPlanesAR(this.props.arSceneNavigator.viroAppProps.latitude, this.props.arSceneNavigator.viroAppProps.longitude, 70, heading);
    const planesSubscription = API.getPlaneSubjectAR();
    planesSubscription.subscribe(value => {
        this.serverLog(value.length)
        this.setState({
          planes: value
        });
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
