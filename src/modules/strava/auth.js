import {Linking} from 'react-native';
import {credentials} from "../../constants/credentials";
import activity from "./activity";

let userData = {
  expiresAt: "",
  expiresIn: "",
  refreshToken: "",
  tokenType: "",
  accessToken: ""
}

const handleToken = async(token) => {
  // TODO parameterize parts of url
  let url = "https://www.strava.com/api/v3/oauth/token?client_id=" + credentials.strava.client_id + "&client_secret=" + credentials.strava.client_secret
            +"&grant_type=authorization_code" + "&code=" + token;
  console.log(url);
  try {
    let response = await fetch(
      url, {method: "POST"}
    );

    let json = await response.json();
    userData.expiresAt = json.expires_at;
    userData.expiresIn = json.expires_in;
    userData.tokenType = json.token_type;
    userData.refreshToken = json.refresh_token;
    userData.accessToken = json.access_token;
    console.log(json);
    // TODO write these in db?
    activity.setToken(userData.accessToken);

  } catch (err)  {
    console.log("error in token request");
    console.log(err);
  }
}

const authenticate = async () => {
  let url = "https://www.strava.com/oauth/mobile/authorize"
            + "?client_id=" + credentials.strava.client_id + "&client_secret=" + credentials.strava.client_secret
            + "&response_type=code&scope=activity:read_all,activity:write&redirect_uri=" + encodeURIComponent("sonification://auth/strava");

  console.log(url);
  await Linking.openURL(url);
}

module.exports = {
  authenticate,
  handleToken
}
