const { SlashCommandBuilder } = require('discord.js');

const apigeneral = "https://ch.tetr.io/api/";
async function findtr(username) {

    try {
        const response = await fetch(`${apigeneral}users/${username}/summaries/league`);
        const json = await response.json();

        if (!json.success) {
            return "Failed"
        }
        return json.data.tr;

    }
    catch (error) {
        console.log("Error fetching data", error);
        return "Error fetching data"
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('tr')
        .setDescription('Gets user tr')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('username')
                .setRequired(true)),

    async execute(interaction) {

        const input = interaction.options.getString('username');
        const tr = await findtr(input);

        await interaction.reply(`The tr is ${tr}`);
    },
};