import GoogleFit from 'react-native-google-fit'
import {getCurrentTime} from '../../utils/time';
import {handleData} from '../../utils/data';
import storage from '../../utils/storage';

const optTemplate = {
  bucketUnit: "MINUTE", // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
  bucketInterval: 1, // optional - default 1.
}

const lastSaved = {
  heartRate: null,
  distance: null
}

let id;

const startActivity = (id_) => {
  console.log("activity starting");
  id = id_;
  //GoogleFit.startRecording(() => {
    //console.log("activity started")
    // TODO check if activity actually started?
    // Process data from Google Fit Recording API (no google fit app needed)
    // TODO better way than interval? get interval as a param
    setInterval(async ()=> {
      await getHeartData();
      await getDistanceData();
    }, 60000);
  //});
}

const getHeartData = async () => {
  let currTime = getCurrentTime('google');

  let options = Object.assign({
    startDate: lastSaved.heartRate,
    endDate: currTime
  }, optTemplate)

  const heartrate = await GoogleFit.getHeartRateSamples(options);

  if(heartrate && heartrate.length > 0){
    //console.log("hr data ");
    //console.log(heartrate); //TODO process
    // todo get average of the values
    let val = heartrate[0];
    await handleData('heartRate', val, getCurrentTime())
  } else {
    console.log("hr data couldn't be received")
  }

  lastSaved.heartRate = currTime;
  /*
  const bloodpressure = await GoogleFit.getBloodPressureSamples(options);
  console.log(bloodpressure); //TODO process*/
}

// or with async/await syntax
const getDistanceData = async() => {
  let currTime = getCurrentTime('google');

  let options = Object.assign({
    startDate: lastSaved.distance, // required
    endDate: currTime
  }, optTemplate)

  const results = await GoogleFit.getDailyDistanceSamples(options);
  console.log("google distance data ");
  console.log(results);

  lastSaved.distance = currTime;

  let cumulativeDist = 0;
  results.forEach((res) => {
    cumulativeDist += res.distance;
  })

  //await handleData('distance', cumulativeDist, getCurrentTime())
}

module.exports = {
  startActivity
}
