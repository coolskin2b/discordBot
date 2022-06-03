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
  // ACTION : 1 - summoned
  // ACTION : 2 - NATURAL
  // ACTION : 3 - Need Check
  // ACTION : 4 - ALIVE
  // ACTION : 5 - DEAD
  // ACTION : 6 - NOTHING
  // ACTION : 7 - CANCEL
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
