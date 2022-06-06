//DATA BASE MANAGEMENT
const mongoose = require("mongoose");
const schemaBoss = require("../SchemaDb/boss");
const schemaSpawnBoss = require("../SchemaDb/spawnBoss");
const { token, dbAccess } = require("../config.json");
const { getHoursMinutes } = require("../scripts/utils");
const { nanoid } = require("nanoid");
// function to get the last spawn of a boss based on the boss _id
async function getLastSpawn(bossId) {
  const id = mongoose.Types.ObjectId(bossId);
  const spawnBoss = await schemaSpawnBoss.findById(id).populate("boss");
  console.log(spawnBoss);
  return spawnBoss;
}

// trouver le spwanboss avec le bossId
async function getSpawnBoss(id_spawn_boss) {
  const spawnBoss = await schemaSpawnBoss
    .findById(id_spawn_boss)
    .populate("boss");
  return spawnBoss;
}

// trouver le plus recent spawnboss avec le spawnBoss
// recuperer le dernier spawn du boss :
async function checkLastSpawnBoss(spawnBoss) {
  const lastBoss = await schemaSpawnBoss
    .findOne({
      boss: spawnBoss.boss,
    })
    .sort({ createdAt: -1 })
    .limit(1);
  // on renvoit le last spawn
  return lastBoss;
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

// SPAWN UPDATE BUTTON :
// CUSTOM ID : bossId-ACTION-
// ACTION : 1 - summoned
// ACTION : 2 - NATURAL
// ACTION : 3 - Need Check
// ACTION : 4 - ALIVE
// ACTION : 5 - DEAD
// ACTION : 6 - NOTHING
// ACTION : 7 - CANCEL
// function to update the spawnboss based on the boss _id and action
async function updateSpawn(spawnBoss, interaction, action) {
  console.log(spawnBoss);
  console.log(action);
  console.log(interaction);

  // modify the spawnboss
  switch (action) {
    case "1":
      // summoned
      spawnBoss.summoned = true;
      spawnBoss.summonedAt = new Date();
      spawnBoss.save();
      break;
    case "2":
      // natural
      spawnBoss.natural = true;
      spawnBoss.naturalAt = new Date();
      spawnBoss.save();
      break;
    case "3":
      // Need Check
      spawnBoss.needCheck = true;
      spawnBoss.needCheckAt = new Date();
      spawnBoss.save();
      break;
    case "4":
      // ALIVE
      spawnBoss.updatedAt = new Date();
      spawnBoss.foundAliveAt = new Date();
      spawnBoss.save();
      break;
    case "5":
      // DEAD
      spawnBoss.updatedAt = new Date();
      spawnBoss.foundDeadAt = new Date();
      spawnBoss.guildSpawnControl = true;
      spawnBoss.save();
      // on cree un nouveau spawnBoss
      console.log("-------------- SpawnBoss MODIFIED --------------");
      console.log("SpawnBoss MODIFIED");
      console.log(spawnBoss);
      console.log("SpawnBoss MODIFIED");
      console.log("-------------- SpawnBoss MODIFIED --------------");
      // temps de respawn : date now + boss respawnmini (hours)
      const respawnMini = spawnBoss.boss.respawnMini; // hours



    // ADD DATE DOC A LIRE :
    //  https://www.mongodb.com/docs/manual/reference/operator/aggregation/dateAdd/


      const newSpawnBoss = new schemaSpawnBoss({
        boss: spawnBoss.boss,
        guildSpawnControl: true,
        tempsRestant: respawnMiniDate,
        readableId: nanoid(10),
      });
      // save the new spawnBoss
      newSpawnBoss.save();
      console.log(
        "newSpawnBoss créé" +
          newSpawnBoss +
          "prochain spawn : " +
          respawnMiniDate
      );
      return `Enregistrement mini boss mort, prochain spawn  dans ${getHoursMinutes(
        respawnMiniDate
      )}`; // on renvoit le message
    case "6":
      // NOTHING
      spawnBoss.updatedAt = new Date();
      spawnBoss.save();
      break;
    case "7":
      // CANCEL
      spawnBoss.cancel = true;
      spawnBoss.cancelAt = new Date();
      spawnBoss.save();
      break;
    default:
      break;
  }

  // retourn un message à l'utilisateur pour lui dire qu'il a bien été modifié

  // VIVANT :
  // sur ce spawn on indique que le boss est vivant
  // on informe la guilde qu'il est vivant sur le channel dedier

  // DEAD : on trouve le corps.
  // on met à jours le spawn avec la date de mort
  // on genere un nouveau spawn de boss avec les timers de spawn et le boss
  // missedSpawnAt : si on a pas le control du spawn  <--- ca va etre à oublier je pense :p

  // NOTHING : on rien.

  // fin :
  // on enregistre la mise à jours du spawn  met à jours le spawn avec updatedAT
  // on sauvegarde la maj du spawn par l'utilisateur dans memberCheck
  // on informe la guildede la maj de l'utilisateur
}

module.exports = {
  getLastSpawn,
  getLastSpawnSort,
  updateSpawn,
  getSpawnBoss,
  checkLastSpawnBoss,
};
