'use strict';

import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';

import {
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroFlexView
} from 'react-viro';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as API from '../../api';

export default class HelloWorldSceneAR extends Component {

  constructor() {
    super();
    this.state = {
      text: "Initializing AR...",
      heading: null,
      userLocation: null,
      hasARInitialized: false,
      planes: null
    };

    this._onInitialized = this._onInitialized.bind(this);
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._getHeadingAsync = this._getHeadingAsync.bind(this);
  }


  _getHeadingAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access heading was denied',
      });
    }

    let heading = await Location.getHeadingAsync();
    heading = parseInt(heading.trueHeading);

    return heading;
  };


  render() {
    return (
      <ViroARScene onTrackingUpdated={this._onTrackingUpdated} >

      {!this.state.hasARInitialized ? <ViroText 
          text="Stabilize device"
          position={[0, 0, -2]}
          style={styles.helloWorldTextStyle}
        /> : null }


        {this.state.hasARInitialized && this.state.planes ? this.state.planes.map((plane) => {
          return <ViroFlexView
              key={plane.icao24}
              backgroundColor="#00a1e488"
              height={2.6}
              width={3.5}
              position={[plane.arPoint.x, plane.arPoint.y, plane.arPoint.z]}
              transformBehaviors={["billboard"]}
              style={styles.planeInfoTile}
              
          >
            <ViroFlexView style={styles.infoStrip}>
              <ViroText text="ICAO24: " style={styles.helloWorldTextStyle}/>
              <ViroText text={plane.icao24} style={styles.helloWorldTextStyle}/>
            </ViroFlexView>
            <ViroFlexView style={styles.infoStrip}>
              <ViroText text="CALLSIGN: " style={styles.helloWorldTextStyle}/>
              <ViroText text={plane.callsign.trim()} style={styles.helloWorldTextStyle}/>
            </ViroFlexView>
            <ViroFlexView style={styles.infoStrip}>
              <ViroText text="Velocity: " style={styles.helloWorldTextStyle}/>
              <ViroText text={(plane.velocity* 60 * 60 / 1000).toFixed() + "km/h" } style={styles.helloWorldTextStyle}/>
            </ViroFlexView>
            <ViroFlexView style={styles.infoStrip}>
              <ViroText text="Altitude: " style={styles.helloWorldTextStyle}/>
              {plane.altitude ? <ViroText text={(plane.altitude.toFixed()) + "m" } style={styles.helloWorldTextStyle}/> : <ViroText text="N/A" style={styles.helloWorldTextStyle}/>}
              
            </ViroFlexView>
            <ViroFlexView style={styles.infoStrip}>
              <ViroText text="Distance" style={styles.helloWorldTextStyle}/>
              {plane.distanceInLine ? <ViroText text={(plane.distanceInLine / 1000).toFixed() + "km" } style={styles.helloWorldTextStyle}/> : <ViroText text="N/A" style={styles.helloWorldTextStyle}/>}
              
            </ViroFlexView>
            
            </ViroFlexView>
        }) : <ViroText 
          text="No planes fetched!"
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
      API.stopWatchingPlanesAR();
    }
  };



  async _onInitialized() {
    const heading = await this._getHeadingAsync()
    API.getPlanesAR(this.props.arSceneNavigator.viroAppProps.latitude, this.props.arSceneNavigator.viroAppProps.longitude, 130, heading);
    const planesSubscription = API.getPlaneSubjectAR();
    planesSubscription.subscribe(value => {
        if(value.length) {
          this.setState({
            planes: value
          });
        }
    });  
  }

}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
    width: 1.5

  },
  planeInfoTile: {
    flexDirection: 'column',
    padding: .25,
    justifyContent: 'center'

  },
  infoStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: .25
  }
});



module.exports = HelloWorldSceneAR;
