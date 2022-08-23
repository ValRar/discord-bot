require('dotenv').config()
const { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const commands = [
    new SlashCommandBuilder()
    .setName('ping')
    .setDescription('send pong.'),
    new SlashCommandBuilder()
    .setName('qrcode')
    .setDescription('makes a qr code.')
    .addStringOption(new SlashCommandStringOption()
        .setName('source')
        .setDescription('The source in qr code.')
        .setRequired(true)),
    new SlashCommandBuilder()
    .setName('ban')
    .setDescription('bans a user')
    .addUserOption(new SlashCommandUserOption()
        .setName('user')
        .setDescription('a user to be banned.')
        .setRequired(true)
    )
    .addStringOption(
        new SlashCommandStringOption()
        .setName('reason')
        .setDescription('reason of ban.')
        .setRequired(false)
    ),
    new SlashCommandBuilder()
    .setName('unban')
    .setDescription('unbans a user.')
    .addUserOption(new SlashCommandUserOption()
    .setName('user')
    .setDescription('user to be unbanned.')
    .setRequired(true)),
    new SlashCommandBuilder()
    .setName('join')
    .setDescription('Joins to the voice channel.'),
    new SlashCommandBuilder()
    .setName('leave')
    .setDescription('leaves from voice channel.'),
    new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a music')
    .addStringOption(new SlashCommandStringOption()
    .setName('url')
    .setDescription('url of a song.')
    .setRequired(true)),
]
console.log('Ready!');
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
    const clientId = '1010883303701741570'
    
        commands.map(command => command.toJSON());
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    
    rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
        .then(() => console.log(`Successfully registered application commands in Guild id - ${guildId}.`))
        .catch(console.error);
}
    