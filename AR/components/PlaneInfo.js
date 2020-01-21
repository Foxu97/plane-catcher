import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PlaneInfo = props => {
    useEffect(() => {
        console.log(props)
    })

    return (
        <View style={styles.container}>
                <Text style={styles.textStyle}>Flight: {props.flight}</Text>
                <Text style={styles.textStyle}>From: {props.departure}</Text>
                <Text style={styles.textStyle}>To: {props.arrival}</Text>
                <Text style={styles.textStyle}>Aircraft: {props.aircraft}</Text>
                <Text style={styles.textStyle}>Airline: {props.airline}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        justifyContent:'center',
        alignItems: 'flex-start'
    },
    textStyle: {
        padding: 4
    }
})

export default PlaneInfo;