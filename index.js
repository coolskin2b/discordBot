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

//TODO : Node Cron pour le cron de mise à jours :

// scripts :
//affichage :
const { miniBoss, mainBoss } = require("./scripts/affichage");

const {
  deleteOldMessage,
  buttonActionObjCreator,
} = require("./scripts/utils");



const {getLastSpawn, getLastSpawnSort, updateSpawn, getSpawnBoss, checkLastSpawnBoss} = require("./scripts/spawn");

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
  const { commandName } = interaction;
  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply(
      `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
    );
  } else if (commandName === "user-info") {
    await interaction.reply({
      content: `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
      ephemeral: true,
    });
  } else if (commandName === "mini-boss") {
    miniBoss(interaction);
  } else if (commandName === "main-boss") {
  } else {
    await interaction.reply(`Un petit probleme de dev`);
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;
  // console.log('JE SUIS UN BOUTON CLICKER');
  // console.log(interaction)
  // console.log('JE SUIS UN BOUTON CLICKER');
  const { message } = interaction;

  // IMPORTANT : SI CLICK SUR BOUTTON APRES MESSAGE DE COMMANDE : message.interaction existe :
  if (message.interaction) {
    if (message.interaction.commandName === "mini-boss") {
      deleteOldMessage(interaction);

      const { customId: bossId } = interaction;
      var id_spawn_boss = mongoose.Types.ObjectId(bossId);

      // var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
      getSpawnBoss(id_spawn_boss).then((spawnBoss) => {
        // check if spawnBoss is the last createdAt with the same boss
        checkLastSpawnBoss(spawnBoss).then((lastBoss) => {
          // reply embed message :
          const embed = new MessageEmbed()
            .setTitle(`${spawnBoss.boss.name}`)
            .setDescription(`${spawnBoss.boss.description}`)
            .setColor("#0099ff")
            .setThumbnail(`${spawnBoss.boss.image}`)
            .addField("Last spawn", `${lastBoss.createdAt}`);
          const row = new MessageActionRow();
          // SPAWN UPDATE BUTTON :
          // CUSTOM ID : bossId-ACTION-
          // ACTION : 1 - summoned
          // ACTION : 2 - NATURAL
          // ACTION : 3 - Need Check
          // ACTION : 4 - ALIVE
          // ACTION : 5 - DEAD
          // ACTION : 6 - NOTHING
          // ACTION : 7 - CANCEL
          // console.log("------------ spawnBoss -----------");
          // console.log(spawnBoss);
          // console.log("------------ spawnBoss -----------");
          // si il y a naturalCheck à true on doit proposer des boutons : boss naturel ou boss summoned
          if (spawnBoss.boss.naturalCheck) {
            // need to add button : summoned boss , natural boss
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-1`)
                .setLabel("Boss summoned?")
                .setStyle(3)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-2`)
                .setLabel("Boss naturel?")
                .setStyle(1)
            );
          } else {
            // si le boss est naturel on propose de l'envoyer :
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-3`)
                .setLabel("Verifier si naturel ou summoned?")
                .setStyle(3)
            );
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-4`)
                .setLabel("   Il est vivant!   ")
                .setStyle(3)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-5`)
                .setLabel("   Mort...Il est mort..   ")
                .setStyle(1)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-6`)
                .setLabel("   Y a rien...   ")
                .setStyle(2)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId(`SPU-${spawnBoss._id}-7`)
                .setLabel("   Annuler   ")
                .setStyle(4)
            );
          }
          interaction.reply({ embeds: [embed], components: [row] });
          // interaction.reply(`${spawnBoss.boss.name}`);
        });
      });

      const { user } = interaction;
    }
  }
  // // IMPORTANT : CLICK SUR BUTTON SANS MESSAGE DE COMMANDE : message.interaction n'existe pas :
  // if (typeof message.interaction != "undefined " && message.interaction == null) {
  //   console.log("JE DEVRAIS ETRE LA");
  //   console.log(message.interactions);
  //   // RESPONSE AU CLICK DE BUTTON SUR UN SPAWN DE BOSS :
  // }

  // check if object properties exist  message.interactions and note undefined

  if (
    typeof interaction.message != "undefined" &&
    interaction.message != null
  ) {
    // console.log('---------------interaction.message---------------');
    // console.log(interaction.message)
    // console.log('---------------interaction.message---------------');

    // console.log('---------------interaction---------------');
    // console.log(interaction)
    // console.log('---------------interaction---------------');
    // // interation reply "message bien enregistrer"

    // console.log('---------------interaction USER---------------');
    // console.log(interaction.user)
    // console.log('---------------interaction USER---------------');

    // console.log('--------------- CUSTOM ID--------------');
    // console.log(interaction.customId)
    // console.log('---------------CUSTOM ID---------------');

    // console.log("---------------tabButton---------------");
    // console.log(tabButton);
    // console.log("---------------tabButton---------------");

    // const array = interaction.customId.split('-');
    // console.log('---------------array---------------');
    // console.log(array)
    // console.log('---------------array---------------');
    // console.log('--------------- component TYPE--------------');
    console.log(interaction.componentType);
    // console.log('---------------component TYPE--------------');
    // const object = {
    //   buttonAction: array[0],
    //   bossId: mongoose.Types.ObjectId(array[01]),
    //   action: array[2],
    // };

    const tabButton = buttonActionObjCreator(interaction.customId);
    // SPAWN UPDATE BUTTON :
    // CUSTOM ID : bossId-ACTION-
    // ACTION : 1 - summoned
    // ACTION : 2 - NATURAL
    // ACTION : 3 - Need Check
    // ACTION : 4 - ALIVE
    // ACTION : 5 - DEAD
    // ACTION : 6 - NOTHING
    // ACTION : 7 - CANCEL
    const { buttonAction, bossId, action } = tabButton;
    // interaction.reply("message bien enregistrer");
    if (interaction.componentType === "BUTTON" && buttonAction === "SPU") {
      deleteOldMessage(interaction);

      // TODO : 1 recuperer le spawnboss avec le bossId
      getSpawnBoss(bossId).then((spawnBoss) => {
        // console.log('---------------spawnBoss---------------');
        // console.log(spawnBoss)
        // console.log('---------------spawnBoss---------------');

        // console.log('button action : '  +buttonAction + ' boss id : '+ bossId + ' action : ' + action);
        resultat = updateSpawn(spawnBoss, interaction, action);
        interaction.reply(`hello ${interaction.user.username} ${resultat}`);

      });
    }
  }
});
client.login(token);
