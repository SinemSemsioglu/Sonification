import React from 'react';
import {
  View,
  Text,
  Button,
  Alert
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

import util from "../utils/general";
import {soundSets} from "../constants/general";
import storage from '../utils/storage';

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
        }
      }),
    [navigation, selectedSoundSet]
  );

  const handleRemove = (e) => {

  }

  const handleChange = (name, value) => {
    let changeObj = {};
    changeObj[name] = value;
    console.log("name " + name + " value " + value);
    if(value == true) {
      console.log("prev " + selectedSoundSet);
      if(selectedSoundSet != null) changeObj[selectedSoundSet] = false;
      setSelectedSoundSet(name);
      console.log("next " + selectedSoundSet);
    } else {
      setSelectedSoundSet(null);
    }

    setSoundSetsSelection(prevState => {
      return Object.assign({}, prevState, changeObj);
    });
  }

  return (
    <View>
      <Text>Which soundset would you like to listen to?</Text>
      {soundSets.map((set, index)=> {
        return (
          <View key={index}>
            <CheckBox
              disabled={false}
              value={soundSetsSelection[set]}
              onValueChange={(newValue) => handleChange(set, newValue)}
            />
            <Text>{set}</Text>
            <Button title="Listen" onPress={() => {
              navigation.navigate("SoundDemo", {soundSet: set})
            }}/>
          </View>
        )
      })}
    </View>
  )
}

export default SoundDemo;
