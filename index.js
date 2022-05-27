const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Intents,
  MessageButton,
  MessageActionRow,
  MessageEmbed,
} = require("discord.js");
//DATA BASE MANAGEMENT
const mongoose = require("mongoose");
const schemaBoss = require("./SchemaDb/boss");
const schemaSpawnBoss = require("./SchemaDb/spawnBoss");
const { token, dbAccess } = require("./config.json");
// SCRIPT INITIALIZATION :
const {
  initializeBossList,
  initializeSpawnBossList,
} = require("./scripts/Initialization");

// scripts :
//affichage :
const { miniBoss, mainBoss } = require("./scripts/affichage");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("ready", async () => {
  await mongoose.connect(dbAccess, {
    keepAlive: true,
  });
  console.log("Connected to MongoDB");
  setTimeout(async () => {
    initializeBossList();
    initializeSpawnBossList();
  }, 5000);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  console.log("COMMAND INTERACTION" + interaction);

  const { commandName } = interaction;
  console.log(`Command ${commandName} triggered`);
  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user-info") {
    console.log(interaction.user);
    await interaction.reply({
      content: `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
      ephemeral: true,
    });
  } else if (commandName === "mini-boss") {
    miniBoss(interaction);
  } else if (commandName === "main-boss") {
    // miniBoss(interaction);
    console.log(mainb);
  } else {
    await interaction.reply(`Un petit probleme de dev`);
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;
  // console.log("BOUTON INTERACTION" + interaction);
  // console.log(interaction);
  // desctructuring interaction.message as message from interaction.message
  const { interaction: interactionButton } = interaction.message;
  if (interactionButton.commandName === "mini-boss") {
    const { customId: bossId } = interaction;
    var id_boss = mongoose.Types.ObjectId(bossId);

    console.log(id_boss);
    // function to get all boss from database
    const getBoss = async () => {
      // spawnBoss.findById(id) populate(boss)
      const spawnBoss = await schemaSpawnBoss
        .findById(id_boss)
        .populate("boss");
      console.log(spawnBoss);
      return spawnBoss;
    };

    // const checkLastBoss = async () => {
    //   const lastBoss = await schemaSpawnBoss.findOne({
    //     boss: spawnBoss.boss,
    //     createdAt: { $gte: spawnBoss.createdAt },
    //   });

    //   if (lastBoss) {
    //     console.log(lastBoss);
    //     return lastBoss;
    //   } else {
    //     return false;
    //   }
    // };
    const checkLastBoss = async (spawnBoss) => {
      const lastBoss = await schemaSpawnBoss
        .findOne({
          boss: spawnBoss.boss,
        })
        .sort({ createdAt: -1 })
        .limit(1);
      // on renvoit le last spawn
      return lastBoss;
    };
    // var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
    getBoss().then((spawnBoss) => {
      // check if spawnBoss is the last createdAt with the same boss
      checkLastBoss(spawnBoss).then((lastBoss) => {
        lastBoss.populate("boss").then((lastBoss) => {
          console.log(lastBoss);
          interaction.reply(
// boss name and createdAt
            `${lastBoss.boss.name} créé le ${lastBoss.createdAt.toLocaleString()}`
          );
        });
      });
    });

    // // function to get the boss from the database
    //     const getBoss = async (id) => {
    //       const boss = await schemaBoss.findById();
    //       return boss;
    //     };
    //     getBoss(bossId).then((boss) => {
    //       console.log(boss);
    //       interaction.reply(
    //         `${boss.name} est un mini boss de type ${boss.type}`
    //       );
    //     });

    // find boss by id
    //     schemaBoss.findById(id, (err, boss) => {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         // console.log(boss);
    //         // console.log(boss.name);
    //       }

    //     console.log('bossId : ' + bossId);
    //     const getBoss = async () => {
    //       try {
    //         return await schemaBoss.findById(bossId).exec();
    //       } catch (error) {
    //         console.error(error)
    //       }
    //     }
    //  getBoss().then(async (boss) => {
    //    console.log(boss);
    //       if (boss) {
    //         const { name, type, location, respawnmax, respawnmini, nbvivant, nbmort, image } = boss;
    //         const bossEmbed = new MessageEmbed()
    //           .setTitle(name)
    //           .setColor("#0099ff")
    //           .setThumbnail(image)
    //           .addField("Type", type, true)
    //           .addField("Location", location, true)
    //           .addField("Respawn", `${respawnmini} - ${respawnmax}`, true)
    //           .addField("Nb vivant", nbvivant, true)
    //           .addField("Nb mort", nbmort, true);
    //         await interaction.reply(bossEmbed);
    //       } else {
    //         await interaction.reply("Boss introuvable");
    //       }
    //     });

    //find the boss in the database with the string bossId for _id
    // const boss = await schemaBoss.findById(bossId).exec();
    // console.log("----------------boss---------------------------------");
    // console.log(boss);
    // console.log("----------------boss---------------------------------");

    const { user } = interaction;
    // console.log("------------------ USER ------------------");
    // console.log(user);
    // console.log("------------------ USER ------------------");
    // console.log("------------------ interactionButton ------------------");
    // console.log(interactionButton);
    // console.log("------------------ interactionButton ------------------");
  }
});

client.login(token);
