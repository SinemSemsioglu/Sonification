import {ToastAndroid} from "react-native";

/**
 * Displays the results on the UI as a toast message.
 *
 * @param message Log string.
 */

const notify = (message) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

/**
 * Shows the success results as an output in the metro console.
 *
 * @param msg String message value.
 * @param result String result value which is the result of the calling api.
 */
const logResult = (msg, result) => {
  console.log('*'.repeat(20 + msg.length));
  console.log('****** ' + msg + ' *****');
  console.log('*'.repeat(20 + msg.length));
  console.log(JSON.stringify(result));
  console.log('*'.repeat(20 + msg.length));
}

module.exports = {
  notify,
  logResult
}
