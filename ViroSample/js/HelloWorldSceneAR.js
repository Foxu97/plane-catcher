'use strict';
import React, { Component } from 'react';
import {StyleSheet,NativeEventEmitter,DeviceEventEmitter,AsyncStorage,PermissionsAndroid} from 'react-native';
//import ReactNativeHeading from 'react-native-heading';
import Geolocation from 'react-native-geolocation-service'
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroConstants,
  ViroImage,
  ViroARPlane,
  ViroBox,  
} from 'react-viro';
// import RNSimpleCompass from 'react-native-simple-compass';
// import CompassHeading from 'react-native-compass-heading';
const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
export default class HelloWorldSceneAR extends Component {
  async requestLocationPermission() 
  {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    this.setState({
            latitude: 50.141967,
            longitude: 18.776402,         
            error: null
          });
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   //console.log("You can use the location")
    //   //alert("You can use the location");
    //   Geolocation.getCurrentPosition((Degree=this.state.Degree) => { //change to position if degree doesnt work
    //     this.setState({
    //       latitude: Degree.coords.latitude,
    //       longitude: Degree.coords.longitude,         
    //       error: null,
    //       string: String(Degree.coords.latitude)
    //     });
    //   }, (error) => this.setState({error: error.message}),
    //   { enableHighAccuracy: true}
    //   )
    // } else {
    //   //console.log("location permission denied")
    //   alert("Location permission denied");
    // }
    return granted;
  } catch (err) {
    console.warn(err)
  }
}
  constructor() {
    super();
   this.requestLocationPermission=this.requestLocationPermission.bind(this);
    // Set initial state here
    this.state = {
      text: "Initializing AR...",
      latitude: 0,
      longitude: 0,
      femalefirstX: 0,
      femalefirstZ: 0,
      appleX: 0,
      appleZ: 0,    
      civilX: 0,
      civilZ: 0,
      subjailX: 0,
      subjailZ: 0,
      dhirajX: 0,
      dhirajZ: 0,     
      headingAngle:0,
      headAngle:0
    };
    // console.log(CompassHeading)
    // CompassHeading.start(degree_update_rate, (degree) => {
    //   this.setState({Degree: degree});      
    //   CompassHeading.stop();     
    // });
    
    // bind 'this' to functions   
    this._onInitialized = this._onInitialized.bind(this);
    this._latLongToMerc = this._latLongToMerc.bind(this);   
    this._transformPointToAR = this._transformPointToAR.bind(this);   
  }
  updateHead(){    
    AsyncStorage.setItem('headstart',JSON.stringify( this.state.headingAngle))
  }  
  componentDidMount() {    
   this.requestLocationPermission();   
    //ReactNativeHeading.start(1)
	//.then(didStart => {
		// this.setState({
		// 	headingIsSupported: didStart,   })
    // }) 
     var flag = 0
     DeviceEventEmitter.addListener('headingUpdated', heading => {
      this.setState({headingAngle:heading})
      //console.log('heading State',heading)
      if(flag == 0){
        this.updateHead()
      }
      flag = 1
    });    
    this.updateHead()
  }
  componentWillUnmount() {    
    //ReactNativeHeading.stop();
  	DeviceEventEmitter.removeAllListeners('headingUpdated');
  }
  render() {
    return (<ViroARScene onTrackingUpdated={this._onInitialized}>   
          <ViroText  text="female first hospital"  transformBehaviors={["billboard"]} scale={[0.2, 0.2, 0.2]}  position={[this.state.femalefirstX, 0, 2]}  style={styles.helloWorldTextStyle} />
           <ViroText text="apple hospital" scale={[4, 4, 4]} transformBehaviors={["billboard"]}  position={[this.state.appleX, 0, 2]} style={styles.helloWorldTextStyle} />
           <ViroText text="civil hospital" scale={[4,4,4]} transformBehaviors={["billboard"]}  position={[this.state.civilX, 0, 2]} style={styles.helloWorldTextStyle} />
          {/* <ViroText text="subjail" scale={[3, 3, 3]} transformBehaviors={["billboard"]}  position={[this.state.subjailX, 0, this.state.subjailZ]} style={styles.helloWorldTextStyle} />
          <ViroText text="dhiraj sons" scale={[5, 5, 5]} transformBehaviors={["billboard"]}  position={[this.state.dhirajX, 0, this.state.dhirajZ]} style={styles.helloWorldTextStyle} /> */}
    </ViroARScene>);   
  }
   _onInitialized() {  
      var femalefirst = this._transformPointToAR(50.141984,18.776532);
      var apple = this._transformPointToAR(18.776532, 50.141984);
      var civil=this._transformPointToAR(50.141903, 18.775983);
      var subjail=this._transformPointToAR(21.181359, 72.826964);
      var dhiraj=this._transformPointToAR(21.149431, 72.782777);
    this.setState({
      femalefirstX: femalefirst.x,
      femalefirstZ: femalefirst.z,
      appleX: apple.x,
      appleZ: apple.z,      
      civilX:civil.x,
      civilZ:civil.z,
      subjailX:subjail.x,
      subjailZ:subjail.z,
      dhirajX:dhiraj.x,
      dhirajZ:dhiraj.z,      
      text : "AR Init called."
    });
  }
 _latLongToMerc(lat_deg, lon_deg) {
   var lon_rad = (lon_deg / 180.0 * Math.PI)
   var lat_rad = (lat_deg / 180.0 * Math.PI)
   var sm_a = 637813.70
   var xmeters  = sm_a * lon_rad
   var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
   return ({x:xmeters, y:ymeters});
}
_transformPointToAR(lat, long) {
  AsyncStorage.getItem('headstart')
    .then(res=> {console.log('HeadAngle',res), this.setState({headAngle:res})} )
    var objPoint = this._latLongToMerc(lat, long);
    var devicePoint = this._latLongToMerc(this.state.latitude, this.state.longitude);
   // latitude(north,south) maps to the z axis in AR
  // longitude(east, west) maps to the x axis in AR
   var objFinalPosZ = (objPoint.y - devicePoint.y);
   var objFinalPosX = (objPoint.x - devicePoint.x);
  //flip the z, as negative z(is in front of us which is north, pos z is behind(south).
   return({x:objFinalPosX, z:-objFinalPosZ});
}
}
var styles = StyleSheet.create({
  helloWorldTextStyle: {    
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#d30606',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

module.exports = HelloWorldSceneAR; 