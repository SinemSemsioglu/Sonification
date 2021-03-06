import {
    Player
} from '@react-native-community/audio-toolkit';

import util from './general'
import storage from './storage'
import {dataTypes} from '../constants/general'

let players = {};
let summaryConfig = {
    heartRate: [
      "mid", "low", "high"
    ]
}

const initPlayers = async (soundSet, isSummary=false) => {
    console.log("initializing players");
    try {
        if(!soundSet) soundSet = await storage.get('soundSet');
        // todo since a new array is created deep copy is not neccessary?
        let types = Object.keys(dataTypes);
        if (isSummary) {
            Object.keys(summaryConfig).forEach((type) => {
                players[type] = {};
                summaryConfig[type].forEach((level) => {
                    let filename = soundSet + "_" + type.toLowerCase() + "_" + level + ".wav";

                    // todo for now only variable that has levels is hr and it loops
                    //  but if other leveled variables are added below statement must be rewritten
                    players[type][level] = initPlayer(filename, true);
                })

                // remove type from types
                types.splice(types.indexOf(type),1);
            })
        }

        types.forEach((type) => {
            let filename = soundSet + "_" + type.toLowerCase() + ".wav";
            players[type] = initPlayer(filename);
        })
    } catch (err) {
        util.handleError(err, "sound.initPlayers");
    }
}

const initPlayer = (filename, looping = false) => {
    return new Player(filename, {
        looping: looping,
        autoDestroy: false
    });
}

// players must be init beforehand
const playAudio = (mode, level) => {
    try {
        let player = players[mode];
        if (level) player = player[level];

        player.play((err) => {
            if (err) {
                console.log("error playing sound for mode " + mode + ", " + err.message);
            }
        });
    } catch (err) {
        util.handleError(err, "sound.playAudio");
    }
}

//todo too much duplication with the above func
const stopAudio = (mode, level) => {
    try {
        let player = players[mode];
        if (level) player = player[level];

        player.stop((err) => {
            if (err) {
                console.log("error stopping sound for mode " + mode + ", " + err.message);
            }
        });
    } catch (err) {
        util.handleError(err, "sound.stopAudio");
    }
}

const clearPlayers = async (isSummary = false) => {
    let types = Object.keys(dataTypes);

    try{
        if (isSummary) {
            let summaryTypes = Object.keys(summaryConfig);

            for(const type of summaryTypes){
                let levels = summaryConfig[type]

                for (const level of levels) {
                    await players[type][level].destroy();
                }

                // remove type from types
                types.splice(types.indexOf(type),1);
            }
        }

        for (const type of types) {
            await players[type].destroy();
        }
    } catch (err)  {
        util.handleError(err, "sound.clearPlayers")
    }

    players = {};
}

module.exports = {
    playAudio,
    stopAudio,
    initPlayers,
    clearPlayers
};
