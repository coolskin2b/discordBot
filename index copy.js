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
//SCHEMA :
const schemaBoss = require("./SchemaDb/boss");

// DATA :
const { OutlandsBossData } = require("./data/OutlandsBossData");
const { token, dbAccess } = require("./config.json");

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
    // console.log("  OutlandsBossData");
    // console.log(OutlandsBossData);

    // create table if not exist
    const bossList = await schemaBoss.find();
    if (bossList.length === 0) {
      console.log("Creating table");
      // console log to check if table is created
      const bossList = await schemaBoss.find();
      // console.log(bossList);

      // take array of object : bossDatas and register it in the table
      /*const BossSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    //boss Type  : 1 = normal, 0 = mini boss
    type:{
        type:Number,
        required:true
    },
    // location : Dongeon
    location:{
        type:String,
        required:true
    },
    // Temps de respawn mini : 12h
    respawnmax:{
        type:Number,
        required:true
    },
        // Temps de respawn mini : 24h
    respawnmini:{
        type:Number,
        required:true
    },
    // nombre de fois trouvé vivant
    nbvivant:{
        type:Number,
        required:false
    },
    // nombre de fois trouvé mort
    nbmort:{
        type:Number,
        required:false
    },
    image:{
        type:String,
        required:false
    }
});*/
      for (const boss of OutlandsBossData) {
        const newBoss = new schemaBoss({
          name: boss.name,
          type: boss.type,
          location: boss.location,
          respawnmax: boss.respawnmax,
          respawnmini: boss.respawnmini,
          nbvivant: 0,
          nbmort: 0,
          image: boss.image,
        });
        newBoss.save();
      }
    } else {
      // console.log("Table already exist");
      // console.log(bossList);
    }
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
    console.log(interaction.user);
    await interaction.reply({
      content: `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`,
      ephemeral: true,
    });
  } else if (commandName === "boss-update") {
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

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle("   Mise à jours du statut du boss : **GATE KEEPER **   ")
      .setDescription("   veuillez choisir une option     ");

    // send message with row of buttons
    await interaction.reply({
      content: "Pong!",
      ephemeral: true,
      embeds: [embed],
      components: [row1],
    });
  } else {
    await interaction.reply(`Un petit probleme de dev`);
  }
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isButton()) return;
    console.log(interaction);
  });
});

client.login(token);
