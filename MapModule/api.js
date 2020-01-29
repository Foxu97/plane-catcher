import { BehaviorSubject } from 'rxjs'
import axios from 'axios';
//const BASE_URL = "http://plane-catcher-backend.herokuapp.com/"
const BASE_URL = "http://192.168.74.107:8082/"

const planesSubject = new BehaviorSubject([]);
const planesSubjectAR = new BehaviorSubject([]);

let interval;



// export const getPlanes = async (userLatitude, userLongitude, range) => {
//         interval = setInterval(async () => {
//             try {
//                 const response = await fetch(`${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=-1`);
//                 const resData = await response.json();
//                 planesSubject.next(resData.data);

//             } catch (err) {
//                 throw err
//             }
//         }, 2500);
// }


export const runGetPlanes = (userLatitude, userLongitude, range) => {
    console.log("Latitude: ", userLatitude)
    if (allTimeouts.length > 0){
        allTimeouts.forEach(timeout => {
            clearTimeout(timeout);
        });
        allTimeouts = [];
    }
    getPlanes(userLatitude, userLongitude, range)
    timeoutID = setTimeout(runGetPlanes, 2500);
    console.log(timeoutID)
    allTimeouts.push(timeoutID);
}
export const clearAllTimeouts = () => {
    allTimeouts.forEach(timeout => {
        clearTimeout(timeout);
    })
}

// export const fetchPlanes = async (userLatitude, userLongitude, range) => {
//     let timeoutID;
//     let prevTimeoutID;
//     console.log(timeoutID);
//     if (prevRange && prevRange !== range){
//         clearTimeout(timeoutID);
//         console.log("zmiana zasiegu")
//     }
//     prevRange = range;
//     timeoutID = setTimeout(async () => await getPlanes(userLatitude, userLongitude, range), 2000);
// }


// export const getPlanes = (userLatitude, userLongitude, range) => {
//     let url =   `${BASE_URL}plane?latitude=${userLatitude.toString()}&longitude=${userLongitude.toString()}&range=${range}&heading=-1`
//     fetchWithTimeout(
//         url,
//         { headers: { Accept: 'application/json' } },
//         2500
//     ).then(response => response.json()).then(json => {
//         planesSubject.next(json.data);
//     }).catch(error => {
//         console.log(error)
//     })
// }

// export const getPlanes = (userLatitude, userLongitude, range) => {
//     setTimeout(() => {
//         getPlanesRequest(userLatitude, userLongitude, range)
//     }, 2500)
// }

export const stopWatchingPlanes = () => {
    //clearInterval(interval);
    clearTimeout(timeoutID);
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


/////////

