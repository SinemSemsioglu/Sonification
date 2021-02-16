import React from 'react';
import {Text, View, Alert} from 'react-native';
import util from "../utils/general";
import {convertFormat} from "../utils/time"
import activity from "../modules/general/activity";
import {initStateUpdate} from '../utils/data';
import {dataTypes} from '../constants/general';
import {styles} from '../styles/general';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { CommonActions } from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const checkpointText = {
  threshold: "crossed",
  progress: "checkpoint",
  time: "checkpoint"
}

let confirmed = false;


const InProgress = ({route, navigation}) => {
  const activityData = route.params.data;

  //todo these are initialized at each render? if so what a waste
  const [state, setState] = React.useState(util.createFromTemplate("progress"));
  const [checkpoints, setCheckpoints] = React.useState(util.createFromTemplate("lastSaved"));
  const [config, setConfig] = React.useState(util.createFromTemplate("config"));
  //const [confirmed, setConfirmed] = React.useState(false); // to handle nav

  const handleStateChange = (name, value) => {
    setState(prevState => {
      let newProp = {};
      newProp[name] = value;
      return Object.assign({}, prevState, newProp);
    });
  }

  const handleCheckpointChange = (name, value) => {
    setCheckpoints(prevState => {
      let newProp = {};
      newProp[name] = value;
      return Object.assign({}, prevState, newProp);
    });
  }


  const [constructorHasRun, setConstructorHasRun] = React.useState(false);

  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    initStateUpdate(handleStateChange, handleCheckpointChange);

    //todo if previously init get prev data as well
    console.log("initializing data collection");
    let config_ = activityData.config;

    if(!config_){
      try {
        config_ = await activity.getActivityConfig(activityData.id);
        activityData.config = config_;
      } catch (err) {
        util.handleError(err, "TripInProgress.constructor - getActivityConfig");
      }
    }

    setConfig(config_);

    if(activityData.started) {
      console.log("resuming activity");
      let prevStored = util.deepCopy(await activity.resumeActivity(activityData));
      Object.keys(prevStored).forEach((key) => prevStored[key].time = convertFormat(prevStored[key].time, "hour"));
      setCheckpoints(prevStored);
    } else {
      try {
        // todo check if activity hasn't started
        let startTime = await activity.startActivity(activityData.id, config_);
        activityData.started = true;
        activityData.startTime = startTime;
      } catch(err) {
        util.handleError(err, "TripInProgress.constructor - startActivity");
      }
    }
  });

  const handleBack = (e) => {
    // Prompt the user before leaving the screen
    Alert.alert(
      'Leave current activity?',
      'Data will not be collected unless you resume the activity. Are you sure you want to leave?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {return true} },
        {
          text: 'Leave',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: async () => {
            await activity.pauseActivity();
            confirmed = true;

            let actionType = e.data.action.type;
            if(actionType == "POP" || actionType == "GO_BACK") {
              navigation.dispatch(CommonActions.navigate({
                name: 'Activity',
                params: {data: activityData},
              }))
            } else if(e) {
              navigation.dispatch(e.data.action);
            }

            return false;
          },
        },
      ]
    );
  }

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        console.log("completed? " + activityData.completed + " confirmed " + confirmed);
        // Prevent default behavior of leaving the screen
        if(!(activityData.completed || confirmed)) {
          e.preventDefault();
          handleBack(e);
        }
      }),
    [navigation]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridContainer}>
        {Object.keys(state).map((type, index) => {
          return(
            <View key={index} style={styles.gridItem}>
              <Text>{dataTypes[type].title} </Text>
              <View style={styles.box}>
                <Text style={[styles.boxLevel, styles.boxTop]}>{state[type].toFixed(2).toString()} {dataTypes[type].unit}</Text>
                <View style={[styles.boxLevel]}>
                  <Text style={[styles.centered, styles.bold]}>Last {config[type].interval} {dataTypes[type].unit} {checkpointText[config[type].mode]}</Text>
                  <Text style={styles.centered}>
                    {(checkpoints[type].value != null) && checkpoints[type].value + ", "  + checkpoints[type].time}
                    {(checkpoints[type].value == null) && " -"}
                  </Text>
                </View>
              </View>
            </View>
          )
        })}
        <View style={styles.gridItem}>
          <Text>End Activity</Text>

          <View style={styles.mainAction}>
            <TouchableOpacity onPress={async () => {
              let data = await activity.endActivity(activityData);
              activityData.completed = data.completed;
              navigation.navigate('Activity', {data})
            }} >
              <FontAwesomeIcon icon="stop-circle" size={100}></FontAwesomeIcon>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default InProgress;

