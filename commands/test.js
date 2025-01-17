

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const apigeneral = "https://ch.tetr.io/api/";




// inside a command, event listener, etc.


async function getjson(id, casename) { // fetch json based on casename
    let apilink = `${apigeneral}achievements/${id}`;
    switch (casename) {
        case "usersearch":
            apilink = `${apigeneral}users/search/${id}`;
            break;
        case "userachievement": {
            apilink = `${apigeneral}users/${id}/summaries/achievements`;
            break;
        }



    }
    try { // fetch json
        const response = await fetch(apilink);
        const json = await response.json();

        if (!json.success) {
            return "Failed"
        }


        return json;
    }

    catch (error) {
        console.log("Error fetching data", error);
        return "Error fetching data"
    }
}
async function getuser(discorduser) { // get tetrio username from discord id
    try {
        const response = await fetch(`${apigeneral}users/search/discord:${discorduser}`);

        const json = await response.json();

        if (!json.success) {
            return null;
        }
        return json.data.user.username;
    }
    catch (error) {
        console.log("Error fetching data", error);
        return "Error fetching data"
    }
}
module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Gets Achievement Stats')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The id')
                .setRequired(true)),

    async execute(interaction) {
        let start = new Date().getTime();
        const input = interaction.options.getString('id');
        const discorduserid = interaction.user.id; // "Discord User ID"
        const [achievementjson, tetriouser] = await Promise.all([
            getjson(input, "achievement"),
            getuser(discorduserid)
        ]);

        // todo: 


        const name = achievementjson.data.achievement.name; // "Achievement Name"
        const desc = achievementjson.data.achievement.object; // "Achievement Description"
        const bronze = (achievementjson.data.cutoffs.bronze ? achievementjson.data.cutoffs.bronze : 150); // "Bronze Cutoff"
        const silver = (achievementjson.data.cutoffs.silver ? achievementjson.data.cutoffs.silver : 450); // "Silver Cutoff"
        const gold = (achievementjson.data.cutoffs.gold ? achievementjson.data.cutoffs.gold : 850);    // "Gold Cutoff"
        const platinum = (achievementjson.data.cutoffs.platinum ? achievementjson.data.cutoffs.platinum : 1350); // "Platinum Cutoff"
        const diamond = (achievementjson.data.cutoffs.diamond ? achievementjson.data.cutoffs.diamond : 1650);  // "Diamond Cutoff"
        const t100 = achievementjson.data.leaderboard[99].v.toFixed(2);
        const t50 = achievementjson.data.leaderboard[49].v.toFixed(2);
        const t25 = achievementjson.data.leaderboard[24].v.toFixed(2);
        const t10 = achievementjson.data.leaderboard[9].v.toFixed(2);
        const t3 = achievementjson.data.leaderboard[2].v.toFixed(2);




        const userjson = await getjson(tetriouser, "userachievement");
        const userscore = userjson.data[input - 1].v.toFixed(2); // "User's Achievements"







        const exampleEmbed = new EmbedBuilder()


            .setColor(0x0099FF)
            .setTitle(name)
            .setURL(`https://ch.tetr.io/achievements/${input}`)
            .setAuthor({ name: 'Koishi Komeiji', iconURL: 'https://tetr.io/res/achievements/frames/diamond.png', url: 'https://discord.js.org' })
            .setDescription(desc)
            .setThumbnail('https://tetr.io/res/achievements/frames/diamond.png')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Bronze', value: `${bronze}`, inline: false },
                { name: 'Silver', value: `${silver}`, inline: false },
                { name: 'Gold', value: `${gold}`, inline: false },
                { name: 'Platinum', value: `${platinum}`, inline: false },
                { name: 'Diamond', value: `${diamond}`, inline: false },
                { name: 'Top 100', value: `${t100}`, inline: false },
                { name: 'Top 50', value: `${t50}`, inline: false },
                { name: 'Top 25', value: `${t25}`, inline: false },
                { name: 'Top 10', value: `${t10}`, inline: false },
                { name: 'Top 3', value: `${t3}`, inline: false },
                { name: 'Your Current Score', value: `${userscore}`, inline: false },
            )

            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://tetr.io/res/achievements/frames/diamond.png' });




        await interaction.reply({ embeds: [exampleEmbed] }); // send embed
        let end = new Date().getTime();
        console.log(end - start); // time taken in ms

    },
};

