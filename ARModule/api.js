import { BehaviorSubject } from 'rxjs'

const BASE_URL = "http://192.168.74.254:8082/"

const planesSubject = new BehaviorSubject([]);
const planesSubjectAR = new BehaviorSubject([]);
const userLocationSubject = new BehaviorSubject([]);
const deviceHeadingSubject = new BehaviorSubject([]);
let interval;

const serverlog = (message) => {
    fetch('http://192.168.74.254:8082/debug/consolelog', {
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

export const getPlanes = async (userLatitude, userLongitude, range) => {
    // return new Promise((resolve, reject) => {
        interval = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=-1`);
                const resData = await response.json();
                //serverlog(resData)
                planesSubject.next(resData.data);

            } catch (err) {
                console.log(err)
                serverlog(err)
                //reject(err)
            }
        }, 5000);
    //     resolve(planesSubject.asObservable());
    // })

}

export const stopWatchingPlanes = () => {
    clearInterval(interval);
}

export const getPlaneSubject = () => {
    return planesSubject.asObservable();
}



/////////////////////

let intervalAR

export const getPlanesAR = async (userLatitude, userLongitude, range, heading) => {
    // return new Promise((resolve, reject) => {
        intervalAR = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=${heading}`);
                const resData = await response.json();
                //serverlog(resData)
                planesSubjectAR.next(resData.data);

            } catch (err) {
                console.log(err)
                serverlog(err)
                //reject(err)
            }
        }, 5000);
    //     resolve(planesSubject.asObservable());
    // })

}

export const stopWatchingPlanesAR = () => {
    clearInterval(intervalAR);
}

export const getPlaneSubjectAR = () => {
    return planesSubjectAR.asObservable();
}