const { Client, GatewayIntentBits, SlashCommandBuilder, SlashCommandStringOption, SlashCommandUserOption, RESTJSONErrorCodes } = require('discord.js');
const Discordjs = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, getVoiceConnection, createAudioResource } = require('@discordjs/voice')
require('dotenv').config()
require('ffmpeg')
require('sodium')
const ytdl = require('ytdl-core')
// Create a new client instance
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
// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
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
        if (!interaction.member.permissions.has(Discordjs.PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({
                content: 'You don`t have permission to ban members on this server.',
                ephemeral: true,
            })
        }
        const user = options.getUser('user')
        let reason = options.getString('reason')
        if (reason === null) reason = 'none'
        try {
        interaction.guild.members.ban(user, {
            reason: reason,
        })
        interaction.reply({
            content: `User ${user} was succesfully permanently banned with reason: ${reason}.`,
            ephemeral: false,
        })
        } catch {
            interaction.reply({
                content: "Bot can`t ban this user!",
                ephemeral: true,
            })
        }
    } else if (commandName === 'unban'){
        if (!interaction.member.permissions.has(Discordjs.PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You don`t have permission to unban members on this server.',
                ephemeral: true,
            })
        }
        const user = options.getUser('user')
        let isUnbannable = true
        interaction.guild.members.unban(user).catch(err => {
            if (err.code == RESTJSONErrorCodes.UnknownBan) {
                interaction.reply({
                    content: 'This user not banned.',
                    ephemeral: true,
                })
            } else {
                interaction.reply({
                     content: 'Bot can`t unban this user.',
                    ephemeral: true,
                })
            }
            isUnbannable = false
        }).then( () => {
            if (isUnbannable) {
                interaction.reply({
                    content: `User ${user} was succesfully unbanned.`,
                    ephemeral: false,
                })
            }
        })
            
    } else if (commandName === 'join') {
        if (interaction.member.voice.channelId){
            joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            })
            interaction.reply({
                content: 'succesfully joined.',
                ephemeral: false,
            })
        } else {
            interaction.reply({
                content: 'you doesn`t connected to the voice channel.',
                ephemeral: true,
            })
        }
    } else if (commandName === 'leave'){
        const connection = getVoiceConnection(interaction.guild.id)
        if (connection){
            connection.destroy()
            interaction.reply({
                content: 'Bot succesfully disconnected.',
                ephemeral: false,
            })
        } else {
            interaction.reply({
                content: 'bot doesn`t connected to the voice channel.',
                ephemeral: true,
            })
        }
    } else if (commandName === 'play') {
        const url = options.getString('url')
        let validUrl = true
        ytdl.getInfo(url).catch(() => {
            validUrl = false
            console.log('error')
        }).then((info) => {
            if (validUrl) {
                const resource = createAudioResource(ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }))
                const player = createAudioPlayer()
             const voiceChannel = getVoiceConnection(interaction.guild.id)
                if (!voiceChannel) {
                    interaction.reply({
                     content: 'I am don`t connected to the voice channel.',
                        ephemeral: true,
                    })
                }
                else {
                    voiceChannel.subscribe(player)
                    player.play(resource)
                     interaction.reply({
                        content: `Now playing: [${info.videoDetails.title}](${url})`,
                        ephemeral: false,
                    })
                }
            } else {
                interaction.reply({
                    content: 'Video with this url was not found.',
                    ephemeral: true,
                })
            }
        })
    }
})

client.on('guildCreate', (guild) => {
    addCommands(commands, guild.id)
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
// client.on('messageCreate', async (message) => {
//     if (message.author.id != client.user.id) message.channel.send("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example")
// })
// https://discord.com/api/oauth2/authorize?client_id=1010883303701741570&permissions=8&scope=bot%20applications.commands
// https://discord.gg/g3RrJHNk
// Login to Discord with your client's token
client.login(process.env.TOKEN);
