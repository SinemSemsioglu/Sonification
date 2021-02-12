import React, {useEffect} from 'react';
import {Linking, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import Home from './src/screens/Home'
import StravaAuth from './src/screens/StravaAuth'
import GoogleAuth from './src/screens/GoogleAuth'

import auth from './src/utils/auth'
import TripInProgress from './src/screens/TripInProgress';
import Activities from './src/screens/Activities';
import Activity from './src/screens/Activity';
import ConfigActivity from './src/screens/ConfigActivity';
import SummaryMusic from './src/screens/SummaryMusic'
import {navigationRef} from './RootNavigation';
import storage from './src/utils/storage';
import util from './src/utils/general';



const Stack = createStackNavigator();

// TODO do this smwhereelse
Linking.addEventListener('url', (redirectLink) => {
  console.log('in event listener with link ');
  console.log(redirectLink);

  if (redirectLink !== null && redirectLink.hasOwnProperty('url')) {
    let urlComps = redirectLink.url.split("?");

    let module = urlComps[0].split(":")[1].split('/')[3]; // TODO clean this
    let token = urlComps[1].split("&")[0].split("=")[1]; // might be different for other api's
    console.log("module is " + module + " and token is " + token);

    if(module && token) {
      //navigate(auth, {module, token});
      auth.handleUrlRedirect(module, token);
    }
  }
});

const App: () => React$Node = () => {
  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    try {
      await storage.init();
    } catch(err) {
      console.log("storage couldn't be initialized");
    }
  });

  useEffect(()=> {
    const navigateToLink = async () => {
      try {
        let url = await Linking.getInitialURL();

        console.log("url received");
        console.log(url);

        if (url !== null) {
          props.navigation.navigate(url);
        }
      } catch (err) {
        console.log(err);
      }
    }

    navigateToLink();
  });

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer ref={navigationRef}>

        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTintColor: 'green',
              title: 'Home',
            }}
          />
          <Stack.Screen
            name="StravaAuth"
            component={StravaAuth}
            options={{
              headerTintColor: 'green',
              title: 'Strava Auth',
            }}
          />
          <Stack.Screen
            name="GoogleAuth"
            component={GoogleAuth}
            options={{
              headerTintColor: 'green',
              title: 'Google Auth',
            }}
          />

          <Stack.Screen
            name="Activities"
            component={Activities}
            options={{
              headerTintColor: 'green',
              title: 'Activities',
            }}
          />

          <Stack.Screen
            name="Activity"
            component={Activity}
            options={{
              headerTintColor: 'green',
              title: 'Trip in Progress',
            }}
          />

          <Stack.Screen
            name="TripInProgress"
            component={TripInProgress}
            options={{
              headerTintColor: 'green',
              title: 'Trip in Progress',
            }}
          />

          <Stack.Screen
            name="ConfigActivity"
            component={ConfigActivity}
            options={{
              headerTintColor: 'green',
              title: 'Configure Activity',
            }}
          />

          <Stack.Screen
            name="SummaryMusic"
            component={SummaryMusic}
            options={{
              headerTintColor: 'green',
              title: 'Summary Music',
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
