const fs = require("fs")
const utility = require("../modules/utility")
const whitelist = require("../modules/whitelist")

module.exports = {
    data: {
        name: "whitelist",
        description: "Whitelist or unwhitelist a user from the bot.",
        options: [
            {
                name: "add",
                description: "Whitelist a user.",
                type: 1,
                options: [
                    {
                        name: "discordid",
                        description: "The discord id of the user to whitelist.",
                        type: 3,
                        required: false
                    },
                    {
                        name: "user",
                        description: "The user to whitelist.",
                        type: 6,
                        required: false
                    }
                ]
            },
            {
                name: "remove",
                description: "Unwhitelist a user.",
                type: 1,
                options: [
                    {
                        name: "discordid",
                        description: "The discord id of the user to unwhitelist.",
                        type: 3,
                        required: false
                    },
                    {
                        name: "user",
                        description: "The user to unwhitelist.",
                        type: 6,
                        required: false
                    }
                ]
            }
        ],
        integration_types: [1],
        contexts: [0, 1, 2]
    },
    
    /**
     * 
     * @param {discord.Interaction} interaction 
     */
    async execute(interaction) {
        let discordid = interaction.options.getString("discordid")
        const user = interaction.options.getUser("user")

        if (!discordid && !user) {
            return utility.reply(interaction, {content: "You must provide a discord id or user.", ephemeral: true})
        }

        discordid = discordid || user.id
        if (interaction.options.getSubcommand() === "add") {
            if (whitelist.includes(discordid)) {
                return utility.reply(interaction, {content: `<@${discordid}> is already whitelisted.`, ephemeral: true})
            }

            whitelist.push(discordid)
            fs.writeFileSync(`${__dirname}/../modules/whitelist.json`, JSON.stringify(whitelist, null, 4))

            return utility.reply(interaction, {content: `<@${discordid}> has been whitelisted.`, ephemeral: true})
        } else if (interaction.options.getSubcommand() === "remove") {
            if (!whitelist.includes(discordid)) {
                return utility.reply(interaction, {content: `<@${discordid}> is not whitelisted.`, ephemeral: true})
            }

            whitelist.splice(whitelist.indexOf(discordid), 1)
            fs.writeFileSync(`${__dirname}/../modules/whitelist.json`, JSON.stringify(whitelist, null, 4))
            return utility.reply(interaction, {content: `<@${discordid}> has been unwhitelisted.`, ephemeral: true})
        }
    }
}