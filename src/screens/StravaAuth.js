import React from 'react';
import {Button, View} from 'react-native';
import {authenticate} from "../modules/strava/auth"

export default function StravaAuth(props) {
  return(
    <View>
      <Button title="SignIn" onPress={() => authenticate()} />
    </View>
  )
}
