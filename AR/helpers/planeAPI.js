
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { useSelector, useDispatch } from 'react-redux';
import * as planeActions from '../store/planes/planes-actions';

const getPlanesFromAPI = async (userLatitude, userLongitude, range, heading) => {
    return fetch(`http://192.168.74.254:8080/plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=50&heading=${heading}`).then(res => {
        return res.json();
    }).then(data => {
        return data;
        ///setPlanes(data);
        //serverLog(data)
    })
}

export const verifyPermissions = async () => {
    const dispatch = useDispatch();
    try {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert('Insufficient permissions!', [{ text: 'OK!' }]);
        } else {
            //setHasLocationPermission(true);
            let userLocation;
            locationResult = await Location.watchPositionAsync({accuracy:Location.Accuracy.High}, async (newUserLocation) => {
            //     setUserLocation({
            //         latitude: newUserLocation.coords.latitude,
            //         longitude: newUserLocation.coords.longitude
            // });
            dispatch(planeActions.setUserLocation(newUserLocation.coords));
        });
        const heading = await Location.getHeadingAsync();
        const planes = await getPlanesFromAPI(newUserLocation.coords.latitude, newUserLocation.coords.longitude, 50, heading.trueHeading);
        serverlog(heading)
        serverlog(planes)
        dispatch(planeActions.setPlanes(planes));
        dispatch(planeActions.setDeviceHeading(heading.trueHeading));
        
            //setDeviceHeading(heading.trueHeading);
        }
    } catch (err) {
        console.log(err)
    }
}

const serverLog = (message) => {
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