import Barometer from 'react-native-barometer';
import {handleData} from '../utils/data';
import {timeStampToDef} from '../utils/time';

let barometerWatchId;

let safeToSave;

const startDataCollection = async (updateInterval = 10000) => {
    await initBarometer(async (data) => {
        if(safeToSave) {
            await handleData('altitude',data.relativeAltitude, timeStampToDef(data.timestamp))
            setTimeout(async () => {
                // also fake hr data
                await handleData('pressure',data.pressure, timeStampToDef(data.timestamp))
            }, Math.floor(updateInterval / 3));
        }
    }, updateInterval);
}

const stopDataCollection = () => {
    Barometer.stopObserving();
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

module.exports = {
    startDataCollection,
    stopDataCollection
}
