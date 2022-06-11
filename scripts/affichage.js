//DATA BASE MANAGEMENT
const mongoose = require("mongoose");
const Boss = require("../SchemaDb/boss");
const SpawnBoss = require("../SchemaDb/spawnBoss");
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

const {
  localisation,
  translate,
  addSpace,
  addLine,
} = require("./localisation");

const { OutlandsBossData } = require("../data/OutlandsBossData");
const { nanoid } = require("nanoid");

const { addHoursToDate } = require("./utils");

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
   +${addLine(26)}+${addLine(10)}+${addLine(10)}+${addLine(
    10
  )}+----------------------+--------+
   |${addSpace(translate("nomduboss"), 26)}|${addSpace(
    translate("controle"),
    10
  )}|${addSpace(
    translate("tMini"),
    8
  )}|${addSpace(
    translate("tMax"),
    7
  )}|${translate("derniereVerif")}|${translate("statut")}|${translate("id")}|
   +${addLine(26)}+${addLine(10)}+${addLine(10)}+${addLine(
    10
  )}+----------------------+--------+
   `;

  // check spwanboss
  const spawnBossData = await SpawnBoss.find({});

  const BossData = await Boss.find({});

  // [
  //   {
  //     '$match': {
  //       'type': 0
  //     }
  //   }, {
  //     '$lookup': {
  //       'from': 'SpawnBoss',
  //       'localField': '_id',
  //       'foreignField': 'boss',
  //       'as': 'spawn'
  //     }
  //   }, {}
  // ]

  // Aggregate BossData
  const aggregation = [
    {
      $match: {
        type: 0,
      },
    },
    {
      $lookup: {
        from: "SpawnBoss",
        localField: "_id",
        foreignField: "boss",
        as: "spawn",
      },
    },
    {
      $unwind: {
        path: "$spawn",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        name: {
          $first: "$name",
        },
        respawnmini: {
          $first: "$respawnmini",
        },
        respawnmax: {
          $first: "$respawnmax",
        },
        location: {
          $first: "$location",
        },
        spawn: {
          $push: "$spawn",
        },
      },
    },
  ];

  const BossDataAaggregate = await Boss.aggregate(aggregation);

  // How to sort an object array by date property?
  const BossDataAaggregatePipe = BossDataAaggregate.map((boss) => {
    // boss.spawn == array of spawnBoss, sort by createdAt and limit to 1
    const spawn = boss.spawn
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 1);

    return {
      ...boss,
      spawn: spawn[0],
    };
  });

  console.log("-------BossDataAaggregatePipe-------");
  console.log(BossDataAaggregatePipe);
  console.log("-------BossDataAaggregatePipe-------");

  // ADD BOSSES TO TABLE
  for (let i = 0; i < BossDataAaggregate.length; i++) {
    let name = BossDataAaggregate[i].name;

    // get the first object in array BossDataAaggregate[i].spawn
    let spawnArray = BossDataAaggregate[i].spawn[0];

    const {
      lastChecked,
      updatedAt,
      foundDeadAt,
      foundAliveAt,
      readableId,
      guildSpawnControl,
      missedSpawnAt,
      naturalCheck,
      createdAt,
    } = spawnArray;

    let control = guildSpawnControl ? "oui" : "non";
    const test = "test";
    let Tmin = "";
    let Tmax = "";
    if (guildSpawnControl) {
      Tmin = addHoursToDate(createdAt, BossDataAaggregate[i].respawnmini);
      Tmax = addHoursToDate(createdAt, BossDataAaggregate[i].respawnmax);
    } else {
      Tmin = "N/A";
      Tmax = "N/A";
    }

    table += `
    ${addSpace(name, 26)}|${addSpace(translate(control), 10)}|${addSpace(
      Tmin,
      8
    )}|${addSpace(Tmax, 7)}|${test} heure Laure|${test}heure|${readableId}|
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

  const allSpawnBoss = await SpawnBoss.find({}).populate("boss");
  allSpawnBoss.filter((boss) => boss.boss.type === 0);
  // send message with row of buttons
  await interaction.reply({
    content: "```" + table + "```",
    ephemeral: true,
    // embeds: [exampleEmbed],
    components: create_buttons_boss(allSpawnBoss),
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
