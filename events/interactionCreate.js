const discord = require("discord.js")
const config = require("../config.json")
const utility = require("../modules/utility")
const whitelist = require("../modules/whitelist")

module.exports = {
    
    /**
     * 
     * @param {discord.Client} client 
     * @param {discord.Interaction} interaction
     */
    async execute(client, [interaction]) {
        if (interaction.isCommand) {
            if ((!whitelist.includes(interaction.user.id) && !config.admins.includes(interaction.user.id)) || (config.elevatedCommands.includes(interaction.commandName) && !config.admins.includes(interaction.user.id))) {
                return utility.reply(interaction, {content: "You are not authorized to use this command.", ephemeral: true})
            }

            const command = client.commands.get(interaction.commandName)
            if (!command) return
    
            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(error)
                // return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
                return utility.reply(interaction, {content: 'There was an error while executing this command!', ephemeral: true})
            }
        } // else if (interaction.isButton) {} ...etc
    }
}