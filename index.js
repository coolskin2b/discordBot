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
const { token, dbAccess } = require("./config.json");
// SCRIPT INITIALIZATION :
const {
  initializeBossList,
  initializeSpawnBossList,
} = require("./scripts/Initialization");

// scripts :
//affichage :
const { miniBoss,mainBoss } = require("./scripts/affichage");



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
  } else if (commandName === "bosse-update") {
    miniBoss(interaction);
    console.log('JE SUIS UNE INTERACTION????')
  } else {
    await interaction.reply(`Un petit probleme de dev`);
  }

  // INTERACTION DES BOUTONS :
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isButton()) return;
    console.log(interaction);
    console.log('JE SUIS UNE INTERACTION????22222222222')
    miniBoss(interaction);
  });
});

client.login(token);
