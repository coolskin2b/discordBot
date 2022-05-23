const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const memberCheck = new Schema({
  spawnBoss: { type: Schema.Types.ObjectId, ref: "SpawnBoss", required: true },
  //created at
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // check action type:
  // 0: fount alive
  // 1: found dead
  // 2: found nothing
  actionType: {
    type: Number,
    required: true,
  },
  // guild member name:
  memberName: {
    type: String,
    required: true,
  },
  // guild member id:
  memberId: {
    type: String,
    required: true,
  },
  // spawnBoss object id ref readableId
  spawnBossId: {
    type: Schema.Types.ObjectId,
    ref: "SpawnBoss",
    required: true,
  },
});
module.exports = mongoose.model("memberCheck", memberCheck, "memberCheck");

