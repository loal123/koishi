const fs = require('node:fs');
const path = require('node:path')
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token, mongodb_uri } = require('./config.json');
const mongoose = require('mongoose');
const { notif } = require('./utils/notif.js');
const User = require('./models/User.js')

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require((filePath));

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
}
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
        }
    }

});


(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongodb_uri);
        console.log('Connected to Database.');

    }
    catch (error) {
        console.log(`Error: ${error}`);
    }

})();

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);


setInterval(async () => {
    try {
        const cursor = User.find({}).cursor();
        for await (const userdata of cursor) {
            notif(client, userdata)
        }


    } catch (error) {
        console.error("Error in notif function:", error);
    }
}, 120000);