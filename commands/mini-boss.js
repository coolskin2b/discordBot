const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    MessageButton,
    MessageActionRow
} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mini-boss")
        .setDescription("Voir le statut de tous les mini-boss et mettre à jours le statut d'un mini-boss"),
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