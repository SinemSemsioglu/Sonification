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
import {styles} from '../styles/general';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.description}>Sound samples for {soundSet}</Text>
      <View style={styles.section}>
        {types.map((type, index)=> {
          return (
            <View key={index} style={styles.listItem}>
              <Text>{dataTypes[type].title}</Text>
              <TouchableOpacity style={styles.iconButton} onPress={() => {sound.playAudio(type);}}>
                <FontAwesomeIcon icon="play-circle" size={24}></FontAwesomeIcon>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

export default SoundDemo;
