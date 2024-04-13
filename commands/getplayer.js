const discord = require("discord.js")
const utility = require("../modules/utility")
const { Scraper } = require("../modules/scraper")

module.exports = {
    data: {
        name: "getplayer",
        description: "Fetch the server data for a specific server based on a players username.",
        options: [
            {
                name: "username",
                description: "The players username.",
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
        const scraper = new Scraper(undefined)
        const server = await scraper.fetchPlayerServer(interaction.options.getString("username"))

        if (server.error) {
            // return await interaction.reply({content: server.error, ephemeral: true})
            return await utility.reply(interaction, {content: server.error, ephemeral: true})
        }
        await interaction.deferReply()

        const socketData = await scraper.fetchServerSocket(server.gameId)

        let serverString;
        if (socketData.error) {
            serverString = `; ${socketData.error} ;`
        } else {
            serverString = `[ User Server | (?/${server.maxPlayers}) | ${socketData.ip}:${socketData.port} | ?ms ]`
        }

        const embed = utility.SERVER(`${server.user.display} (${server.user.name})`, server.user.url, server.user.playerHeadshot, "```ini\n" + serverString + "```")
        // await interaction.reply({ embeds: [embed] })
        await utility.reply(interaction, {embeds: [embed]})
    }
}