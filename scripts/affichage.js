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
  const allSpawnBossType0 = allSpawnBoss.filter(
    (boss) => boss.boss.type === 0
  );
    console.log(allSpawnBossType0);

     // ADD BOSSES TO TABLE
  for (let i = 0; i < allSpawnBossType0.length; i++) {
    let name = allSpawnBossType0[i].boss.name;
    let control = allSpawnBossType0[i].guildSpawnControl ? "Oui" : "Non";
    let test = "test"
    let readableId = allSpawnBossType0[i].readableId;
    table += `
    |${name}|   ${control}   |  ${test} heure |  ${test} heure |  ${test} heure Laure |  ${test} heure  |  ${readableId} |
    `;
  }
  // ADD END TO TABLE
  table += `
  +-------------+---------+------------+-----------+-----------------------------+----------------------+--------+
  `;




      // // filter  allSpawnBoss  "boss" match type = 0
      // const spawnBossTypeMini = await spawnBoss.find({
      //   boss: {
      //     $elemMatch: {
      //       type: 0,
      //     },
      //   },
      // });

      // console.log('spawnBossTypeMini');
      // console.log(spawnBossTypeMini);



  // const test = spawnBossTypeMini
  //   .find()
  //   .populate({ path: "boss", match: { type: { $eq: 0 } } })
  //   .populate("boss", "name")
  //   .then(function (data) {
  //     console.log(data);
  //   });

  // // populate match where field type = 0
  // const spawnBossTypeMini = await spawnBoss
  //   .find({ boss: { type: 0 } })
  //   .populate("boss", "type")
  //   .populate("boss", "name");
  // console.log("spawn BOSS MINI", spawnBossTypeMini);

  //    // ADD BOSSES TO TABLE
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
