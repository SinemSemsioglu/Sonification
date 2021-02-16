import React from 'react';
import {SafeAreaView, ScrollView, Button, TextInput, Text, View, Alert} from 'react-native';
import util from "../utils/general";
import activity from "../modules/general/activity";
import {dataTypes} from '../constants/general';
import {styles} from '../styles/general';

const ConfigureTripSummary = ({route, navigation}) => {
  const activityData = route.params.data;

  console.log("logging in configure trip summary")

  let config = activityData.config || util.createFromTemplate("config");

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    if(!activityData.config) {
      try {
        config = await activity.getActivityConfig(activityData.id);
        //setState(util.stringifyConfigValues(config));
      } catch (err){
        util.handleError(err, "ConfigActivity.constructor")
      }
    }
  });

  config = util.stringifyConfigValues(config);

  const [state, setState] = React.useState({
    distance: config.distance.interval,
    altitude: config.altitude.interval,
    heartRate: config.heartRate.interval,
    pressure: config.pressure.interval,
    time: config.time.interval
  });

  const handleBack = (e) => {
    // Prompt the user before leaving the screen
    let msg = activityData.started? "Data will not be saved if you leave." : "Activity will not be saved if you leave."
    Alert.alert(
      'Leave config?',
      msg + ' Are you sure you want to leave?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {return true} },
        {
          text: 'Leave',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
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
        let actionType = e.data.action.type;
        if(actionType != "NAVIGATE") {
          e.preventDefault();
          handleBack(e);
        }
      }),
    [navigation]
  );

  // todo put this in utils
  const handleChange = (name, value) => {
    setState({
      ...state,
      [name]: value
    });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Text style={[styles.description, styles.paragraph]}>When do you want to be notified of tracked data?</Text>
          <Text style={styles.paragraph}>For progress tracking mode, you will be notified each time the value is reached</Text>
          <Text style={styles.paragraph}>For threshold tracking mode, you will be notified each time the value is crossed.
            If you want to be notified when going below a value use a negative sign (for example the default configuration
            checks when pressure is below 500 hPa - the input it -500)
          </Text>

          <View style={styles.section}>
            {Object.keys(state).map((type, index) => {
              return(
                <View style={styles.tInput} key={index}>
                  <Text style={styles.bold}>{dataTypes[type].title} ({dataTypes[type].unit_text}) </Text>
                  <Text>The tracking mode for this parameter is {config[type].mode}</Text>
                  <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => handleChange(type, text)}
                    value={state[type]}
                  />
                </View>)
            })}

            <View style={styles.section}>
              <Button title="Next" onPress={async () => {
                try {
                  Object.keys(state).forEach((dataType) => {
                    activityData.config[dataType].interval = parseFloat(state[dataType]);
                  });

                  let data = await activity.saveActivity(activityData);

                  if(data) {
                    navigation.navigate('Activity', {data})
                  } else {
                    // todo error saving activity
                    navigation.navigate('Activities', {data})
                  }

                } catch (err) {
                  util.handleError(err, "ConfigActivity.next")
                }
              }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// todo save item data to db
// todo make weather dropdown

export default ConfigureTripSummary;
