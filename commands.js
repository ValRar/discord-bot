require('dotenv').config()
const { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });
const commands = require('./commandList').list

client.login(process.env.TOKEN)

client.once('ready', () => {
    client.guilds.cache.each(guild => deleteCommands(guild.id))
    client.guilds.cache.each(guild => addCommands(commands, guild.id)) 
    client.destroy()
})
  


function deleteCommands(guildId) {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord.js');
    const clientId = process.env.clientId
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
}
function addCommands(commands, guildId) {
    const { Routes } = require('discord.js');
    const { REST } = require('@discordjs/rest');
    const clientId = process.env.clientId
    
        commands.map(command => command.toJSON());
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log(`Successfully registered application commands in Guild id - ${guildId}.`))
        .catch(console.error);
}
    