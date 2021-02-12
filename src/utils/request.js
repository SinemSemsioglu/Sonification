
const sendAuthRequest = async (url, method, token, params = {}) => {
  try {
    let opts = {
      method: method,
      headers: {
        Authorization: "Bearer " + token
      }
    };

    if (method == "POST") {
      opts.body = JSON.stringify(params)
    }

    let response = await fetch(url,opts);

    return await response.json();
  } catch (err) {
    console.log("err in auth req");
    console.log(err);
  }

}


module.exports = {
  sendAuthRequest
}
