import stravaAuth from '../modules/strava/auth';

const handleUrlRedirect = (module, token) => {
  console.log("in handle url redirect func")
  //TODO make this more auto
  if (module == "strava") {
    stravaAuth.handleToken(token)
  }
};

module.exports = {
  handleUrlRedirect
}
