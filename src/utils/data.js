import storage from './storage';
import {calculateTimeDiff} from './time';
import {playAudio} from '../utils/sound';
import util from '../utils/general';
import time from '../utils/time';

let lastSaved;
let config;
let id;
let state;
let startTime;
let stateFunc;
let checkpointFunc;
let timeInterval;
let dbInterval;
let altitudeOffset;

const init = (id_, config_, startTime_, updateInterval = 60000, prevStored = null) => {
  config = config_;
  id = id_;

  startTime = startTime_;

  lastSaved = prevStored ? prevStored : util.createFromTemplate("lastSaved");
  state = util.deepCopy(lastSaved);


  timeInterval = setInterval(async () => {
    let currTime = time.getCurrentTime(); // getTimePassed
    await handleData('time', time.getTimePassed(startTime), currTime);

    setTimeout(async () => {
      // also fake hr data
      await handleData('heartRate', Math.floor(100 + Math.random() * 70), currTime)
    }, Math.floor(updateInterval / 5));
  }, updateInterval);

  dbInterval = setInterval(async () => {
    //await insertAllData();
    await insertData('heartRate', state.heartRate.value, time.getCurrentTime())

  }, 60000)
}

// for all below, check the modes
// if mode is threshold compare to the threshold value
// if mode is progress compare to the prev saved value
// if mode is time compare to the prev saved time
const handleData = async (type, currValue, currTime) => {
  //console.log("in handle data func for type " + type + " and data is " + currValue)
  if(currValue != null) {
    try {
      let mode = config[type].mode;
      let savedValue = config[type].interval;

      let prevValue;
      let diff = 0;

      switch (mode) {
        case 'threshold':
          diff = (savedValue < 0)? -currValue: currValue;
          break;
        case 'progress':
          prevValue = lastSaved[type].value;

          if(prevValue == null) {
            diff = 100000000; // todo maybe another value?
          } else {
            diff = Math.abs(currValue - prevValue);
          }

          if (type == "altitude") {
            console.log("altitude value is " + currValue);
            if (prevValue == null) altitudeOffset = currValue;
            else currValue -= altitudeOffset;
          }

          break;
        case 'time':
          prevValue = lastSaved[type].time;
          diff = prevValue ? calculateTimeDiff(prevValue, currTime) : 10000000000;
          break;
      }

      state[type].value = currValue;
      state[type].time = currTime;

      if (stateFunc) {
        // todo in rendered state keeping works we might not have to keep the state here
        stateFunc(type, currValue);
      }

      // milestone point reached
      if (diff >= savedValue) {
        let adjustedValue = currValue;
        if(mode !== "threshold") {
          if(prevValue !== null && prevValue > currValue) adjustedValue += (savedValue - (currValue % savedValue));
          else adjustedValue -= (currValue % savedValue);
        } // rounding up to multiples of the interval

        console.log("milestone reached for " + type);
        console.log("with value " + currValue + " saved value " + savedValue + " diff " + diff);
        console.log("saving value as " + adjustedValue);

        lastSaved[type].time = currTime;
        lastSaved[type].value = adjustedValue;

        if (prevValue !== null|| mode == "threshold") {
          playAudio(type);

          checkpointFunc(type, {
            'value': adjustedValue,
            'time': time.convertFormat(currTime, "hour")
          });

          // save value to db
          if (type !== "heartRate") {
            await insertData(type, currValue, currTime)
          }
        }
      }

      //todo make another check for time as it is not triggered anywhere or call handleData for time smwhere pls
    } catch (err) {
      util.handleError(err, "data.handleData");
    }

  } else {
    util.handleError("tried to write null data", "data.handleData");
  }
}

const insertData = async(type, value, timestamp) => {
  try {
    let data = await storage.getObject(id + "_data");

    data[type].push({
      time: timestamp,
      value: value,
      timePassed: time.calculateTimeDiff(startTime, timestamp, "seconds")
    });

    await storage.saveObject(id + "_data", data);
  } catch (err) {
    util.handleError(err, "data.insertData");
  }
}

const insertAllData = async () => {
  try {
    let data = await storage.getObject(id + "_data");

    Object.keys(state).forEach((type) => {
      data[type].push(state[type]);
    })

    await storage.saveObject(id + "_data", data);
  } catch (err) {
    util.handleError(err, "data.insertData");
  }
}

const initStateUpdate = (stateFunc_, checkpointFunc_) => {
  stateFunc =  stateFunc_;
  checkpointFunc = checkpointFunc_;
}

const getCurrentState = () => {
  return state;
}

const endCollection = () => {
  clearInterval(timeInterval);
  clearInterval(dbInterval);
  // todo maybe clear other variables??
  console.log("endCollection called in data.js");
}

const extractLastSavedFromData = (prevStored) => {
  let lastSaved = {};

  Object.keys(prevStored).forEach((type) => {
    let data = prevStored[type] || [];
    if (data.length > 0)  {
      lastSaved[type] = {
        time: data[data.length - 1].time,
        value: data[data.length - 1].value,
      }
    } else {
      lastSaved[type] = {
        time: null,
        value: null
      };
    }
  })

  return lastSaved;
}

module.exports = {
  init,
  handleData,
  getCurrentState,
  initStateUpdate,
  endCollection,
  extractLastSavedFromData
}
