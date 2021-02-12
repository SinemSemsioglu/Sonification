import React from 'react';
import {StyleSheet, Button, Text, View, Alert} from 'react-native';
import util from "../utils/general";
import activity from "../modules/general/activity";
import {initStateUpdate} from '../utils/data';
import {dataTypes} from '../constants/general';

// todo make styles common
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  baseText: {
    fontFamily: "Cochin"
  }
});

const checkpointText = {
  threshold: "crossed",
  progress: "checkpoint",
  time: "checkpoint"
}

const TripInProgress = ({route, navigation}) => {
  const activityData = route.params.data;

  //todo these are initialized at each render? if so what a waste
  const [state, setState] = React.useState(util.createFromTemplate("progress"));
  const [checkpoints, setCheckpoints] = React.useState(util.createFromTemplate("lastSaved"));
  const [config, setConfig] = React.useState(util.createFromTemplate("config"));


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
      await activity.resumeActivity(activityData);
    } else {
      try {
        // todo check if activity hasn't started
        await activity.startActivity(activityData.id, config_);
        activityData.started = true;
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
          onPress: () => {
            activity.pauseActivity();
            if(e) navigation.dispatch(e.data.action);
            return false;
          },
        },
      ]
    );
  }

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        if(!activityData.completed) {
          e.preventDefault();
          handleBack(e);
        }
      }),
    [navigation]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.baseText}> In Progress </Text>
      {Object.keys(state).map((type, index) => {
        return(
          <View key = {index}>
            <Text> {dataTypes[type].title}: {state[type].toFixed(2).toString()} </Text>
            <Text> Last {config[type].interval} {dataTypes[type].unit} {checkpointText[config[type].mode]}:
              {checkpoints[type].value && checkpoints[type].value + ", "  + checkpoints[type].time}
              {!checkpoints[type].value && " -"}
            </Text>
          </View>
        )
      })}

      <Button title="End Trip" onPress={async () => {
        await activity.endActivity(activityData);

        activityData.completed = true;
        navigation.navigate('Activity', {data: activityData})
      }} />
    </View>
  );
}
// todo save item data to db

export default TripInProgress;

