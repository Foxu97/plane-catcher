import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';

const SafeAndroidView = props => {
    return (
        <View style={{...props.style, ...styles.safeAndroidView}}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    safeAndroidView: {
        paddingTop: Platform.OS === 'android' ? 25: 0
    }
});
export default SafeAndroidView;