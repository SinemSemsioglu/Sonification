const dataTypes = {
  distance: {
    title: "Distance",
    unit_text: "meters",
    unit: "m"
  },
  altitude: {
    title: "Altitude Change",
    unit_text: "meters",
    unit: "m"
  },
  time: {
    title: "Time Passed",
    unit_text: "minutes",
    unit: "min"
  },
  pressure: {
    title: "Pressure",
    unit_text: "hectoPascal/millibar",
    unit: "hPa/mbar"
  },
  heartRate: {
    title: "Heart Rate",
    unit_text: "beats per minute",
    unit: "bpm"
  }
}

const defaultSoundSet = "synthetic";

const soundSets = ["synthetic", "organic", "hybrid"];

module.exports = {
  dataTypes,
  defaultSoundSet,
  soundSets
}
