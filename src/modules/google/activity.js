import Fitness from '@ovalmoney/react-native-fitness';

import {getCurrentTime} from '../../utils/time';
import {handleData} from '../../utils/data';

const lastSaved = {
  heartRate: getCurrentTime('google'),
  distance: getCurrentTime('google')
}

let activityInterval;

const startActivity = (startTime, updateInterval = 20000) => {
  console.log("activity starting");

  // TODO better way than interval?
  activityInterval = setInterval(async ()=> {
    //await getHeartData();
    await getDistanceData(startTime);
  }, updateInterval);
}

const getHeartData = async () => {
  let currTime = getCurrentTime('google');

  const heartrate = await Fitness.getHeartRate(lastSaved.heartRate, currTime, 'minute')

  if(heartrate && heartrate.length > 0){
    //console.log("hr data ");
    //console.log(heartrate); //TODO process
    // todo get average of the values
    let val = heartrate[0];
    await handleData('heartRate', val, getCurrentTime())
  } else {
    console.log("hr data couldn't be received")
  }
}

// or with async/await syntax
const getDistanceData = async(startTime) => {
  try {
    let currTime = getCurrentTime('google');
    //console.log(currTime);
    //console.log(lastSaved.distance);
    //console.log(startTime);

    const results = await Fitness.getDistances({startDate: startTime, endDate: currTime, interval: 'minute'})
    console.log("googleV2Dist");
    console.log(results);

    lastSaved.distance = currTime;

    let cumulativeDist = 0;
    results.forEach((res) => {
      cumulativeDist += res.quantity;
    })

    await handleData('distance', cumulativeDist, getCurrentTime())
  } catch (err) {
    console.log("google v2 dist err");
    console.log(err);
  }

}

const endActivity = () => {
  clearInterval(activityInterval);
  console.log("end activity is called in activity.js")
}

module.exports = {
  startActivity,
  endActivity
}
