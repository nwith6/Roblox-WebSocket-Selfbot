const discord = require("discord.js")
const utility = require("../modules/utility")
const { Scraper } = require("../modules/scraper")

module.exports = {
    data: {
        name: "getservers",
        description: "Get server data for the given game.",
        options: [
            {
                name: "url",
                description: "The url for the game.",
                type: 3,
                required: true
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
        const url = interaction.options.getString("url")
        if (!url.includes("/") || !url.split("/")[4] || !url.includes("https://www.roblox.com/games/") || !/^\d+$/.test(url.split("/")[4])) {
            // return await interaction.reply({content: "The provided url is invalid. Ensure it is formatted as 'https://www.roblox.com/games/placeId/placeName'", ephemeral: true })
            return await utility.reply(interaction, {content: "The provided url is invalid. Ensure it is formatted as 'https://www.roblox.com/games/placeId/placeName'", ephemeral: true })
        }

        const scraper = new Scraper(url.split("/")[4])
        const servers = await scraper.fetchServers()

        if (servers.error) {
            // return await interaction.reply({content: servers.error, ephemeral: true})
            return await utility.reply(interaction, {content: servers.error, ephemeral: true})
        }

        const embed = utility.SERVER(servers.name, servers.url, servers.gameIconUrl, "```ini\n[ Fetching server data ]```")
        // await interaction.reply({embeds: [embed]})
        await utility.reply(interaction, {embeds: [embed]})

        let description = ""
        for (let i=0; i < servers.data.length; i++) {
            let server = servers.data[i]
            let socketData = await scraper.fetchServerSocket(server.gameId)
            let serverNumber = new String((i + 1)).padStart(2, "0")
            let ping = `${server.ping}ms`
            let serverString;

            if (socketData.error) {
                serverString = `; Server ${serverNumber} | (${(server.playing).toString().padStart(2, "0")}/${(servers.maxPlayers).toString().padStart(2, "0")}) | ${socketData.error.padEnd(20, " ")} | ${ping.padEnd(5, " ")} ;\n`
            } else {
                let socket = `${socketData.ip}:${socketData.port}`
                serverString = `[ Server ${serverNumber} | (${(server.playing).toString().padStart(2, "0")}/${(servers.maxPlayers).toString().padStart(2, "0")}) | ${socket.padEnd(20, " ")} | ${ping.padEnd(5, " ")} ]\n`
            }
            
            description += serverString
            embed.setDescription("```ini\n" + description + "```")

            // await interaction.editReply({embeds: [embed]})
            await utility.reply(interaction, {embeds: [embed]})
        }
    }
}