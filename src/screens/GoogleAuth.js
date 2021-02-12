import React from 'react';
import {Button, View} from 'react-native';
import google from "../modules/google/auth"
import google_fit from "../modules/google_fit/auth"

export default function GoogleAuth(props) {
  return(
    <View>
      <Button title="SignIn" onPress={() => {google.authenticate(); google_fit.authenticate();}} />
    </View>
  )
}
