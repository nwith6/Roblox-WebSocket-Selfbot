const discord = require("discord.js")

module.exports = {
    data: {
        name: "ping",
        description: "Pong!",
        integration_types: [1],
        contexts: [0, 1, 2],
    },

    /**
     * 
     * @param {discord.Interaction} interaction 
     */
    async execute(interaction) {
        await interaction.reply({ content: "Pong!", ephemeral: true })
    }
}