const fetch = require('node-fetch');

var rad = function (x) {
    return x * Math.PI / 180;
};
function getDistance(p1, p2) {
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
function toRadians(degrees) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
  function toDegrees(radians) {
    return radians * 180 / Math.PI;
  }

function calcBearing(userCoords, planeCoords){
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

// IT WILL BE SPLITTED INTO OTHER FILES


exports.getAllPlanesInRange = async (req, res, next) => {
    const userLatitude = req.query.latitude;
    const userLongitude = req.query.longitude;
    const range = req.query.range;
    const userHeading = req.query.heading;
    if (!req.query.latitude || !req.query.longitude || !req.query.range){
        return res.status(400).send("Invalid query parameters")
    }
    const c = Math.sqrt(Math.pow(range, 2) + Math.pow(range, 2));
    const userAreaBoundingBox = getBoundingBoxCoveringUserPosition({latitude: userLatitude, longitude: userLongitude}, c);
    try {
        let allPlanes;
        allPlanes = await fetchPlanesInBoundingBox(userAreaBoundingBox.minBoxPoint, userAreaBoundingBox.maxBoxPoint);
        if (allPlanes.states) {
            const mappedPlanes = mapPlanes(allPlanes.states);
            const planesInRangeOfUser = mappedPlanes.filter(plane => {
                const distanceToPlane = getDistance({latitude: userLatitude, longitude: userLongitude}, {latitude: plane.latitude, longitude: plane.longitude})
                return (distanceToPlane/1000 <= range)
            });
            if (planesInRangeOfUser) {
                planesInRangeOfUser.forEach((plane => { 
                    let mappedARCoords = findMappedCoordinates({ latitude: userLatitude, longitude: userLongitude}, {latitude: plane.latitude, longitude: plane.longitude});
                    plane.arLatitude = mappedARCoords.latitude;
                    plane.arLongitude = mappedARCoords.longitude;
                    plane.arPoint = transformPointToAR(plane.arLatitude, plane.arLongitude, userLatitude, userLongitude,  userHeading);
                }));
                await asyncForEach(planesInRangeOfUser, async (plane) => {
                    try {
                        const planeInfo = await getPlaneInfo(plane.icao24);
                        //console.log(planeInfo)
                        if (planeInfo.success !== false){
                            plane.airline = planeInfo[0].airline.icaoCode;
                            plane.aircraft = planeInfo[0].aircraft.icaoCode;
                            plane.arrival = planeInfo[0].arrival.iataCode;
                            plane.departure = planeInfo[0].departure.iataCode;
                            plane.flight = planeInfo[0].flight.icaoNumber
                        }
                    } catch(err) {
                        return;
                    }
                });

                res.status(200).json(planesInRangeOfUser);
            }
        

        }
        else {
            res.status(404).json({message: "No planes in given range!"});
        }
    
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message: "Something went wrong!"});
    }
}

const findMappedCoordinates = (userCoords, planeCoords, bearing, distance = 0.005) => {
    const R = 6378.1 //Radius of the Earth
    if (!bearing) {
        bearing = calcBearing(userCoords, planeCoords);
    }

    bearing = toRadians(bearing);
    const lat1 = toRadians(userCoords.latitude);
    const lng1 = toRadians(userCoords.longitude);

    let lat2 = Math.asin( Math.sin(lat1)*Math.cos(distance/R) +
     Math.cos(lat1)*Math.sin(distance/R)*Math.cos(bearing))

    let lng2 = lng1 + Math.atan2(Math.sin(bearing)*Math.sin(distance/R)*Math.cos(lat1),
             Math.cos(distance/R)-Math.sin(lat1)*Math.sin(lat2))

    lat2 = toDegrees(lat2);
    lng2 = toDegrees(lng2);

    return {latitude: lat2, longitude: lng2}

}

const getBoundingBoxCoveringUserPosition = (userCoords, rangeInKm) => {
    const maxBoxPoint = findMappedCoordinates(userCoords, null, 45, rangeInKm);
    const minBoxPoint = findMappedCoordinates(userCoords, null, 225, rangeInKm);
    return {
        maxBoxPoint: maxBoxPoint,
        minBoxPoint: minBoxPoint
    }
}

const fetchPlanesInBoundingBox = async (minBoxPoint, maxBoxPoint) => {
    return fetch(`https://opensky-network.org/api/states/all?lamin=${minBoxPoint.latitude}&lomin=${minBoxPoint.longitude}&lamax=${maxBoxPoint.latitude}&lomax=${maxBoxPoint.longitude}`).then(
        res => {
            return res.json();
        }
    );
}
const getPlaneInfo = async(icao24) => {
    
    return fetch(`http://aviation-edge.com/v2/public/flights?key=008a4c-e9f4d4&aircraftIcao24=${icao24}`).then(
        res => {
            return res.json();
        }
    );
}

const mapPlanes = (planes) => {
    if (planes) {
        const mappedPlanes = [];
        planes.forEach(singlePlaneInfoArray => {
            let newPlane;
            for (let i = 0; i<singlePlaneInfoArray.length; i++) {
                newPlane = {
                    icao24: singlePlaneInfoArray[0],
                    callsign: singlePlaneInfoArray[1],
                    timePosition: singlePlaneInfoArray[3],
                    longitude: singlePlaneInfoArray[5],
                    latitude: singlePlaneInfoArray[6],
                    velocity: singlePlaneInfoArray[9],
                    trueTrack: singlePlaneInfoArray[10],
                    altitude: singlePlaneInfoArray[13]
                }
            }
            mappedPlanes.push(newPlane);
        });
        return mappedPlanes;
    }
}

const asyncForEach = async(array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

const latLongToMerc = (lat_deg, lon_deg) => {
    var lon_rad = (lon_deg / 180.0 * Math.PI)
    var lat_rad = (lat_deg / 180.0 * Math.PI)
    var sm_a = 6378137.0
    var xmeters = sm_a * lon_rad
    var ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
    return ({ x: xmeters, y: ymeters });
  }

const transformPointToAR = (objectLat, objectLng, deviceLat, deviceLng, heading) => {
    var objPoint = latLongToMerc(objectLat, objectLng);
    var devicePoint = latLongToMerc(deviceLat, deviceLng);
    // latitude(north,south) maps to the z axis in AR
    // longitude(east, west) maps to the x axis in AR
    var objFinalPosZ = objPoint.y - devicePoint.y;
    var objFinalPosX = objPoint.x - devicePoint.x;
    //flip the z, as negative z(is in front of us which is north, pos z is behind(south).
    let angle = heading;
    const angleRadian = (angle * Math.PI) / 180; // degree to radian
    let newRotatedX = objFinalPosX * Math.cos(angleRadian) - objFinalPosZ * Math.sin(angleRadian)
    let newRotatedZ = objFinalPosZ * Math.cos(angleRadian) + objFinalPosX * Math.sin(angleRadian)

    return ({ x: newRotatedX, z: newRotatedZ });
  }