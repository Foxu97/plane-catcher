import { BehaviorSubject } from 'rxjs';
const io = require('socket.io-client');
const socket = io();
//const BASE_URL = "http://plane-catcher-backend.herokuapp.com/"
const BASE_URL = "ws://192.168.74.254:8082/"
const planesSubject = new BehaviorSubject([]);
const planesSubjectAR = new BehaviorSubject([]);


const planeSocket = io(BASE_URL);
planeSocket.on('fetchedPlanesInRange', (planes) => {
    planesSubject.next(planes.data);
})



export const getPlanes = (userLat, userLng, range, heading = -1) => {
    // console.log("Getting planes function")
    planeSocket.emit('getPlanesInRange', userLat, userLng, range, heading)
}

export const disconnectPlaneScoket = () => {
    planeSocket.disconnect();
}


export const getPlaneSubject = () => {
    return planesSubject.asObservable();
}

let intervalAR

export const getPlanesAR = async (userLatitude, userLongitude, range, heading) => {
    intervalAR = setInterval(async () => {
        try {
            const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=${heading}`);
            const resData = await response.json();
            planesSubjectAR.next(resData.data);

        } catch (err) {
            //console.log(err)
            throw err
        }
    }, 5000);
}

export const stopWatchingPlanesAR = () => {
    clearInterval(intervalAR);
}

export const getPlaneSubjectAR = () => {
    return planesSubjectAR.asObservable();
}
