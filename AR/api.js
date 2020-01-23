import { BehaviorSubject } from 'rxjs'

const BASE_URL = "http://192.168.74.254:8080/"

const planesSubject = new BehaviorSubject([]);
const userLocationSubject = new BehaviorSubject([]);
const deviceHeadingSubject = new BehaviorSubject([]);

export const getPlanes = async (userLatitude, userLongitude, range, heading) => {
    setInterval(async () => {
        try {
            const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=${heading}`);
            const resData = await response.json();
            planesSubject.next(resData);
        } catch (err) {
            console.log(err)
        }
    }, 5000)
}

export const getPlaneSubject = () => {
    return planesSubject.asObservable();
}