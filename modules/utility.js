const { EmbedBuilder } = require("discord.js")

function SERVER(authorText, authorUrl, authorIconUrl, description) {
    return new EmbedBuilder()
        .setAuthor({ name: authorText, iconURL: authorIconUrl, url: authorUrl })
        .setDescription(description)
        .setColor(0x006fd5)
}

async function reply(interaction, args) {
    if (interaction.deferred || interaction.replied) {
        return await interaction.editReply(args)
    }
    return await interaction.reply(args)
}

module.exports = {
    SERVER,
    reply
}