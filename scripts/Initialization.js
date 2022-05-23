// DATA :
const schemaBoss = require("../SchemaDb/boss");
const spawnBoss = require("../SchemaDb/spawnBoss");
const { OutlandsBossData } = require("../data/OutlandsBossData");
const { nanoid } = require("nanoid");

// function to itinialize boss list in mongodb
async function initializeBossList() {
  const bossList = await schemaBoss.find();
  if (bossList.length === 0) {
    console.log("Creating table");
    // console log to check if table is created
    const bossList = await schemaBoss.find();
    // take array of object : bossDatas and register it in the table
    for (const boss of OutlandsBossData) {
      const newBoss = new schemaBoss({
        name: boss.name,
        type: boss.type,
        location: boss.location,
        respawnmax: boss.respawnmax,
        respawnmini: boss.respawnmini,
        nbvivant: 0,
        nbmort: 0,
        image: boss.image,
      });
      newBoss.save();
    }
    // inform creation ok
    console.log("Table created");
  } else {
    console.log("Table already exist");
  }
}

// function to initialize spawnBoss list in mongodb empty at start
async function initializeSpawnBossList() {
  const spawnBossList = await spawnBoss.find();
  if (spawnBossList.length === 0) {
    const bossList = await schemaBoss.find();
    for (const boss of bossList) {
      const newSpawnBoss = new spawnBoss({
        boss: boss._id,
        readableId: nanoid(10),
        guildSpawnControl: false, // on connait pas le spawn
      });
      newSpawnBoss.save();
    }
    console.log("Table created");
  } else {
    console.log("Table already exist");
  }
}

module.exports = { initializeBossList, initializeSpawnBossList };
