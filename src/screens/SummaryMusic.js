import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import util from "../utils/general";
import time from "../utils/time";
import sound from "../utils/sound";
import activity from "../modules/general/activity";
import {styles} from "../styles/general"
import {dataTypes} from '../constants/general';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SafeAreaView} from 'react-native-safe-area-context';

const SummaryMusic = ({route, navigation}) => {
  const activityData = route.params.data;
  console.log(activityData);
  let duration = time.calculateTimeDiff(activityData.startTime, activityData.endTime, "seconds");
  let timeCoeff = 1/20;

  console.log(duration);
  console.log(timeCoeff);

  const [playing, setPlaying] = React.useState(false);
  const [composition, setComposition] = React.useState([]);
  const [prevHR, setPrevHR] = React.useState(null);

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    let recordedData = await activity.getActivityData(activityData.id)
    let composition = {};
    console.log(recordedData);
    Object.keys(recordedData).forEach((type) => {
      let data = recordedData[type];
      data.forEach((point) => {
        let i = Math.floor(point.timePassed);
        console.log(i);
        let obj = {type: type, value: point.value};
        if (composition[i] == undefined) composition[i] = [obj];
        else composition[i].push(obj)
      })
    });

    setComposition(composition);
    console.log("composition set with length " + Object.keys(composition).length);
    console.log(composition[61]);
    await sound.initPlayers(null,true);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainAction}>
        <TouchableOpacity  onPress={() => {
          if(!playing) {
            let i=0;
            setPlaying(true);
            let compInterval = setInterval(() => {
              if (i >= duration) {
                clearInterval(compInterval);
                if(prevHR !== null) sound.stopAudio("heartRate", prevHR);
                setPlaying(false);
              } else {
                let points = composition[i];
                if (points) {
                  console.log("sound at index " + i);
                  points.forEach((pt) => {
                    if(pt.type == "heartRate") {
                      //todo how to define these intervals?
                      let level = "mid";
                      if (pt.value < 80) level = "low";
                      else if (pt.value > 120) level = "high";

                      if(prevHR !== null) sound.stopAudio(pt.type, prevHR);
                      sound.playAudio(pt.type, level);
                      setPrevHR(level);
                    } else {
                      sound.playAudio(pt.type)
                    }
                  });
                }
              }
              i++;
            }, 1000 * timeCoeff)
          }
        }}>
          <FontAwesomeIcon icon="play-circle" size={76} color={playing? 'gray' : 'black'}></FontAwesomeIcon>
        </TouchableOpacity>
        <Text>Listen to the summary music</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.description}>Last Saved State</Text>
        <View style={styles.gridContainer}>
          {Object.keys(activityData.state).map((type, index) => {
            return(
              <View key={index} style={styles.gridItem}>
                <Text>{(dataTypes[type] && dataTypes[type].title) || "bla"} </Text>
                <View style={styles.box}>
                  <Text style={[styles.boxLevel]}>{activityData.state[type].value} {(dataTypes[type] && dataTypes[type].unit) || "bla"}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default SummaryMusic;
