import GoogleFit, { Scopes } from 'react-native-google-fit'
import {navigate} from '../../../RootNavigation';

// 782172144988-er0v8g4ekpl50lvvrkiqda55p4utfmkc.apps.googleusercontent.com

const authenticate = async () => {
  await GoogleFit.checkIsAuthorized();
  console.log(GoogleFit.isAuthorized);

  if(!GoogleFit.isAuthorized) {
    // The list of available scopes inside of src/scopes.js file
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        Scopes.FITNESS_ACTIVITY_WRITE,
        Scopes.FITNESS_BODY_READ,
        Scopes.FITNESS_BODY_WRITE,
      ]
    }

    GoogleFit.authorize(options)
      .then(authResult => {
        if (authResult.success) {
          //dispatch("AUTH_SUCCESS");
          console.log("auth success");
          // TODO navigate to trips to start a trip
          //navigate("TripInProgress")
        } else {
          //dispatch("AUTH_DENIED", authResult.message);
          console.log("auth denied " + authResult.message);
        }
      })
      .catch(() => {
        //dispatch("AUTH_ERROR");
        console.log("err");
      })
  } else {
    //navigate("TripInProgress")
  }
}

module.exports = {
  authenticate
}
