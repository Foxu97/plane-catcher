import { SET_PLANES, SET_DEVICE_HEADING, SET_USER_LOCATION, ADD_PLANE_TO_HISTORY, SET_OBSERVATION_RANGE } from './planes-actions';

const initialState = {
    planes: [],
    longitude: null,
    latitude: null,
    heading: null,
    observationRange: 80,
    observationHistory: []
}

export default (state = initialState, action) => {
    switch (action.type) {
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
        case ADD_PLANE_TO_HISTORY:
            const wasPlaneAlreadyObserved = state.observationHistory.find((plane) => {
                return plane.icao24 === action.plane.icao24;
            });
            if (!wasPlaneAlreadyObserved) {
                const observedPlaneData = {
                    icao24: action.plane.icao24,
                    callsign: action.plane.callsign,
                    velocity: action.plane.velocity,
                    altitude: action.plane.altitude
                }
                return {
                    ...state,
                    observationHistory: state.observationHistory.concat(observedPlaneData)
                }
            }
            return {
                ...state
            }
        case SET_OBSERVATION_RANGE: 
            return {
                ...state,
                observationRange: action.range
            }

    }

    return state;
}


