const botsettings = require('../../bot_settings/settings.json');

module.exports = {
    event: "ready",
    once: true,
    async execute(bot) {
        const botStatus = [
            {
                statusType: "STREAMING",
                URL: "https://www.twitch.tv/notbeertv",
                statusMessage: `${botsettings.prefix}help`
            },
            {
                statusType: "STREAMING",
                URL: "https://www.twitch.tv/notbeertv",
                statusMessage: "@mention me!"
            },
            {
                statusType: "WATCHING",
                statusMessage: `over ${bot.guilds.cache.size} servers`
            },
            {
                statusType: "LISTENING",
                statusMessage: `to ${bot.channels.cache.size} channels`
            },
            {
                statusType: "LISTENING",
                statusMessage: `to ${bot.users.cache.size} users`
            }
        ];
        var onIndex = 1;
        function randomStatus() {
            const status = botStatus[onIndex - 1];
            bot.user.setActivity(status.statusMessage, {
                type: status.statusType ? status.statusType : null,
                url: status.URL ? status.URL : null
            });
            botStatus.length === onIndex ? onIndex = 1 : onIndex++;
        }; 
        setInterval(randomStatus, 30000);
        randomStatus();
        console.log(`${bot.user.username} is online!`);
    }
};
