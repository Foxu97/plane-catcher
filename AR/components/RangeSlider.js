import React from 'react';
import { StyleSheet, View, Text, Slider } from 'react-native';
import Colors from '../constants/Colors';

const RangeSlider = props => {
    return (
        <View>
            <View style={styles.sliderWrapper}>
                <Slider
                    style={styles.sliderStyle}
                    minimumValue={5}
                    maximumValue={200}
                    step={5}
                    value={props.observationRange}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.primary}
                    thumbTintColor={Colors.accent}
                    onSlidingComplete={props.sliderSlidingHandler}
                    onValueChange={props.updateObservationRangeHandler}
                />
            </View>
            <View style={styles.rangeStyles}><Text style={styles.rangeTextStyles}>{props.observationRange + "KM"}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderWrapper: {
        width: 20,
        height: 300,
        display: 'flex',
        marginLeft: 'auto',
        zIndex: 10
    },
    sliderStyle: {
        width: 300,
        zIndex: 10,
        flex: 1,
        alignSelf: 'center',
        transform: [{ rotate: `-90deg` }]
    },
    rangeStyles: {
        zIndex: 100,
        backgroundColor: Colors.primary,
        padding: 3,
        borderTopLeftRadius: 6,
        width: 90,
        marginLeft: 'auto'
    },
    rangeTextStyles: {
        fontSize: 24,
        color: "white",
        textAlign: "center"
    }
})

export default RangeSlider;