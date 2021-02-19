import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'

import google from "../modules/google/auth"
import activity from '../modules/general/activity';
import util from '../utils/general';
import storage from '../utils/storage';
import {styles} from '../styles/general';
import {SafeAreaView} from 'react-native-safe-area-context';


const Home = ({route, navigation}) => {
  const addActivityAndNavigate = async () => {
    if (authorized) {
      try {
        let newActivity = await activity.createActivity();
        navigation.navigate('Activity', {screen: 'Activity', params: {data: newActivity}});
      } catch (err) {
        util.handleError(err, "Home.addActivityAndNavigate");
      }
    } else {
      alert("You need Fitness authorization before creating an activity")
    }
  }

  const [authorized, setAuthorized] = React.useState(false);

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    try {
      let isAuth = await google.checkAuthorized()
      setAuthorized(isAuth);
      await storage.save('auth', isAuth.toString())
    } catch (err){
      util.handleError(err, "Home.constructor")
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo}>
        <FontAwesomeIcon icon="hiking" size={38}></FontAwesomeIcon>
        <Text style={styles.logoText}>SoniClimb</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.description}>This is an application developed as part of a research project in Koc University.
          It tracks and sonifies activity data, intended to be used during mountaineering activities.
        </Text>
      </View>

      <View style={styles.mainAction}>
        <TouchableOpacity style={styles.iconButton} onPress={addActivityAndNavigate}>
          <FontAwesomeIcon icon="plus-circle" size={76}></FontAwesomeIcon>
        </TouchableOpacity>
        <Text>Create an Activity</Text>
      </View>
      <View style={[styles.section, styles.indented]}>
        <Text style={[styles.centered, styles.paragraph]}>You can see your previous activities, selected activity and configure the sounds you hear from the bottom tab</Text>

        <View style={styles.horizontalButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {console.log("icon pressed"); navigation.navigate("Activities")}}>
            <FontAwesomeIcon icon="bars" size={38}></FontAwesomeIcon>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => {console.log("icon pressed"); navigation.navigate("Activity")}}>
            <FontAwesomeIcon icon="hiking" size={38}></FontAwesomeIcon>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => {navigation.navigate("Sounds")}}>
            <FontAwesomeIcon icon="music" size={38}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.section, styles.bottomed]}>
        <Text style={[styles.centered, styles.paragraph]}>Authorize the use of Fitness data by clicking, gets data from Google Fit on Android and Apple Health on iOS.</Text>
        <View style={styles.horizontalButtons}>
          <TouchableOpacity style={styles.iconButton}
                            onPress={async () => {
                              if(!authorized) {
                                try {
                                  await google.authenticate();
                                  let isAuth = await google.checkAuthorized();
                                  console.log(isAuth);
                                  if (isAuth !== true) alert("Error with Google Authentication")
                                  else setAuthorized(isAuth);
                                  await storage.save('auth', isAuth.toString())
                                } catch {
                                  alert("Error with Fitness Authentication")
                                }
                              } else {
                                alert("Already authorized Fitness")
                              }
                            }}>
            <FontAwesomeIcon icon="heart" size={38} color={authorized? 'green' : 'red'}></FontAwesomeIcon>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Home;
