const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config()
const clientId = '1010883303701741570'
const guildId = ''
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// ...

// for guild-based commands
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for global commands
rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);