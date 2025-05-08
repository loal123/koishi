
async function fetchleague(username) {
    try {
        const response = await fetch(`https://ch.tetr.io/api/users/${username}/records/league/recent`)
        const json = await response.json()
        if (!json.success) {
            return "Failed";
        }


        return json;

    }
    catch (error) {
        console.log("Error Fetching data", error);
        return "Error Fetching data"
    }
}

module.exports = { fetchleague };