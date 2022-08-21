const { Client, GatewayIntentBits, messageLink, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption } = require('discord.js');
const Discordjs = require('discord.js')
const dotenv = require('dotenv').config()
const fs = require('fs')
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    //const guild = client.guilds.cache.get(GUILD_ID)

    const commands = [
        new SlashCommandBuilder()
        .setName('ping')
        .setDescription('send pong'),
        new SlashCommandBuilder()
        .setName('qrcode')
        .setDescription('makes a qr code')
        .addStringOption(new SlashCommandStringOption()
            .setName('source')
            .setDescription('The source in qr code.')
            .setRequired(true)),
        new SlashCommandBuilder()
        .setName('ban')
        .setDescription('bans a user')
        .addUserOption(new SlashCommandUserOption()
            .setName('user')
            .setDescription('a user to be banned')
            .setRequired(true)
        )
        .addStringOption(
            new SlashCommandStringOption()
            .setName('reason')
            .setDescription('reason of ban')
            .setRequired(false)
        )
    ]

    //client.guilds.cache.each(guild => deleteCommands(guild.id))
    deleteCommands()
    client.guilds.cache.each(guild => addCommands(commands, guild.id))
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    const { commandName, options } = interaction

    if (commandName === 'ping'){
        interaction.reply({
            content: 'pong!',
            ephemeral: true,
        })
    } else if (commandName === 'sum'){
        const num1 = options.getNumber('num1')        
        const num2 = options.getNumber('num2')
        interaction.reply({
            content: `sum is ${num1 + num2}`,
            ephemeral: true,
        })
    } else if (commandName === 'qrcode'){
        let source = options.getString('source')
        if (source){
            source = source.replace(/ /gi, '%20')
            
            interaction.reply({
                content: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${source}`,
                ephemeral: false,
            })
        }
    } else if (commandName === 'ban'){
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            interaction.reply({
                content: 'You don`t have permission to ban members on this server.',
                ephemeral: true,
            })
            return
        }
        const user = options.getUser('user')
        const reason = options.getString('reason')
        try {
        interaction.guild.members.ban(user, {
            reason: reason,
        })
        interaction.reply({
            content: `User @${user.tag} was succesfully permanently banned with reason: ${reason}.`
        })
        } catch {
            interaction.reply({
                content: "Bot can`t ban this user!",
                ephemeral: true,
            })
        }
    }
})

function addCommands(commands, guildId) {
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const clientId = '1010883303701741570'

	commands.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log(`Successfully registered application commands in Guild id - ${guildId}.`))
	.catch(console.error);
}

function deleteCommands() {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord.js');
    const clientId = process.env.clientId
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
         const guildId = client.guilds.cache.at(0).id
    } catch {
        console.log("error caused while deleting commands!")
        return
    }
    
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
// client.on('messageCreate', async (message) => {
//     if (message.author.id != client.user.id) message.channel.send("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example")
// })
// https://discord.com/api/oauth2/authorize?client_id=1010883303701741570&permissions=8&scope=bot%20applications.commands
// https://discord.gg/g3RrJHNk
// Login to Discord with your client's token
client.login(process.env.TOKEN);