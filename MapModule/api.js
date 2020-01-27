import { BehaviorSubject } from 'rxjs'

const BASE_URL = "http://plane-catcher-backend.herokuapp.com/"

const planesSubject = new BehaviorSubject([]);
const planesSubjectAR = new BehaviorSubject([]);

let interval;



export const getPlanes = async (userLatitude, userLongitude, range) => {
        interval = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=-1`);
                const resData = await response.json();
                planesSubject.next(resData.data);

            } catch (err) {
                console.log(err)
            }
        }, 5000);
}

export const stopWatchingPlanes = () => {
    clearInterval(interval);
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
                console.log(err)
            }
        }, 5000);
}

export const stopWatchingPlanesAR = () => {
    clearInterval(intervalAR);
}

export const getPlaneSubjectAR = () => {
    return planesSubjectAR.asObservable();
}
