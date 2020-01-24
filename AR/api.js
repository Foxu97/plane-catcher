import { BehaviorSubject } from 'rxjs'

const BASE_URL = "http://192.168.74.254:8080/"

const planesSubject = new BehaviorSubject([]);
const userLocationSubject = new BehaviorSubject([]);
const deviceHeadingSubject = new BehaviorSubject([]);
let interval;

const serverlog = (message) => {
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

export const getPlanes = async (userLatitude, userLongitude, range, heading = null) => {
    // return new Promise((resolve, reject) => {
        interval = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=${heading}`);
                const resData = await response.json();
                //serverlog(resData)
                planesSubject.next(resData);

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