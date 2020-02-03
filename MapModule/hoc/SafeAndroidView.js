import React from 'react';
import {View, StyleSheet} from 'react-native';

const SafeAndroidView = props => {
    return (
        <View style={{...props.style, ...styles.safeAndroidView}}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    safeAndroidView: {
        paddingTop: 28
    }
});
export default SafeAndroidView;