import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PlaneInfo = props => {
    return (
        <View style={styles.container}>
                <Text style={styles.textStyle}>icao24: {props.icao24}</Text>
                <Text style={styles.textStyle}>Callsign: {props.callsign}</Text>
                <Text style={styles.textStyle}>Velocity: {props.velocity}</Text>
                <Text style={styles.textStyle}>Altitude: {props.altitude}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        justifyContent:'center',
        alignItems: 'center',
        width: 150
    },
    textStyle: {
        padding: 4
    }
})

export default PlaneInfo;