
let config =  {
  distance: {
    mode: 'progress',
    interval: 1000
  },
  altitude: {
    mode: "progress",
    interval: 100
  },
  heartRate: {
    mode: "threshold",
    interval: 150
  },
  time: {
    mode: "progress",
    interval: 60
  },
  pressure: {
    mode: "threshold",
    interval: -500
  }
};

let lastSaved = {
  distance: {
    time: null,
    value: null
  },
  altitude: {
    time: null,
    value: null
  },
  heartRate: {
    time: null,
    value: null
  },
  time: {
    time: null,
    value: null
  },
  pressure: {
    time: null,
    value: null
  }
}

let data = {
  altitude: [],
  distance: [],
  pressure: [],
  heartRate: [],
  time: []
}

let progress = {
  distance: 0,
  altitude: 0,
  heartRate: 0,
  time: 0,
  pressure: 0
}

module.exports = {
  config,
  lastSaved,
  data,
  progress
}


