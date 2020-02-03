import React from 'react';
import { View, Button, Text, StyleSheet, Image, ImageBackground } from 'react-native';
import SafeAndroidView from '../hoc/SafeAndroidView';
import Colors from '../constants/Colors';

const AskPermissions = props => {
    return (
        <SafeAndroidView style={styles.container}>
            <ImageBackground source={require('../assets/wtcc.png')} style={styles.bgImage}>
                <Text style={styles.header}>Permissions not granted!</Text>
                <View style={styles.actions}>
                    <Image
                        style={styles.sadImage}
                        source={require('../assets/cry.png')}
                    />
                    <View style={styles.button}>
                        <Button
                            title="Grant permissions"
                            onPress={props.verifyPermissionsHandler}

                        />
                    </View>
                </View>
            </ImageBackground>
        </SafeAndroidView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 0,
    },
    bgImage: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%'

    },
    sadImage: {
        width: 128,
        height: 128
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        textTransform: 'uppercase',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: "white",
        width: '100%',
        padding: 4
    },
    actions: {
        width: '100%',
        height: '50%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        width: '80%'
    }
})

export default AskPermissions;