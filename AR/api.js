import { BehaviorSubject } from 'rxjs';
const io = require('socket.io-client');
//const BASE_URL = "http://plane-catcher-backend.herokuapp.com/"
const BASE_URL = "ws://192.168.74.254:8082/"
let planesSubject;



let planeSocket
export const connectToSocket = () => {
    planesSubject = new BehaviorSubject([]);
    planeSocket = io(BASE_URL);
    planeSocket.on('fetchedPlanesInRange', (planes) => {
        planesSubject.next(planes.data);
    });
}

export const getPlanes = (userLat, userLng, range, heading = -1) => {
    planeSocket.emit('getPlanesInRange', userLat, userLng, range, heading)
}

export const disconnectPlaneScoket = () => {
    planeSocket.disconnect();
}


export const getPlaneSubject = () => {
    return planesSubject.asObservable();
}