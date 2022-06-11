const mongoose = require("mongoose");
const schemaBoss = require("../SchemaDb/boss");
const schemaSpawnBoss = require("../SchemaDb/spawnBoss");
const { token, dbAccess } = require("../config.json");
const { nanoid } = require("nanoid");
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
  // console.log(channel);

  const fetchedMsg = await channel.messages.fetch({
    around: interaction.message.id,
    limit: 1,
  });
  // channel.messages
  //   .fetch(interaction.message.id)
  //   .then((fetchedMsg) => fetchedMsg.delete())
  //   .catch(console.error);
  await fetchedMsg.delete();
}

// function to get hours and minutes from a Date mongoose object:
function getHoursMinutes(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const stringTime = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }`;
  return stringTime;
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

// function to add hours to a date and retourn object with hours and minutes:
function addHoursToDate(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  const time = getHoursMinutes(newDate);

  return time;
}

module.exports = {
  deleteOldMessage,
  buttonActionObjCreator,
  addHoursToDate,
};
