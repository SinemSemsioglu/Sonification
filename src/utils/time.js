import moment from 'moment'

const formats = {
  default: "DD/MM/YYYY, HH:mm:ss",
  huawei: "YYYY-MM-DD HH:mm:ss",
  strava: "YYYYMMDD",
  google: "YYYY-MM-DDTHH:mm:ss.SSSZ",
  hour: "HH:mm"
}

const getCurrentTime = (mode) => {
  let format = mode? formats[mode] : formats.default;
  // todo return string
  return moment().format(format);
}

const calculateTimeDiff = (t1, t2, unit="minutes") => {
  // todo maybe we can do this in minutes
  return (moment(t2, formats.default).diff(moment(t1, formats.default), unit)).toFixed(2);
}

// minutes?
const getTimePassed = (refTime) => {
  return moment().diff(moment(refTime, formats.default),"minutes" );
}

const timeStampToDef = (ts) => {
  return moment(ts).format(formats.default);
}

const convertFormat = (t, convertTo, convertFrom = "default") => {
  return moment(t, formats[convertFrom]).format(formats[convertTo]);
}

module.exports = {
  getCurrentTime,
  calculateTimeDiff,
  getTimePassed,
  timeStampToDef,
  convertFormat
}
