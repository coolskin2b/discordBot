const mongoose = require("mongoose");
const schemaBoss = require("../SchemaDb/boss");
const schemaSpawnBoss = require("../SchemaDb/spawnBoss");
const { token, dbAccess } = require("../config.json");
// DATA :
const {
  Client,
  Collection,
  Intents,
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require("discord.js");

async function deleteOldMessage(interaction) {

  //Todo : EPhEmERAl cAn T Be Deleted
  // await interaction.message.delete();
  const channel = interaction.channel;
  // console.log(interaction);
  // console.log(channel)
  // console.log(interaction.message.id);

  // // const fetchedMsg = await channel.messages.fetch({
  // //   around: interaction.message.id,
  // //   limit: 1,
  // // });
  channel.messages.fetch(interaction.message.id)
  .then(fetchedMsg => fetchedMsg.delete())
  .catch(console.error);
  // await fetchedMsg.delete();
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
// function create an object with data and properties data based on string with separator "-":
function buttonActionObjCreator(string) {
  const array = string.split("-");
  const object = {
    buttonAction: array[0],
    bossId: mongoose.Types.ObjectId(array[01]),
    action: array[2],
  };
  return object;
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

module.exports = { checkLastSpawnBoss,deleteOldMessage, buttonActionObjCreator, getSpawnBoss };
