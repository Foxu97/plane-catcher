import React from 'react';
import {View, StyleSheet} from 'react-native';
import planeImage from '../assets/plane.png';
const PlaneMarker = props => {
    return (
        <ImageBackground source={planeImage} style={{width: '100%', height: '100%'}}>
        </ImageBackground>
    )

}

const styles = StyleSheet.create({
})

export default PlaneMarker;