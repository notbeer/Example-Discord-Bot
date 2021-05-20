const Discord = require('discord.js');
const bot = new Discord.Client({ disableEveryone: true });
const botsettings = require('../../bot_settings/settings.json');
const cooldowns = new Discord.Collection();
bot.commands = new Discord.Collection();

module.exports = {
    event: "message",
    once: false,
    async execute(message, bot) { 
        const prefix = botsettings.prefix;
        if(!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if(!command) return;

        if(message.channel.type !== 'dm') {
            if(!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) return;

            usersperms = message.channel.permissionsFor(message.author)
            if(!usersperms || !usersperms.has(command.userpermissions)) return message.channel.send(`${message.author}, you don't have the permission to execute this command!`).then(msg => {
                msg.delete({ timeout: 10000 });
            }).catch(() => {});

            botperms = `${command.botpermissions}`;
            const errorHandlerMSG = `I don't have the permission to execute the full command!\nHere are the **permission(s)** I need: \`${botperms.replace(/_/g, " ").replace(/,/g, ", ")}\``;
            if(!message.guild.me.hasPermission(command.botpermissions) || !message.channel.permissionsFor(bot.user).has(command.botpermissions)) return message.channel.send(`${message.author}, ${errorHandlerMSG}`);
        };

        function checkBotOwner(ID) {
            for(var i = 0; i < botsettings['bot-owners'].length; i++)
                if(ID == botsettings['bot-owners'][i]) return true;
            return false;
        };

        if(command.ownerOnly && !checkBotOwner(message.author.id)) return;
        if(command.guildOnly && message.channel.type === 'dm') return message.channel.send(`${message.author}, I can't execute this command inside DMs!`);
        if(command.dmOnly && message.channel.type !== 'dm') return message.channel.send(`${message.author}, please use this command in the bots DM!`).then(msg => {
            msg.delete({ timeout: 10000});
        }).catch(() => {});

        if(command.args && !args.length) message.reply(`command usage error...\nType \`${prefix}help ${command.name}\` for more information about the command!`)

        if (!cooldowns.has(command.name)) cooldowns.set(command.name, new Discord.Collection());

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if(timestamps.has(message.author.id) && !checkBotOwner(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`${message.author}, please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`).then(msg => {
                    msg.delete({ timeout: 10000 });
                }).catch(() => {});
            };
        };

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args, bot);
        } catch (error) {
            console.error(error);
            message.channel.send(`${message.author}, there was an error trying to execute that command!`).then(msg => {
                msg.delete({ timeout: 10000 });
            }).catch(() => {});
        };
    }
};
