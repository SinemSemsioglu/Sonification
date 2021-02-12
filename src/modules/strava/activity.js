import {sendAuthRequest} from '../../utils/request';
import {getCurrentTime} from '../../utils/time';
let baseURL = "https:/www.strava.com/api/v3";
let activityId;
let token;

const getLatestActivity = async () => {
  console.log("creating activity")
  if (token == undefined) {
    // TODO throw error
    console.log("token is undefined")
    return null;
  } else {
    try {
      let url = baseURL + "/athlete/activities";

      let resp = await sendAuthRequest(url, "GET", token);

      // TODO check if successful?
      if(resp) {
        console.log(resp[0]);
        // TODO store in db?
        activityId = resp[0].id;
        // TODO maybe check if this is 'the' activity we want ow display error - no matching activity in strava

        setInterval(() => {
          getActivityStream();
        }, 60000)
      }
    } catch (err) {
      //TODO handle error
      console.log(err);
    }
  }
}

const getActivityStream = async() => {
  console.log("in get activity stream");
  if (activityId == undefined || token == undefined) {
    console.log("activity id or token is undefined");
    //TODO error handle
    return null;
  } else {
    let url = baseURL + "/activities/" + activityId + "/streams";
    url += "?keys=[time,distance,latLng,altitude,heartrate,temp]&key_by_type=true";

    let resp = await sendAuthRequest(url, "GET", token);
    console.log(resp);
  }
}

const setToken = (token_) => {
  token = token_;
  console.log("setting token as " + token);
  // TODO will be called by UI normally
  getLatestActivity();
}

module.exports = {
  getLatestActivity,
  getActivityStream,
  setToken
}

/* sample error strava {
    "message": "Bad Request",
    "errors": [
        {
            "resource": "Activity",
            "field": "start",
            "code": "missing_field"
        }
    ]
} */
