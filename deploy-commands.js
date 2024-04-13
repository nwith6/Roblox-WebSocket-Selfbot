const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('discord.js');
const { token, clientId } = require("./config.json").discord

const commands = [];
const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const command = require(`${__dirname}/commands/${file}`)
	if (command.data instanceof SlashCommandBuilder) {
		// let json = command.data.toJSON()

		// if (json.options) {
		// 	for (let i=0; i<json.options.length; i++) {
		// 		if (json.options[i].options) {
		// 			console.log(json.options[i].options)
		// 		}
		// 	}
		// }
		commands.push(command.data.toJSON())
	} else {
		// console.log(command.data)
		commands.push(command.data)
	}
}

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)