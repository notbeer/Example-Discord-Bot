const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true });
const botsettings = require('../bot_settings/settings.json');
const cooldowns = new Discord.Collection();
bot.commands = new Discord.Collection();

module.exports = {
    event: "message",
    once: false,
    async run(message, bot) { 
        const prefix = botsettings.prefix
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        
        if(!command) return;
        if(command.guildOnly && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs!');
        if(command.dmOnly && message.channel.type !== 'dm') return message.reply('please use this command in the bots DM!');

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage)
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;

            return message.channel.send(reply).then(msg => {
                msg.delete({ timeout: 5000});
            })
            .catch(console.error);
        };

        if (!cooldowns.has(command.name))
            cooldowns.set(command.name, new Discord.Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then(msg => {
                    msg.delete({ timeout: 5000});
                })
                .catch(console.error);
            };
        };

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args, bot);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!').then(msg => {
                msg.delete({ timeout: 5000});
            }).catch(console.error);
        };
    }
};
