const {
  Client,
  GatewayIntentBits,
  RESTJSONErrorCodes,
  EmbedBuilder,
  Routes,
} = require("discord.js");
const Discordjs = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  getVoiceConnection,
  createAudioResource,
  NoSubscriberBehavior,
} = require("@discordjs/voice");
const { REST } = require("@discordjs/rest");
require("dotenv").config();
const ytsr = require("ytsr");
const playDl = require("play-dl");
// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
const commands = require("./commandList").list;
// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});
async function playurl(url, interaction) {
  if (playDl.yt_validate(url)) {
    let stream
    try {
      stream = await playDl.stream(url, { discordPlayerCompatibility: true })
    } catch (e) {
      interaction.editReply({
        content: "Failed to play video",
        ephemeral: false,
      })
      return
    }
    if (!stream) {
      interaction.editReply({
        content: "Failed to play video",
        ephemeral: false,
      })
      return
    }
    const resource = createAudioResource(
      stream.stream,
      {inputType: stream.type}
    );
    const player = createAudioPlayer({behaviors: {noSubscriber: NoSubscriberBehavior.Play}});
    const voiceConnection = joinVoiceChannel({
      channelId: interaction.member.voice.channelId,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
      const newUdp = Reflect.get(newNetworkState, 'udp');
      clearInterval(newUdp?.keepAliveInterval);
    }
    
    voiceConnection.on('stateChange', (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, 'networking');
      const newNetworking = Reflect.get(newState, 'networking');
    
      oldNetworking?.off('stateChange', networkStateChangeHandler);
      newNetworking?.on('stateChange', networkStateChangeHandler);
    });
    if (!voiceConnection) {
      interaction.editReply({
        content: "I am don`t connected to the voice channel.",
        ephemeral: true,
      });
    } else {
      voiceConnection.subscribe(player)
      player.play(resource);
      const info = (await playDl.video_info(url)).video_details;
      interaction.editReply({
        content: `Now playing: [${info.title}](${url})`,
        ephemeral: false,
      });
    }
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  const { commandName, options } = interaction;

  if (commandName === "ping") {
    interaction.reply({
      content: "pong!",
      ephemeral: true,
    });
  } else if (commandName === "qrcode") {
    await interaction.deferReply();
    let source = options.getString("source");
    if (source) {
      source = source.replace(/ /gi, "%20");

      interaction.editReply({
        content: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${source}`,
        ephemeral: false,
      });
    }
  } else if (commandName === "ban") {
    await interaction.deferReply();
    if (
      !interaction.member.permissions.has(
        Discordjs.PermissionsBitField.Flags.BanMembers
      )
    ) {
      return interaction.editReply({
        content: "You don`t have permission to ban members on this server.",
        ephemeral: true,
      });
    }
    const user = options.getUser("user");
    let reason = options.getString("reason");
    if (reason === null) reason = "none";
    try {
      interaction.guild.members.ban(user, {
        reason: reason,
      });
      interaction.editReply({
        content: `User ${user} was succesfully permanently banned with reason: ${reason}.`,
        ephemeral: false,
      });
    } catch {
      interaction.editReply({
        content: "Bot can`t ban this user!",
        ephemeral: true,
      });
    }
  } else if (commandName === "unban") {
    await interaction.deferReply();
    if (
      !interaction.member.permissions.has(
        Discordjs.PermissionsBitField.Flags.Administrator
      )
    ) {
      return interaction.editReply({
        content: "You don`t have permission to unban members on this server.",
        ephemeral: true,
      });
    }
    const user = options.getUser("user");
    let isUnbannable = true;
    interaction.guild.members
      .unban(user)
      .catch((err) => {
        if (err.code == RESTJSONErrorCodes.UnknownBan) {
          interaction.editReply({
            content: "This user not banned.",
            ephemeral: true,
          });
        } else {
          interaction.editReply({
            content: "Bot can`t unban this user.",
            ephemeral: true,
          });
        }
        isUnbannable = false;
      })
      .then(() => {
        if (isUnbannable) {
          interaction.editReply({
            content: `User ${user} was succesfully unbanned.`,
            ephemeral: false,
          });
        }
      });
  } else if (commandName === "join") {
    await interaction.deferReply();
    if (interaction.member.voice.channelId) {
      const voiceConnection = joinVoiceChannel({
        channelId: interaction.member.voice.channelId,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });
      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }
      
      voiceConnection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking');
        const newNetworking = Reflect.get(newState, 'networking');
      
        oldNetworking?.off('stateChange', networkStateChangeHandler);
        newNetworking?.on('stateChange', networkStateChangeHandler);
      });
      try {
        await interaction.editReply({
          content: "Succesfully joined.",
          ephemeral: false,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      interaction.editReply({
        content: "You don`t connected to the voice channel.",
        ephemeral: true,
      });
    }
  } else if (commandName === "leave") {
    await interaction.deferReply();
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
      connection.destroy();
      interaction.editReply({
        content: "Bot succesfully disconnected.",
        ephemeral: false,
      });
    } else {
      interaction.editReply({
        content: "Bot doesn`t connected to the voice channel.",
        ephemeral: true,
      });
    }
  } else if (commandName === "mute") {
    if (
      interaction.member.permissions.has(
        Discordjs.PermissionsBitField.Flags.MuteMembers
      )
    ) {
      const user = options.getUser("user");
      const time = options.getNumber("time") * 60000;
      const reason = options.getString("reason");
      interaction.guild.members
        .fetch(user.id)
        .then((members) => {
          members.timeout(time, reason);
          interaction.reply({
            content: `User ${user} was succesfully muted for ${time} minutes by reason: ${reason}`,
            ephemeral: false,
          });
        })
        .catch((err) => {
          console.log(err);
          interaction.reply({
            content: "An error occurred while trying to mute the user",
            ephemeral: true,
          });
        });
    } else {
      interaction.reply({
        content: "You can`t mute members on this server.",
        ephemeral: true,
      });
    }
  } else if (commandName === "unmute") {
    if (
      interaction.member.permissions.has(
        Discordjs.PermissionsBitField.Flags.Administrator
      )
    ) {
      const user = options.getUser("user");
      const reason = options.getString("reason");
      interaction.guild.members
        .fetch(user.id)
        .then((members) => {
          members.timeout(null, reason);
          interaction.reply({
            content: `User ${user} was succesfully unmuted by reason: ${reason}`,
            ephemeral: false,
          });
        })
        .catch((err) => {
          console.log(err);
          interaction.reply({
            content: "An error occurred while trying to unmute the user",
            ephemeral: true,
          });
        });
    } else {
      interaction.reply({
        content: "You can`t unmute members on this server.",
        ephemeral: true,
      });
    }
  } else if (commandName === "search") {
    const searchWord = options.getString("query");
    ytsr(searchWord, { limit: 10 }).then((res) => {
      let searchRes = [];
      res.items.map((item, index) => {
        index++;
        const embed = new EmbedBuilder().setTitle(item.title).setURL(item.url);
        try {
          embed.setImage(item.thumbnails[0].url);
        } catch (ignore) {}
        searchRes.push(embed);
      });
      interaction.reply({
        content: "Search results:",
        ephemeral: false,
        embeds: searchRes,
      });
    });
  } else if (commandName === "play") {
    await interaction.deferReply();
    const songName = options.getString("name");
    if (playDl.validate(songName)) {
      await playurl(songName, interaction);
    } else {
      const res = await ytsr(songName, { limit: 1 })
      if (res.items.length == 0) {
          interaction.editReply({
            content: "Couldn't find anything for your query",
          });
          return;
        }
        await playurl(res.items[0].url, interaction);
    }
  }
});
client.on("voiceStateUpdate", async (oldState, newState) => {
  let guild = newState.guild;
  const voiceConnection = getVoiceConnection(guild.id);
  // Если инициатор события - бот, игнорируем, во избежание перезаходов
  if (newState.id === client.user.id) return;
  // Если бот не в канале - прерываем дальнейшее выполнение
  if (!voiceConnection) return;
  // Если пользователь зашел в канал - прерываем
  if (!oldState.channelId) return;
  // Если бота нет в канале - прерываем
  if (oldState.channelId !== guild.members.resolve(client.user).voice.channelId)
    return;
  // Определяем, вышел ли пользователь из канала. Если нет - прерываем
  if (newState.channelId) return;
  // Определяем значение гильдии, для удобности (и понятности)
  // Получаем объект канала
  let channel = guild.channels.resolve(oldState.channelId);
  // Если в канале есть кто-то кроме бота - прерываем
  if (channel.members.size > 1) return;
  // Выходим из канала и пишем сообщение
  voiceConnection.destroy();
});

client.on("guildCreate", (guild) => {
  addCommands(commands, guild.id);
});
function addCommands(commands, guildId) {
  const clientId = process.env.clientId;

  commands.map((command) => command.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
    .then(() =>
      console.log(
        `Successfully registered application commands in Guild id - ${guildId}.`
      )
    )
    .catch(console.error);
}
// https://discord.com/api/oauth2/authorize?client_id=1010883303701741570&permissions=8&scope=bot%20applications.commands
// Login to Discord with your client's token
client.login(process.env.TOKEN);
