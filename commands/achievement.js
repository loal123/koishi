const { SlashCommandBuilder } = require('discord.js');

const apigeneral = "https://ch.tetr.io/api/";
async function findtr(id) {

    try {
        const response = await fetch(`${apigeneral}achievements/${id}`);
        const json = await response.json();

        if (!json.success) {
            return "Failed"
        }
        return json.data.achievement.object;

    }
    catch (error) {
        console.log("Error fetching data", error);
        return "Error fetching data"
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('achievement')
        .setDescription('Gets Achievement Stats')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The id')
                .setRequired(true)),

    async execute(interaction) {

        const input = interaction.options.getString('id');
        const desc = await findtr(input);

        await interaction.reply(desc);
    },
};