//DATA BASE MANAGEMENT
const mongoose = require("mongoose");
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

  // check spwanboss
  const spawnBossData = await spawnBoss.find({});
  // check boss
  // console.log(spawnBossData);

  // // for each spawnboss
  // for (let i = 0; i < spawnBossData.length; i++) {
  //   //boss id = const SpawnBoss = new Schema({
  //   // boss: { type: Schema.Types.ObjectId, ref: "Boss", required: true },

  //   const bossData = await schemaBoss.find({
  //     _id: spawnBossData[i].boss,
  //   });

  //   // if boss
  // }
  // populate "boss" where field type = 0
  const allSpawnBoss = await spawnBoss.find({}).populate("boss");
  // // filter  allSpawnBoss  "boss" match type = 0
  const allSpawnBossType0 = allSpawnBoss.filter((boss) => boss.boss.type === 0);

  // ADD BOSSES TO TABLE
  for (let i = 0; i < allSpawnBossType0.length; i++) {
    let name = allSpawnBossType0[i].boss.name;
    let control = allSpawnBossType0[i].guildSpawnControl ? "Oui" : "Non";
    let test = "test";
    let readableId = allSpawnBossType0[i].readableId;
    table += `
    |${name}|   ${control}   |  ${test} heure |  ${test} heure |  ${test} heure Laure |  ${test} heure  |  ${readableId} |
    `;
  }

  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle("   Mise à jours du statut du boss : **GATE KEEPER **   ");
  // .setDescription(table));

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

  // Create button :

  console.log("ROW BUTOOON");
  console.log("-------------------------------------------------------");
  console.log(row1);
  console.log("-------------------------------------------------------");

  console.log("CREATE LISTE BOSSS");
  console.log("-------------------------------------------------------");
  // console.log(create_buttons(allSpawnBossType0));
  console.log("-------------------------------------------------------");

  // send message with row of buttons
  await interaction.reply({
    content: "```" + table + "```",
    ephemeral: true,
    // embeds: [exampleEmbed],
    components: create_buttons_boss(allSpawnBossType0),
  });
}

async function mainBoss() {}

function create_buttons_boss(listeBoss) {
  const row1 = new MessageActionRow();
  const button_row1 = [];
  const row2 = new MessageActionRow();
  const button_row2 = [];
  const row3 = new MessageActionRow();
  const button_row3 = [];

  // for each boss every 5 button switch button row
  for (let i = 0; i < listeBoss.length; i++) {
    if (i < 5) {
      button_row1.push(
        new MessageButton()
          .setCustomId(listeBoss[i]._id.toString())
          .setLabel(listeBoss[i].boss.name)
          .setStyle(3)
      );
    }
    if (i >= 5 && i < 10) {
      button_row2.push(
        new MessageButton()
          .setCustomId(listeBoss[i]._id.toString())
          .setLabel(listeBoss[i].boss.name)
          .setStyle(3)
      );
    }
    if (i >= 10 && i < 15) {
      button_row3.push(
        new MessageButton()
          .setCustomId(listeBoss[i]._id.toString())
          .setLabel(listeBoss[i].boss.name)
          .setStyle(3)
      );
    }
  }

  const listButtonsRowAffichage = [];
  if (button_row1.length > 0) {
    row1.addComponents(...button_row1);
    listButtonsRowAffichage.push(row1);
  }
  if (button_row2.length > 0) {
    row2.addComponents(...button_row2);
    listButtonsRowAffichage.push(row2);
  }
  if (button_row3.length > 0) {
    row3.addComponents(...button_row3);
    listButtonsRowAffichage.push(row3);
  }
  return listButtonsRowAffichage;
}

module.exports = { miniBoss, mainBoss };

// affichage cool : EMBEDED

//  const exampleEmbed = new MessageEmbed()
// .setColor('#0099ff')
// .setTitle('Some title')
// .setURL('https://discord.js.org/')
// .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
// .setDescription('Some description here')
// .setThumbnail('https://i.imgur.com/AfFp7pu.png')
// .addFields(
// 	{ name: 'Regular field title', value: 'Some value here' },
// 	{ name: '\u200B', value: '\u200B' },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
//   { name: 'Regular field title', value: 'Some value here' },
// 	{ name: '\u200B', value: '\u200B' },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// )
// .addFields(
// 	{ name: 'Regular field title', value: 'Some value here' },
// 	{ name: '\u200B', value: '\u200B' },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// )
// .addFields(
// 	{ name: 'Regular field title', value: 'Some value here' },
// 	{ name: '\u200B', value: '\u200B' },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	{ name: 'Inline field title', value: 'Some value here', inline: true },
// )
// .addField('Inline field title', 'Some value here', true)
// .setImage('https://i.imgur.com/AfFp7pu.png')
// .setTimestamp()
// .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
