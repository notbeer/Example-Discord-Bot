const Discord = require('discord.js');
const bot = new Discord.Client({disableEveryone: true });

bot.commands = new Discord.Collection();

bot.on("warn", (info) => console.log(info));
bot.on("error", console.error);

const settings = require('./bot_settings/settings.json');
bot.login(settings.token);

const fs = require('fs');

//!Fun Category
const funCommandFiles = fs.readdirSync('./commands/fun').filter(file => file.endsWith('.js'));
for (const file of funCommandFiles) {
	const funCommand = require(`./commands/fun/${file}`);
	bot.commands.set(funCommand.name, funCommand);
};

//!Information Category
const informationCommandFiles = fs.readdirSync('./commands/information').filter(file => file.endsWith('.js'));
for (const file of informationCommandFiles) {
	const informationCommand = require(`./commands/information/${file}`);
	bot.commands.set(informationCommand.name, informationCommand);
};

//!Misc Category
const miscCommandFiles = fs.readdirSync('./commands/misc').filter(file => file.endsWith('.js'));
for (const file of miscCommandFiles) {
	const miscCommand = require(`./commands/misc/${file}`);
	bot.commands.set(miscCommand.name, miscCommand);
};

//!Event handler
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`);
        if (eventFunction.disabled) return;

        const event = eventFunction.event || file.split('.')[0]; 
        const emitter = (typeof eventFunction.emitter === 'string' ? bot[eventFunction.emitter] : eventFunction.emitter) || bot;
        const once = eventFunction.once;

        try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args, bot));
        } catch (error) {
            console.error(error);
        }
    });
});