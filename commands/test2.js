const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test2')
        .setDescription('testing 2')
        .addStringOption(option =>
            option.setName('idktest')
                .setDescription('hdfosj')
                .setRequired(false)),
    async execute(interaction) {
        let idk = interaction.options.getString('idk')


    }

}