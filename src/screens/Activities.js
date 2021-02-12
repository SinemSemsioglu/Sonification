import React from 'react';
import {SectionList, Button, StyleSheet, Text, View} from 'react-native';
import activity from '../modules/general/activity'
import util from "../utils/general";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});


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

  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {title: 'In Progress', data: state.inProgressTrips},
          {title: 'Completed', data: state.completedTrips},
        ]}
        renderItem={({item}) => <Text onPress={() => navigation.navigate('Activity', {data: item})} style={styles.item}>{item.id}</Text>}
        renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

export default Activities;
