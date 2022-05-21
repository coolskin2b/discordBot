const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    MessageButton,
    MessageActionRow
} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bosse-update")
        .setDescription("Mettre à jours le statut d'un boss"),
    async execute(interaction) {
        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId("start")
                .setLabel("   Start   ")
                .setStyle(3)
            )
        return interaction.reply({
            components: [row1]
        })
    }
}