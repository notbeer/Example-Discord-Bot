const Discord = require('discord.js');
const fs = require('fs');
const botsettings = require('../../bot_settings/settings.json');
const { embededPages } = require('../../utils/embededPages');

module.exports = {
	category: 'Information',
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: [
		'commands'
	],
	usage: '[command name]',
	example: [
		'help',
		'help userinfo'
	],
	cooldown: 5,
	guildOnly: true,
	async execute(message, args, bot) {
        const prefix = botsettings.prefix;

		const data = [];
		var cmdlist = [];
		var infostr = 'Information\n**Commands**: ';
		var miscstr = 'Misc\n**Commands**: ';
		var funstr = 'Fun\n**Commands**: ';
		var array = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here\'s a list of all my commands:');
			data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

			commands.forEach(command => cmdlist.push(command.name));

			function getCategory(cmd, categoryName) {
				return commands.find(c => c.name && c.name.includes(cmd) && c.category && c.category.includes(categoryName));
			};
			var i;
			for(i = 0; i < cmdlist.length; i++) {
				if(getCategory(cmdlist[i], 'Fun')) {
					funstr += `${cmdlist[i]}, `
				} else if(getCategory(cmdlist[i], 'Information')) {
					infostr += `${cmdlist[i]}, `
				} else if(getCategory(cmdlist[i], 'Misc')) {
					miscstr += `${cmdlist[i]}, `
				}
			}
			if(i == cmdlist.length) array.push(infostr.replace(/,\s*$/, ""), miscstr.replace(/,\s*$/, ""), funstr.replace(/,\s*$/, ""));

			let embed = new Discord.MessageEmbed()
				.setColor("#36393f")
				.setAuthor(`${prefix}help <command>`)
				.setTitle(`Bot Command List`)
			embededPages(message, embed, array, "**Categories**: ");
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command)
				return message.reply('that\'s not a valid command!');

			if(command.guildOnly) data.push(`Usable in **GUILD ONLY**`);
			if(command.dmOnly) data.push(`Usable in **DM ONLY**`);
			if(command.category) data.push(`**Category:** ${command.category}`);
			data.push(`**Name**: ${command.name}`);
			if(command.aliases) data.push(`**Aliases**: ${command.aliases.join(', ')}`);
			if(command.description) data.push(`**Description**: ${command.description}`);
			if(command.usage) data.push(`**Usage**: ${prefix}${command.name} ${command.usage}`);
			if(command.example) data.push(`**Example**: ${prefix}${(command.example).join(`\n${prefix}`)}`);

			data.push(`**Cooldown**: ${command.cooldown || 3} second(s)`);

			let helpE = new Discord.MessageEmbed()
				.setColor("#36393f")
				.setAuthor(`Command: ${prefix}${command.name} ${command.usage ? command.usage : ''}`)
				.setDescription(data, {split: true})
				.setFooter("Tutorial Discord.js bot by - notbeer")
				.setTimestamp();
			message.channel.send(helpE);
		};
	},
};
