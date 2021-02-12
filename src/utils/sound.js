import {
    Player,
    Recorder,
    MediaStates
} from '@react-native-community/audio-toolkit';

import util from './general'

// sound config
const mapping = {
    altitude: "s1",
    distance: "s2",
    heartRate: "s3",
    pressure: "s1_alt",
    time: "s2_alt"
}

let players = {};

const initPlayers = () => {
    Object.keys(mapping).forEach((type) => {
        let filename = mapping[type] + ".mp3"
        const sound = new Player(filename, {
            looping: false,
            autoDestroy: false
        });

        players[type] = sound;
    })
}

// todo players can be init beforehand
const playAudio = (mode) => {
    try {
        if (Object.keys(players).length == 0) initPlayers();

        players[mode].play((err) => {
            if (err) {
                console.log("error playing sound for mode " + mode + ", " + err.message);
            }
        });
    } catch (err) {
        util.handleError(err, "sound.playAudio");
    }

}

const clearPlayers = () => {
    Object.keys(mapping).forEach((type) => {
        players[type].destroy((err) => {
            if (err) {
                console.log("error destroying player " + err.message);
            } else {
                console.log("player destroyed")
            }
        });
    })

    players = {};
}

module.exports = {
    playAudio,
    clearPlayers
};
