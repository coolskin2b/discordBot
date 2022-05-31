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
const mongoose = require("mongoose");

async function deleteOldMessage(interaction) {
  const channel = interaction.channel;
  const fetchedMsg = await channel.messages.fetch({
    around: interaction.message.id,
    limit: 1,
  });
  await fetchedMsg.delete();
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

module.exports = { deleteOldMessage, buttonActionObjCreator };
