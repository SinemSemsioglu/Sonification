import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

// todo make styles common
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  }
});

function Activity({ route, navigation }) {
  const activityData = route.params.data;

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        // Prevent default behavior of leaving the screen
        if(!activityData.completed) {
          let actionType = e.data.action.type;
          console.log(actionType);
          if(actionType == "POP" || actionType == "GO_BACK") {
            e.preventDefault();
            navigation.navigate("Activities");
          }
        }
      }),
    [navigation]
  );

  return (
    <View style={styles.container}>
      <Button disabled={activityData.completed || activityData.started} title="Configure Trip Settings" onPress={() => navigation.navigate('ConfigActivity', {data: activityData})} />
      <Button disabled={activityData.completed} title="Start/Continue Trip" onPress={() => navigation.navigate('TripInProgress', {data: activityData})} />
      <Button disabled={!activityData.completed} title="Listen to Summary Music" onPress={() => navigation.navigate('SummaryMusic', {data: activityData})} />
    </View>
  );
}

export default Activity;
