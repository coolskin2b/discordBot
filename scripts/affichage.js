// DATA :
const {
  Client,
  Collection,
  Intents,
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require("discord.js");

const schemaBoss = require("../SchemaDb/boss");
const spawnBoss = require("../SchemaDb/spawnBoss");
const { OutlandsBossData } = require("../data/OutlandsBossData");
const { nanoid } = require("nanoid");

async function miniBoss(interaction) {
  // create row of buttons
  const row1 = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("spotted")
        .setLabel("   Il est vivant!   ")
        .setStyle(3)
    )
    // add one more button
    .addComponents(
      new MessageButton()
        .setCustomId("dead")
        .setLabel("   Mort...Il est mort..   ")
        .setStyle(1)
    )
    // add one more button
    .addComponents(
      new MessageButton()
        .setCustomId("nothing")
        .setLabel("   Y a rien...   ")
        .setStyle(2)
    )
    // add one more button
    .addComponents(
      new MessageButton()
        .setCustomId("cancel")
        .setLabel("   Annuler   ")
        .setStyle(4)
    );

  let table = `
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   | Nom du Boss | Control | Spawn Mini | Spawn Max |         Last Checked        |        Statut        |   id   |
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   `;
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("   Mise à jours du statut du boss : **GATE KEEPER **   ")
    .setDescription("```" + table + "```");

  /* TABLE
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   | Nom du Boss | Control | Spawn Mini | Spawn Max |         Last Checked        |        Statut        |   id   |
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   |     XXX     |   non   |      -     |     -     |  Vincent- il y a 30 minutes |           -          |  asqsq |
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   |     CCC     |   oui   |  + 0 heure | + 8 heure | Bernard - il y a 30 linutes | en  cours de respawn | qsdqsd |
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   |     BBB     |         |            |           |                             |                      |        |
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   |     AAA     |         |            |           |                             |                      |        |
   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
   */
  // ADD TABLE TO STRING  let table:

  // // ADD BOSSES TO TABLE
  // for (let i = 0; i < bossList.length; i++) {
  //   table += `
  //   |     ${bossList[i].name}     |   ${bossList[i].control}   |  ${bossList[i].spawnMin} heure |  ${bossList[i].spawnMax} heure |  ${bossList[i].lastChecked} |  ${bossList[i].status} |  ${bossList[i].id} |
  //   +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
  //   `;
  // }
  // // ADD END TO TABLE
  // table += `
  // +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
  // `;

  // send message with row of buttons
  await interaction.reply({
    content: "```" + table + "```",
    ephemeral: true,
    // embeds: [embed],
    components: [row1],
  });
}

async function mainBoss() {}

module.exports = { miniBoss, mainBoss };
