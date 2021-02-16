import React from 'react';
import {SectionList, Text, View, TouchableOpacity, TouchableHighlight, SafeAreaView, ScrollView} from 'react-native';
import activity from '../modules/general/activity'
import util from '../utils/general';
import {styles} from '../styles/general'
import storage from '../utils/storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';


const getActivities = async (setState) => {
  try {
    let activities = await activity.getActivities();
    console.log("activities fetched");
    console.log(activities);

    let inProgressTrips = activities.filter((elm) => !elm.completed);
    let completedTrips = activities.filter((elm) => elm.completed)

    setState({inProgressTrips, completedTrips});
  } catch (err) {
    util.handleError(err, "Activities.getActivities");
  }
}

// todo get trips from the database
// todo go to trip page on click
// todo add an add trip button
// todo create a new entry in db an pass its id in add trip
const Activities = ({navigation}) => {
  const [state, setState] = React.useState({
    inProgressTrips: [],
    completedTrips: []
  });

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    try {
      await getActivities(setState);
    } catch (err){
      util.handleError(err, "Activities.constructor")
    }
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log("focus removed");
      try {
        await getActivities(setState);
      } catch (err){
        util.handleError(err, "Activities.constructor")
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
          {state.inProgressTrips.length > 0 &&
            <View style={styles.section}>
              <Text style={styles.header}>In Progress</Text>
              {state.inProgressTrips.map((item, index) => {
                return(
                  <TouchableHighlight key={index} style={styles.activityListItem}>
                    <Text style={styles.description} onPress={() => navigation.navigate('Activity', {screen: 'Activity', params: {data: item}})}>
                      {item.id}
                    </Text>
                  </TouchableHighlight>
                )

              })}
            </View>
          }
          {state.completedTrips.length > 0 &&
            <View style={styles.section}>
              <Text style={styles.header}>Completed</Text>
              {state.completedTrips.map((item, index) => {
                return(
                  <TouchableHighlight key={index} style={styles.activityListItem}>
                    <Text style={styles.description} onPress={() => navigation.navigate('Activity', {screen: 'Activity', params: {data: item}})}>
                      {item.id}
                    </Text>
                  </TouchableHighlight>
                )
              })}
            </View>
          }
          <View>
            <Text style={styles.header}>New</Text>
            <TouchableOpacity style={styles.iconButton} onPress={async ()=>{
              let isAuth = util.parseBool(await storage.get('auth')); // getting auth might be put into an auth module or sth
              if (isAuth) {
                try {
                  let newActivity = await activity.createActivity();
                  navigation.navigate('Activity', {screen: 'Activity', params: {data: newActivity}});
                } catch (err) {
                  util.handleError(err, "Activity.addActivity");
                }
              } else {
                alert("You need Google authorization before creating an activity")
              }
            }}>
              <FontAwesomeIcon icon="plus-circle" size={76}></FontAwesomeIcon>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Activities;
