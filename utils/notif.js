const { Client, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { fetchleague } = require('./fetchgames.js');

const User = require('../models/User.js');

client.commands = new Collection();

async function notif(client, userdata) {
    try {
        const json = await fetchleague(userdata.username);

        if (!json || json === "Failed" || json === "Error Fetching data") {
            console.error("fetchleague returned an error or invalid response:", json);
            return;
        }
        let player1data = json.data.entries[0].results.leaderboard[0];
        let player2data = json.data.entries[0].results.leaderboard[1];
        // const testdata = JSON.parse(fs.readFileSync('testdb.json', 'utf-8'));
        const player1id = player1data.id;
        const player2id = player2data.id;
        let player1tr = json.data.entries[0].extras.league[player1id];
        let player2tr = json.data.entries[0].extras.league[player2id];
        if (userdata.lastleagueid === json.data.entries[0]._id) {
            console.log("No new data to process.");
            return;
        }
        try {
            await User.findOneAndUpdate({ username: userdata.username }, { lastleagueid: json.data.entries[0]._id }, { new: true, runValidators: true });
            console.log("User updated succesfully!");
        }
        catch (error) {
            console.error('Update failed', error);
        }

        if (player1data.username != userdata.username) { // in case user queried is player2 in the data, switch
            let temp = player1data;
            player1data = player2data;
            player2data = temp;
            temp = player1tr;
            player1tr = player2tr;
            player2tr = temp
        }









        // fs.writeFileSync('testdb.json', JSON.stringify(testdata, null, 2));

        const channel = await client.channels.fetch("1368103181044940861").catch(error => {
            console.error("Error fetching channel:", error);
            return null;
        });
        if (!channel) {
            console.error("Channel not found");
            return;
        }
        console.log(`Channel found: ${channel.name}`);
        const color = (json.data.entries[0].extras.result == "victory") ? 0x00FF00 : 0xFF0000; // Green if first player wins, red if second player wins
        const game = new EmbedBuilder()
            .setColor(color)
            .setTitle(`${player1data.username.toUpperCase()} VS ${player2data.username.toUpperCase()}`)
            .setURL(`https://tetr.io/#R:${json.data.entries[0].replayid}`)
            .setAuthor({ name: 'Koishi Komeiji', iconURL: 'https://tetr.io/user-content/avatars/67de6bb3cac476ef53619cdc.jpg?rv=1746360566638', url: 'https://discord.js.org' })
            .setDescription("**Game Result**")
            .setThumbnail('https://tetr.io/user-content/avatars/67de6bb3cac476ef53619cdc.jpg?rv=1746360566638')
            .addFields(
                { name: `${player1data.username.toUpperCase()}`, value: player1data.wins.toString() },
                { name: 'PPS', value: player1data.stats.pps.toFixed(2).toString(), inline: true },
                { name: 'APM', value: player1data.stats.apm.toFixed(2).toString(), inline: true },
                { name: 'VS', value: player1data.stats.vsscore.toFixed(2).toString(), inline: true },
                { name: 'Before', value: (`${player1tr[0].tr == null ? '-' : player1tr[0].tr.toFixed(2)}`) },
                { name: 'After', value: (`${player1tr[1].tr == null ? '-' : player1tr[1].tr.toFixed(2)}`) },
                { name: 'Difference', value: (`${player1tr[0].tr > player1tr[1].tr ? '-' : '+'} ${player1tr[1].tr.toFixed(2) - player1tr[0].tr.toFixed(2)}`) },

                { name: '\u200B', value: '\u200B' }, // Empty field for spacing
                { name: `${player2data.username.toUpperCase}`, value: player2data.wins.toString() },
                { name: 'PPS', value: player2data.stats.pps.toFixed(2).toString(), inline: true },
                { name: 'APM', value: player2data.stats.apm.toFixed(2).toString(), inline: true },
                { name: 'VS', value: player2data.stats.vsscore.toFixed(2).toString(), inline: true },

                { name: 'Before', value: (`${player2tr[0].tr == null ? '-' : player2tr[0].tr.toFixed(2)}`) },
                { name: 'After', value: (`${player2tr[1].tr == null ? '-' : player2tr[1].tr.toFixed(2)}`) },
                { name: 'Difference', value: (`${player2tr[0].tr > player2tr[1].tr ? '-' : '+'} ${player2tr[1].tr.toFixed(2) - player2tr[0].tr.toFixed(2)}`) },
            )
            .setTimestamp()
            .setFooter({ text: 'Footer text here', iconURL: 'https://example.com/footer-icon.png' });

        await channel.send({ embeds: [game] });
        console.log("Message sent successfully!");

    } catch (error) {
        console.error("An error occurred in notif:", error);
    }
}


module.exports = { notif };