export const SET_PLANES = 'SET_PLANES';
export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const SET_DEVICE_HEADING = 'SET_DEVICE_HEADING';
export const FETCH_PLANES = "FETCH_PLANES";
export const ADD_PLANE_TO_HISTORY = "ADD_PLANE_TO_HISTORY";

export const fetchPlanes = (userLatitude, userLongitude, range, heading) => {
    return async dispatch => {
        try {
            const response = await fetch(`http://192.168.74.254:8080/plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=${heading}`);
            const resData = await response.json();
            dispatch({ type: SET_PLANES, planes: resData });
            dispatch({ type: SET_DEVICE_HEADING, heading: heading });
            dispatch({ type: SET_USER_LOCATION, userLocation: {latitude: userLatitude, longitude: userLongitude} });
        }
        catch (err) {
            console.log(err)
        }
    }
}

export const addPlaneToHistory = (plane) => {
    return {
        type: ADD_PLANE_TO_HISTORY, plane: plane
    }
}
