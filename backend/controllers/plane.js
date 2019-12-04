
// IT WILL BE SPLITTED INTO OTHER FILES

//for developing only 

const orzeszeCoords = {
    latitude: 50.141973,
    longitude: 18.776457,
    altitude: 0
}

const pyrzowiceCoords = {
    latitude: 50.476052,
    longitude: 19.084780,
    altitude: 11000
}
//end of for developing only 

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


exports.getAllPlanesInRange = (req, res, next) => {
    const userLatitude = req.query.latitude;
    const userLongitude = req.query.longitude;
    const range = req.query.range;
    if (!req.query.latitude || !req.query.longitude || !req.query.range){
        return res.status(400).send("Invalid query parameters")
    }
    
    //zlapac wszystkie samoloty w obrebie range

    const userCoords = {
        longitude: req.query.longitude,
        latitude: req.query.latitude
    }

    const planeCoords = {
        longitude: pyrzowiceCoords.longitude,
        latitude: pyrzowiceCoords.latitude
    }
    const distanceInMeters = getDistance(userCoords, planeCoords);
    const bearing = calcBearing(userCoords, planeCoords);
    const angle = toDegrees(Math.atan(pyrzowiceCoords.altitude / distanceInMeters));


    res.status(200).json({distanceInMeters: distanceInMeters, bearingInDegrees: bearing, angleBetweenPlaneAndObserverInDegrees: angle});
}