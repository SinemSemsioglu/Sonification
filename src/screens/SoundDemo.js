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
import sound from "../utils/sound";
import {dataTypes} from "../constants/general";
import storage from '../utils/storage';

const SoundDemo = ({route, navigation}) => {
  const types = Object.keys(dataTypes);
  let soundSetParam;
  if(route.params && route.params.soundSet) soundSetParam = route.params.soundSet;

  const [soundSet, setSoundSet] = React.useState(soundSetParam || null);
  const [constructorHasRun, setConstructorHasRun] = React.useState(false);

  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    if(soundSet == null) setSoundSet(await storage.get('soundSet'));
    await sound.initPlayers(soundSet);
  });

  return (
    <View>
      <Text>Sound samples for {soundSet}</Text>
      {types.map((type, index)=> {
        return (
          <View key={index}>
            <Text>{dataTypes[type].title}</Text>
            <Button title="Play" onPress={() => {
               sound.playAudio(type);
            }}/>
          </View>
        )
      })}
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

export default SoundDemo;
