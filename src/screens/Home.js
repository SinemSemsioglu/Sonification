import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import google from "../modules/google/auth"
import activity from '../modules/general/activity';
import util from '../utils/general';


const Home = ({route, navigation}) => {
  const addActivityAndNavigate = async (navigation) => {
    if (authorized) {
      try {
        let newActivity = await activity.createActivity();
        navigation.navigate('ConfigActivity', {data: newActivity});
      } catch (err) {
        util.handleError(err, "Home.addActivityAndNavigate");
      }
    } else {
      alert("You need Google authorization before creating an activity")
    }
  }


  const [authorized, setAuthorized] = React.useState(false);

  const [constructorHasRun, setConstructorHasRun] = React.useState(false);
  util.useConstructor(constructorHasRun, setConstructorHasRun, async () => {
    try {
      setAuthorized(await google.checkAuthorized());
    } catch (err){
      util.handleError(err, "Home.constructor")
    }
  });

  return (
    <View style={styles.container}>
      <Text>Google Authorization</Text>
      {
        (authorized && <Text>Authorized</Text>) ||
        (!authorized &&
          <Button title={"Authorize Google"} onPress={async () => {
            try {
              await google.authenticate();
              let isAuth = await google.checkAuthorized();
              console.log(isAuth);
              if (isAuth !== true) alert("Error with Google Authentication")
              else setAuthorized(isAuth);
            } catch {
              alert("Error with Google Authentication")
            }

          }}/>)
      }
      <Button title={"Your Activities"} onPress={() => {navigation.navigate("Activities")}}/>
      <Button title={"New Activity"} onPress={() => {addActivityAndNavigate(navigation)}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonList: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    margin: 10,
    backgroundColor: 'green',
    borderRadius: 5,
    padding: 10,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Home;
