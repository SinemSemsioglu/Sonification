import AsyncStorage from '@react-native-async-storage/async-storage';
import util from '../utils/general'

const init = async () => {
  try {
    let activities = await getObject("activities");
    if (!activities) {
      await saveObject("activities", []);
    }
  } catch (err) {
    // todo in this case app shouldn't go on
    // maybe better to throw an error
    util.handleError(err, "storage.init");
  }
}

const save = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    throw(e);
  }
}

const get = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    if(value !== null) {
      // value previously stored
    }
    return value;
  } catch(e) {
    // error reading value
    throw(e);
  }
}

const saveObject = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    throw(e);
  }
}

const getObject = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    console.log("couldn't get object")
    throw(e);
  }
}

const getValFromObject = async (keys) => {
  let depth = keys.length;

  if(depth >= 3) {
    try {
      let baseObj = await getObject(keys[0]);
      //console.log("printing base obj");
      //console.log(baseObj);

      if (baseObj) {
        for(let i=1; i<depth-1; i++) {
          baseObj = baseObj[keys[i]];
          //console.log(baseObj);
        }

        return baseObj[keys[depth-1]];
      } else {
        console.log("problem with getvalfromobj")
      }

    } catch (e) {
      throw(e);
    }
  } else {
    //console.log(keys);
    console.log("bad call to getvalfrom object");
  }

}

const setValInObject = async (keys, value) => {
  let depth = keys.length;

  if(depth >= 3) {
    try {
      let baseObj = await getObject(keys[0]);

      let currState = baseObj;

      if (currState) {
        for(let i=1; i<depth-1; i++) {
          currState = currState[keys[i]];
        }

        currState[keys[depth-1]] = value;
        await saveObject(keys[0], baseObj);
      }
    } catch (e) {
      throw(e);
    }
  } else {
    console.log("bad call to setvalinobject")
  }

}

module.exports = {
  init,
  get,
  save,
  getObject,
  saveObject,
  getValFromObject,
  setValInObject
}
