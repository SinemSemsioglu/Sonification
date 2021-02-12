import Barometer from 'react-native-barometer';
import Geolocation from 'react-native-geolocation-service';
import {handleData} from '../utils/data';
import {timeStampToDef} from '../utils/time';

let barometerWatchId;
let locationWatchId;

let safeToSave;

let unit = "K"; // km for distance calculation

const startDataCollection = async (updateInterval = 10000) => {
    /*initGps(async (data) => {

        let prevLat = await storage.getValFromObject(["lastSaved", "position", "latitude"]);
        let prevLon = await storage.getValFromObject(["lastSaved", "position", "longitude"]);
        // TODO distance will probably be taken from google fit
        let distance = calculateDistance(data.latitude, data.longitude, prevLat, prevLon)

        await storage.setValInObject(["lastSaved", "position", "latitude"], data.latitude);
        await storage.setValInObject(["lastSaved", "position", "longitude"], data.longitude);
        await storage.setValInObject(["lastSaved", "position", "time"], data.timestamp);

        console.log("manual distance is " + distance);
        await handleData('manualDistance',distance, timeStampToDef(data.timestamp)) // TODO convert timestamp?
    }, updateInterval);*/

    await initBarometer(async (data) => {
        if(safeToSave) {
            await handleData('altitude',data.altitude, timeStampToDef(data.timestamp))
            setTimeout(async () => {
                // also fake hr data
                await handleData('pressure',data.pressure, timeStampToDef(data.timestamp))
            }, Math.floor(updateInterval / 3));
        }
    }, updateInterval);
}

const stopDataCollection = () => {
    // can be used if necessary
    // Barometer.clearWatch(barometerWatchID);
    // Geolocation.clearWatch(locationWatchId)
    Barometer.stopObserving();
    Geolocation.stopObserving();
    console.log("stop data collection called in sensor.js")
}

const initBarometer = async (callback, updateInterval = 60000) => {
    safeToSave = false;
    let isSupported = await Barometer.isSupported();
    if(isSupported) {
        Barometer.setInterval(updateInterval);
        // this might be used in the future Barometer.setLocalPressure(985);
        barometerWatchId = Barometer.watch(callback);

        setTimeout(() => {safeToSave = true}, 60000);
    }
}

const initGps = (callback, updateInterval = 60000) => {
    // todo check/ask for location permission?
    locationWatchId = Geolocation.watchPosition(callback, (err) => {
        console.log("error in getting gps data");
        console.log(err);
    }, {
        enableHighAccuracy: true,
        distanceFilter: 2,
        interval: updateInterval
    })
}


const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        let radlat1 = Math.PI * lat1/180;
        let radlat2 = Math.PI * lat2/180;
        let theta = lon1-lon2;
        let radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;
    }
}


// todo later on add hr data as well

module.exports = {
    startDataCollection,
    stopDataCollection,
    calculateDistance
}
