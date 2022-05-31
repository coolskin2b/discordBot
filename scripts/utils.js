
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
    // const channel = interaction.channel.messages.fetch();
    // console.log(channel);
    const fetchedMsg = await interaction.channel.messages.fetch({ around: interaction.message.id, limit: 1 });
    await fetchedMsg.delete();
}

module.exports = { deleteOldMessage };
