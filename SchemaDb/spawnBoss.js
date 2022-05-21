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
});
module.exports = mongoose.model("SpawnBoss", SpawnBoss, "SpawnBoss");
