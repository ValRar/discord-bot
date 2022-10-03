const { SlashCommandBuilder, SlashCommandUserOption, SlashCommandStringOption, SlashCommandNumberOption } = require('discord.js')
const commands = [
  new SlashCommandBuilder().setName("ping").setDescription("send pong."),
  new SlashCommandBuilder()
    .setName("qrcode")
    .setDescription("makes a qr code.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("source")
        .setDescription("The source in qr code.")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("bans a user")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("a user to be banned.")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("reason")
        .setDescription("reason of ban.")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("unban")
    .setDescription("unbans a user.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("user to be unbanned.")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("join")
    .setDescription("Joins to the voice channel."),
  new SlashCommandBuilder()
    .setName("leave")
    .setDescription("leaves from voice channel."),
  new SlashCommandBuilder()
    .setName("mute")
    .setDescription("mute user for a certain time")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("user to be muted.")
        .setRequired(true)
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName("time")
        .setDescription(
          "the time for which the user will be muted (in minutes)."
        )
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("reason")
        .setDescription("reason of mute.")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("unmute user.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("user")
        .setDescription("user to be unmuted.")
        .setRequired(true)
    )
    .addStringOption(
      new SlashCommandStringOption()
        .setName("reason")
        .setDescription("reason of unmute.")
        .setRequired(false)
    ),
  new SlashCommandBuilder()
    .setName("search")
    .setDescription("find video in youtube")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("query")
        .setDescription("what will be found in youtube")
        .setRequired(true)
    ),
    new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays a music.")
    .addStringOption(
      new SlashCommandStringOption()
        .setName("name")
        .setDescription("name of a song (ONLY YOUTUBE).")
        .setRequired(true)
    ),
];
exports.list = commands