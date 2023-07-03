const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vent")
        .setDescription("Need To Vent Anonymously?"),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId("ventModal")
            .setTitle("Vent")

        const ventMessage = new TextInputBuilder()
            .setCustomId("ventMessage")
            .setLabel("Let It Out And Feel Heard.")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const firstRow = new ActionRowBuilder()
            .addComponents(ventMessage);
            
        modal.addComponents(firstRow);

        await interaction.showModal(modal);
    }
}