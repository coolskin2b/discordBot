const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const SpawnBoss = new Schema({
  boss: { type: Schema.Types.ObjectId, ref: "Boss", required: true },
  //created at
  createdAt: {
    type: Date,
    default: Date.now,
  },
  //updated at
  updatedAt: {
    type: Date,
    default: null,
  },
  //found dead at
  foundDeadAt: {
    type: Date,
    default: null,
  },
  //found alive at
  foundAliveAt: {
    type: Date,
    default: null,
  },
  // temps restant avant swpan
  tempsRestant: {
    type: Number,
    required: false,
  },
  //create readable id with https://github.com/ai/nanoid/
    readableId: {
        type: String,
        required: true,
    },
    // last spwan boss object id ref SpawnBoss
    lastSpawnBoss: {
        type: Schema.Types.ObjectId,
        ref: "SpawnBoss",
        required: false,
    },
    // guild spawn control bool
    guildSpawnControl: {
        type: Boolean,
        required: true,
        default: false,
    },
    // datetime when missed spawn
    // permet de donner une fourchette de temps pour le spawn + ou mois de temps : (missedSpawnAt - minispanw time) exemple : vue a louper a 14 heure et devais spawn a 13 heure on sait que le prochain swpan sera  la premochaine fois spawn mini + 1 heure
    missedSpawnAt: {
        type: Date,
        default: null,
    },
    // natural check if boss is alive check one hours later if it summunoned or natural need natural ckeck
    naturalCheck: {
        type: Boolean,
        required: true,
        default: false,
    },
});
module.exports = mongoose.model("SpawnBoss", SpawnBoss, "SpawnBoss");
