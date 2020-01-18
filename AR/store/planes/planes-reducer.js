import { SET_PLANES, SET_DEVICE_HEADING, SET_USER_LOCATION } from './planes-actions';

const initialState = {
    planes: [],
    longitude: null,
    latitude: null,
    heading: null
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PLANES: 
            return {
                ...state,
                planes: [...action.planes]
            }
        case SET_USER_LOCATION:
            return {
                ...state,
                longitude: action.userLocation.longitude,
                latitude: action.userLocation.latitude
            }
        case SET_DEVICE_HEADING:
            return {
                ...state,
                heading: action.heading
            }
    }
    return state;
}