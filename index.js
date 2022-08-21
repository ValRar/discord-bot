const { Client, GatewayIntentBits } = require('discord.js');
const Discordjs = require('discord.js')
const TOKEN="MTAxMDg4MzMwMzcwMTc0MTU3MA.G5VP8w.x96pFSL0kYj9UEPm85ngvBuI16Zyv_t8SRFhVE"
const GUILD_ID="1010887912541405205"

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
    const guild = client.guilds.cache.get(GUILD_ID)

    let commands
    if (guild){
        commands = guild.commands
    } else {
        commands = client.application.commands
    }
    commands.create({
        name: 'ping',
        description: 'send pong',
    })
    commands.create({
        name: 'sum',
        description: 'sum of 2 numbers.',
        options: [
            {
                name: 'num1',
                description: 'the first number',
                required: true,
                type: Discordjs.ApplicationCommandOptionType.Number
            },
            {
                name: 'num2',
                description: 'the second number',
                required: true,
                type: Discordjs.ApplicationCommandOptionType.Number
            }
        ]
    })
    commands.create({
        name: 'qrcode',
        description: 'makes a qr code',
        options: [
            {
                name: 'source',
                description: 'The source in qr code.',
                required: true,
                type: Discordjs.ApplicationCommandOptionType.String,
            },
        ],
    })
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
        const source = options.getString('source')
        if (source){
            interaction.reply({
                content: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${source}`,
                ephemeral: false,
            })
        }
    }
})

// client.on('messageCreate', async (message) => {
//     if (message.author.id != client.user.id) message.channel.send("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example")
// })

// Login to Discord with your client's token
client.login(TOKEN);