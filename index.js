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

const {deleteOldMessage} = require("./scripts/utils");

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
    miniBoss(interaction)
  } else if (commandName === "main-boss") {
  } else {
    await interaction.reply(`Un petit probleme de dev`);
  }
});



client.on("interactionCreate", (interaction) => {


  if (!interaction.isButton()) return;
  const { message } = interaction;

  // IMPORTANT : SI CLICK SUR BOUTTON APRES MESSAGE DE COMMANDE : message.interaction existe :
  if (message.interaction) {
    if (message.interaction.commandName === "mini-boss") {

      deleteOldMessage(interaction)

      // console.log('------------------------------------');
      // console.log(interaction.channel.messages.fetch())
      // console.log('------------------------------------');
      const { customId: bossId } = interaction;
      var id_boss = mongoose.Types.ObjectId(bossId);
      const getBoss = async () => {
        const spawnBoss = await schemaSpawnBoss
          .findById(id_boss)
          .populate("boss");
        return spawnBoss;
      };

      // recuperer le dernier spawn du boss :
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
          // reply embed message :
          const embed = new MessageEmbed()
            .setTitle(`${spawnBoss.boss.name}`)
            .setDescription(`${spawnBoss.boss.description}`)
            .setColor("#0099ff")
            .setThumbnail(`${spawnBoss.boss.image}`)
            .addField("Last spawn", `${lastBoss.createdAt}`);
          const row = new MessageActionRow();

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
                .setCustomId("summoned")
                .setLabel("Summoned Boss")
                .setStyle(3)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId("natural")
                .setLabel("  Natural Boss")
                .setStyle(1)
            );
          } else {
            // si le boss est naturel on propose de l'envoyer :
            row.addComponents(
              new MessageButton()
                .setCustomId("naturalCheck")
                .setLabel("Verifier si naturel ou summoned?")
                .setStyle(3)
            );
            row.addComponents(
              new MessageButton()
                .setCustomId("spotted")
                .setLabel("   Il est vivant!   ")
                .setStyle(3)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId("dead")
                .setLabel("   Mort...Il est mort..   ")
                .setStyle(1)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId("nothing")
                .setLabel("   Y a rien...   ")
                .setStyle(2)
            );
            // add one more button
            row.addComponents(
              new MessageButton()
                .setCustomId("cancel")
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

  // IMPORTANT : CLICK SUR BUTTON SANS MESSAGE DE COMMANDE : message.interaction n'existe pas :
  if (typeof message.interaction != "undefined") {
    console.log("JE DEVRAIS ETRE LA");
    // console.log(message.interactions);
    // RESPONSE AU CLICK DE BUTTON SUR UN SPAWN DE BOSS :
  }




  }
});
client.login(token);
