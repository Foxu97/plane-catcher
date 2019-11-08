
// IT WILL BE SPLITTED INTO OTHER FILES

//for developing only 

const orzeszeCoords = {
    latitude: 50.143212,
    longitude: 18.775662,
    altitude: 0
}

const pyrzowiceCoords = {
    latitude: 50.475926,
    longitude: 19.073234,
    altitude: 4343
}


var rad = function (x: number) {
    return x * Math.PI / 180;
};
import { Coordinates } from '../models/Coordinates'
function getDistance(p1: Coordinates, p2: Coordinates) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.latitude - p1.latitude);
    var dLong = rad(p2.longitude - p1.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};

// Converts from degrees to radians.
function toRadians(degrees: number) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
  function toDegrees(radians: number) {
    return radians * 180 / Math.PI;
  }

function calcBearing(userCoords: Coordinates, planeCoords: Coordinates){
    const startLat = toRadians(userCoords.latitude);
    const startLng = toRadians(userCoords.longitude);
    const destLat = toRadians(planeCoords.latitude);
    const destLng = toRadians(planeCoords.longitude);
  
    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x = Math.cos(startLat) * Math.sin(destLat) -
          Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    let brng = Math.atan2(y, x);
    brng = toDegrees(brng);
    return (brng + 360) % 360;
}
function calcAngleBetweenToVectors(v1: {latitude: number, longitude: number, altitude: number}, v2: {latitude: number, longitude: number, altitude: number}){
    console.log(v1)
    console.log(v2)
    let ab = v1.latitude * v2.latitude + v1.longitude + v2.longitude + v1.altitude * v2.altitude;
    let THE_ABSOLUTE_VALUE_a = Math.sqrt(v1.latitude * v1.latitude + v1.longitude * v1.longitude + v1.altitude * v1.altitude);
    let THE_ABSOLUTE_VALUE_b = Math.sqrt(v2.latitude * v2.latitude + v2.longitude * v2.longitude + v2.altitude * v2.altitude);

    const angle = Math.acos(ab/ (THE_ABSOLUTE_VALUE_a * THE_ABSOLUTE_VALUE_b));
    return angle;
}

const samplePlanes = [
    {
        latitude: 38.89,
        longitude: -77.032,
        altitudeInMeters: 11000
    }
]
// IT WILL BE SPLITTED INTO OTHER FILES


exports.getAllPlanesInRange = (req: any, res: any, next: any) => { //expect to get userCoordinates in query string
    const userLatitude = req.query.latitude;
    const userLongitude = req.query.longitude;
    const range = req.query.range

    if (!req.query.latitude || !req.query.longitude || !req.query.range){
        return res.status(400).send("Invalid query parameters")
    }
    
    // const userCoords: Coordinates = {
    //     longitude: userLongitude,
    //     latitude: userLatitude
    // }

    // const planeCoords: Coordinates = {
    //     longitude: samplePlanes[0].longitude,
    //     latitude: samplePlanes[0].latitude
    // }

    const userCoords: Coordinates = {
        longitude: orzeszeCoords.longitude,
        latitude: orzeszeCoords.latitude
    }

    const planeCoords: Coordinates = {
        longitude: pyrzowiceCoords.longitude,
        latitude: pyrzowiceCoords.latitude
    }
    let distanceInMeters = getDistance(userCoords, planeCoords);
    let bearing = calcBearing(userCoords, planeCoords);
    console.log(samplePlanes[0].altitudeInMeters / distanceInMeters)
    // metry na radiany trzeba jakos zamienic samplePlanes[0].altitudeInMeters / distanceInMeters
    let angle2 = Math.tan(4000 / 10000) 
    let angle = calcAngleBetweenToVectors({latitude: orzeszeCoords.latitude, longitude: orzeszeCoords.longitude, altitude: 0}, {latitude: pyrzowiceCoords.latitude, longitude: pyrzowiceCoords.longitude, altitude: 4343})
     //angle = toDegrees(angle) // cos maly ten kat wychodzi

    console.log("Bearing " + bearing + " degrees")
    console.log("Distance: " + distanceInMeters / 1000 +" km")

    console.log("Angle " + toDegrees(angle) + " degrees")
    console.log("Angle " + angle)

    console.log("Angle tan " + toDegrees(angle2)) //to wydaje sie byc dobrze ale trzeba sprawdzic

    res.send("All planes")
}