const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption } = require('discord.js')
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
    .setDescription('url of a song (ONLY YOUTUBE).')
    .setRequired(true)),
]
exports.list = commands