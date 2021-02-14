import React from 'react';
import {
  View,
  Button,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import util from "../utils/general";
import time from "../utils/time";
import sound from "../utils/sound";
import activity from "../modules/general/activity";



const SummaryMusic = ({route, navigation}) => {
  const activityData = route.params.data;
  console.log(activityData);
  let duration = time.calculateTimeDiff(activityData.startTime, activityData.endTime, "seconds");
  let timeCoeff = 60 / (duration) * 1000;

  console.log(duration);
  console.log(timeCoeff);

  const [recordedData, setState] = React.useState({});
  const [prevHR, setPrevHR] = React.useState(null);

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    setState(await activity.getActivityData(activityData.id))
    await sound.initPlayers(null,true);
  });

  return (
    <View>
      <Button title="Play" onPress={async () => {
        Object.keys(recordedData).forEach((data) => {
          let points = recordedData[data];
          points.forEach((pt) => {
            setTimeout(()=>{
              if(data == "heartRate") {
                //todo how to define these intervals?
                let level = "mid";
                if (pt.value < 80) level = "low";
                else if (pt.value > 120) level = "high";

                if(prevHR !== null) sound.stopAudio(data, prevHR);
                sound.playAudio(data, level);
                setPrevHR(level);
              } else {
                sound.playAudio(data)
              }
            }, pt.timePassed * timeCoeff);
          });
        });
      }}/>
    </View>
  )
}

const styles = StyleSheet.create({
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: '#d3d3d3',
    height: 56,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  button: {
    fontSize: 24,
  },
  arrow: {
    color: '#ef4771',
  },
  icon: {
    width: 20,
    height: 20,
  },
});
export default SummaryMusic;
