//DATA BASE MANAGEMENT
const mongoose = require("mongoose");
const schemaBoss = require("../SchemaDb/boss");
const schemaSpawnBoss = require("../SchemaDb/spawnBoss");
const { token, dbAccess } = require("../config.json");

// function to get the last spawn of a boss based on the boss _id
async function getLastSpawn(bossId) {
  const id = mongoose.Types.ObjectId(bossId);
  const spawnBoss = await schemaSpawnBoss.findById(id).populate("boss");
  console.log(spawnBoss);
  return spawnBoss;
}

// function to get the last spawn of a boss based on the boss _id  sort({ createdAt: -1 }
async function getLastSpawnSort(bossId) {
  const id = mongoose.Types.ObjectId(bossId);
  const spawnBoss = await schemaSpawnBoss
    .findById(id)
    .populate("boss")
    .sort({ createdAt: -1 })
    .limit(1);
  console.log(spawnBoss);
  return spawnBoss;
}
module.exports = { getLastSpawn, getLastSpawnSort };
