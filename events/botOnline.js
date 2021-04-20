const botsettings = require('../bot_settings/settings.json');

module.exports = {
    event: "ready",
    once: true,
    async run(bot) {
        function randomStatus() {
            let status = [
                `${botsettings.prefix}help`,
                "Status 1",
                "Status 2",
                "Status 3..."
            ];
            let rstatus = Math.floor(Math.random() * status.length);
            bot.user.setActivity(status[rstatus], {type: "WATCHING"});
        }; setInterval(randomStatus, 5000);
        console.log(`
        ${bot.user.username} is online!
        I'm in ${bot.guilds.cache.size} servers!

        Bot Template by - notbeer
        Github repositorie: https://github.com/notbeer/Example-Discord-Bot
        `);
    }
};