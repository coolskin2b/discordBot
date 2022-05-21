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
const mongoose = require("mongoose");
const testing = require("./test-schema");
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
  await new testing({
    message: "test",
    }).save();
  console.log("Saved to MongoDB");
  }
  , 5000);
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
