import storage from '../../utils/storage';
import sensorUtil from '../../utils/sensor';
import google from '../google/activity';
import time from '../../utils/time';
import sound from '../../utils/sound';
import util from '../../utils/general';
import data from '../../utils/data';


const createActivity = async () => {
  return {
    id:  "id" + Math.floor(Math.random() * 1000), //todo unique id gen
    config: util.createFromTemplate("config")
  }
}

const getActivities = async () => {
  let activities = [];
  try {
    activities = await storage.getObject("activities");
  } catch (err) {
    util.handleError(err, "activity.getActivities");
  }

  return activities;
}

const saveActivity = async (activityData) => {
  try {
    // add to activities array, todo initialize if doesn't exist
    let id = activityData.id;

    if(activityData.started == undefined) {
      let activities = await getActivities();

      activities.push({
        id: id,
        completed: false,
        started: false
      });

      await storage.saveObject("activities", activities);
    }

    // add/update the config
    await storage.saveObject(id + "_config", activityData.config);

    return {
      id: id,
      started: false,
      completed: false,
      config: activityData.config
    }
  } catch(err) {
    util.handleError(err, "activity.saveActivity");
    return null;
  }
}

const startActivity = async (id, config) => {
  try {
    let startTime = time.getCurrentTime();

    // todo this can be moved to data init
    await storage.saveObject(id + "_data", util.createFromTemplate("data"));
    await initRecording(id, config, startTime);

    //todo add start time to activity obj
    let activities = await getActivities();
    let currActRecord = activities.find(act => act.id == id)
    currActRecord.started = true;
    currActRecord.startTime = startTime;
    await storage.saveObject("activities", activities)
  } catch (err) {
    util.handleError(err, "activity.startActivity");
  }
}

const initRecording = async (id, config, startTime) => {
  try {
    data.init(id, config, startTime, 53 * 1000);
    google.startActivity(time.getCurrentTime('google'), 23 * 1000);
    await sensorUtil.startDataCollection(53 * 10);
  } catch (err) {
    util.handleError(err, "activity.initRecording");
  }
}

const resumeActivity = async(activityData) => {
  try {
    let prevStored = await storage.getObject(activityData.id + "_data");
    await initRecording(activityData.id, activityData.config, activityData.startTime);

    return prevStored;
  } catch (err) {
    util.handleError(err, "activity.resumeActivity");
  }
}

const stopRecording = () => {
  sensorUtil.stopDataCollection();
  google.endActivity();
  data.endCollection();
}

const pauseActivity = () => {
  stopRecording();
  sound.clearPlayers();
}

const endActivity = async (activity) => {
  try {
    stopRecording();
    sound.clearPlayers();

    // todo get all activities, find the one with this id and add finish_time + completed: true
    let activities = await getActivities();
    let currActRecord = activities.find(act => activity.id == act.id)
    currActRecord.completed = true;
    currActRecord.endTime = time.getCurrentTime();
    await storage.saveObject("activities", activities)

    // todo get strava data if logged in & available -- maybe compare the time started/ended
  } catch (err) {
    util.handleError(err, "activity.endActivity")
  }

}

const getActivityData = async (id) => {
  return await storage.getObject(id + "_data")
}

const getActivityConfig = async(id) => {
  return await storage.getObject(id + "_config");
}

const updateActivityConfig = async(id, config) => {
  return await storage.saveObject(id + "_config", config);
}

module.exports = {
  getActivities,
  createActivity,
  saveActivity,
  startActivity,
  endActivity,
  resumeActivity,
  pauseActivity,
  getActivityData,
  getActivityConfig,
  updateActivityConfig
}
