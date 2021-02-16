import React from 'react';
import {
  View,
  Text,
  Button,
  Alert, TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import util from "../utils/general";
import {soundSets} from "../constants/general";
import storage from '../utils/storage';
import {styles} from '../styles/general';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {SafeAreaView} from 'react-native-safe-area-context';

const SoundDemo = ({route, navigation}) => {

  let defaultState = {};

  soundSets.forEach((set) => {
    defaultState[set] = false;
  })

  const [selectedSoundSet, setSelectedSoundSet] = React.useState(null);
  const [soundSetsSelection, setSoundSetsSelection] = React.useState(defaultState);
  const [constructorHasRun, setConstructorHasRun] = React.useState(false);

  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    let selected = await storage.get('soundSet');
    await handleChange(selected, true);
  });

  const handleBack = (e) => {
    // Prompt the user before leaving the screen
    Alert.alert(
      'SoundSet Selection',
      'Please select one sound set before you leave this screen',
      [
        { text: "Cancel", style: 'cancel', onPress: () => {return true} }
      ]
    );
  }

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', async (e) => {
        // Prevent default behavior of leaving the screen
        console.log(selectedSoundSet);
        if(selectedSoundSet == null) {
          e.preventDefault();
          handleBack(e);
        } else {
          await storage.save('soundSet', selectedSoundSet);
          consoe.log("soundset saved as " + selectedSoundSet);
        }
      }),
    [navigation, selectedSoundSet]
  );

  const handleRemove = (e) => {

  }

  const handleChange = async (name, value) => {
    let changeObj = {};
    changeObj[name] = value;
    console.log("name " + name + " value " + value);
    if(value == true) {
      if(selectedSoundSet != null) changeObj[selectedSoundSet] = false;
      setSelectedSoundSet(name);
      await storage.save('soundSet', name);
    } else {
      setSelectedSoundSet(null);
    }

    setSoundSetsSelection(prevState => {
      return Object.assign({}, prevState, changeObj);
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.description, styles.centered, styles.indented]}>
          Currently selected sound set is {selectedSoundSet}
        </Text>
        <View style={styles.mainAction}>
            <TouchableOpacity style={styles.iconButton} onPress={() => {navigation.navigate("SoundDemo", {soundSet: selectedSoundSet})}}>
              <FontAwesomeIcon icon="headphones" size={76}></FontAwesomeIcon>
            </TouchableOpacity>
          <Text>Listen to Samples</Text>
        </View>
    </View>
      <View style={[styles.section, styles.bottomed]}>
        <Text  style={styles.listItem}>You can configure the soundset here</Text>
        {soundSets.map((set, index)=> {
          return (
            <View key={index} style={styles.listItem}>
              <View style={styles.checkBox} >
                <CheckBox
                  disabled={false}
                  value={soundSetsSelection[set]}
                  onValueChange={(newValue) => handleChange(set, newValue)}
                />
                <Text>{set}</Text>
              </View>

              <TouchableOpacity style={styles.iconButton} onPress={() => {navigation.navigate("SoundDemo", {soundSet: set})}}>
                <FontAwesomeIcon icon="headphones" size={24}></FontAwesomeIcon>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </SafeAreaView>
  )
}

export default SoundDemo;
