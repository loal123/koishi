const { SlashCommandBuilder } = require('discord.js')
const User = require('../models/User.js')



module.exports = {
    data: new SlashCommandBuilder()
        .setName('addplayer')
        .setDescription('Adds player to track')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('The username of the player you want to track')
                .setRequired(true)

        ),
    async execute(interaction) {
        const input = interaction.options.getString('username');
        const newUser = new User({
            username: input,
            lastleagueid: '-',
        });
        try {
            await newUser.save()
            interaction.reply("User is saved")
        }
        catch (error) {
            console.log("Error saving User ", error);
        }




    }



};