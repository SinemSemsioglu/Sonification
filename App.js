import React, {useEffect} from 'react';
import {Linking, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './src/screens/Home'
import auth from './src/utils/auth'
import TripInProgress from './src/screens/TripInProgress';
import Activities from './src/screens/Activities';
import Activity from './src/screens/Activity';
import ConfigActivity from './src/screens/ConfigActivity';
import SummaryMusic from './src/screens/SummaryMusic'
import SoundDemo from './src/screens/SoundDemo';
import SoundSelection from './src/screens/SoundSelection';
import {navigationRef} from './RootNavigation';
import storage from './src/utils/storage';
import util from './src/utils/general';
import constants from './src/constants/general';



//const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


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

const ActivityStack = createStackNavigator();

function ActivityStackScreen() {
  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen name="Activities" component={Activities} />
      <ActivityStack.Screen name="Activity" component={Activity} />
      <ActivityStack.Screen name="ConfigActivity" component={ConfigActivity}/>
      <ActivityStack.Screen name="TripInProgress" component={TripInProgress}/>
      <ActivityStack.Screen name="SummaryMusic" component={SummaryMusic}/>
    </ActivityStack.Navigator>
  );
}

const SoundStack = createStackNavigator();

function SoundStackScreen() {
  return (
    <SoundStack.Navigator>
      <SoundStack.Screen name="SoundSelection" component={SoundSelection} />
      <SoundStack.Screen name="SoundDemo" component={SoundDemo} />
    </SoundStack.Navigator>
  );
}

const App: () => React$Node = () => {
  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    try {
      await storage.init();
    } catch(err) {
      util.handleError(err, "App.constructor - storage init");
    }

    try {
      let soundSet = await storage.get('soundSet');
      if (soundSet == null || soundSet == undefined) {
        await storage.save("soundSet", constants.defaultSoundSet);
        console.log("soundset set to default")
      } else {
        console.log("current soundset is " + soundSet);
      }
    } catch(err) {
      util.handleError(err, "App.constructor - soundset check/init");
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
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Activities" component={ActivityStackScreen} />
        <Tab.Screen name="Sounds" component={SoundStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );



  /*return (
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

          <Stack.Screen
            name="SoundDemo"
            component={SoundDemo}
            options={{
              headerTintColor: 'green',
              title: 'Sound Demo',
            }}
          />

          <Stack.Screen
            name="SoundSelection"
            component={SoundSelection}
            options={{
              headerTintColor: 'green',
              title: 'Sound Demo',
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );*/
};

export default App;
