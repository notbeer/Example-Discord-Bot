const Discord = require('discord.js');
const bot = new Discord.Client({ disableEveryone: true, disableMentions: 'everyone' });

bot.commands = new Discord.Collection();

bot.on("warn", (info) => console.log(info));
bot.on("error", console.error);

const settings = require('./bot_settings/settings.json');
bot.login(settings.token);

const fs = require('fs');

//Load all the command files
function getCommands(path) {
    if(!fs.existsSync(path)) return console.log(`${path} couldn't be found`);
    const commandFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${path}/${file}`);
        bot.commands.set(command.name, command);
        console.log(`[Command] ✔️   Loaded ${command.name}`);
    };
};

getCommands('./commands/fun')
getCommands('./commands/information');
getCommands('./commands/misc');
getCommands('./commands/private');

//Load all the event files
function getEvent(path) {
    if(!fs.existsSync(path)) return console.log(`${path} couldn't be found`);
    const eventFiles = fs.readdirSync(path).filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const eventFile = require(`${path}/${file}`);
        eventFile.once 
        ? bot.once(eventFile.event, (...args) => eventFile.execute(...args, bot)) 
        : bot.on(eventFile.event, (...args) => eventFile.execute(...args, bot));
        console.log(`[Event] ✔️   Loaded ${eventFile.event}`)
    };
};
getEvent('./events/client');