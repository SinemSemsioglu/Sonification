import React from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {styles} from '../styles/general';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import activity from '../modules/general/activity';
import util from '../utils/general';
import storage from '../utils/storage'

function Activity({ route, navigation }) {
  const [activityData, setActivityData] = React.useState(route.params && route.params.data ? route.params.data : null)

  React.useEffect(() => {
    if (route.params?.data) {
      // Post updated, do something with `route.params.post`
      // For example, send the post to the server
      console.log(route.params.data);
      setActivityData(route.params.data);
    }
  }, [route.params?.data]);


  if(activityData != null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={[styles.header, styles.centered]}>{activityData.id}</Text>
        <View style={styles.section}>
          <Text style={[styles.description, styles.centered]}>
            {activityData.started ? "This activity started at " + activityData.startTime : "This activity hasn't been started yet" }
          </Text>
          <View style={styles.mainAction}>
            <TouchableOpacity style={styles.iconButton}
                              onPress={() => {
                                if(!activityData.started) navigation.navigate('ConfigActivity', {data: activityData})
                              }}>
              <FontAwesomeIcon icon="cog" size={76} color={!activityData.started ? 'black' : 'gray'}></FontAwesomeIcon>
            </TouchableOpacity>
            <Text>Configure Interval Settings</Text>
          </View>
          <View style={styles.mainAction}>
            <TouchableOpacity style={styles.iconButton}
                              onPress={() => {
                                if(!activityData.completed) navigation.navigate('InProgress', {data: activityData})
                              }}>
              <FontAwesomeIcon icon="play-circle" size={76} color={activityData.completed ? 'gray' : 'black'}></FontAwesomeIcon>
            </TouchableOpacity>
            <Text>Start/Resume Activity</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.description, styles.centered]}>
            {activityData.completed ? "This activity ended at " + activityData.endTime : "This activity is in progress" }
          </Text>
          <View style={styles.mainAction}>
            <TouchableOpacity style={styles.iconButton}
                              onPress={() => {
                                if (activityData.completed) navigation.navigate('SummaryMusic', {data: activityData})
                              }}>
              <FontAwesomeIcon icon="headphones" size={76} color={activityData.completed ? 'black' : 'gray'}></FontAwesomeIcon>
            </TouchableOpacity>
            <Text>Listen to Summary Music</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.mainAction}>
          <Text style={styles.description}>No activity is selected, please select one from Activities Tab</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => {console.log("icon pressed"); navigation.navigate("Activities")}}>
            <FontAwesomeIcon icon="bars" size={76}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
        <View style={styles.mainAction}>
          <Text style={styles.description}>Or create one</Text>
          <TouchableOpacity style={styles.iconButton} onPress={async ()=>{
            let isAuth = util.parseBool(await storage.get('auth')); // getting auth might be put into an auth module or sth
            if (isAuth) {
              try {
                let newActivity = await activity.createActivity();
                setActivityData(newActivity)
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
      </SafeAreaView>
    )
  }
}

export default Activity;
