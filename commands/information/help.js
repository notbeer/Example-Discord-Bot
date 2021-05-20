const Discord = require('discord.js');
const botsettings = require('../../bot_settings/settings.json');

module.exports = {
	botpermissions: ['EMBED_LINKS'],
	category: 'Information',
	name: 'help',
	description: 'List of all of my commands and the information on the command!',
	aliases: [
		'commands'
	],
	usage: '[command name]',
	example: [
		'help',
		'help userinfo'
	],
	cooldown: 3,
	async execute(message, args, bot) {
        const prefix = botsettings.prefix;

		const { commands } = message.client;

		if (!args.length) {
			const allHelpCommand = new Discord.MessageEmbed()
				.setColor("#2F3136")
				.setAuthor(bot.user.username, bot.user.displayAvatarURL({ dynamic : true }))
				.setTitle(`${bot.user.username} Commands`)
				.setDescription(`Type \`${prefix}help [command]\` to find out more details about the command.\n\u200b`)
				.addField("🎲 Fun", commands.filter((cmd) => cmd.category == "Fun").map((cmd) => `\`${cmd.name}\``).sort().join(", ") || "`No commands found`", true)
				.addField("📚 Information", commands.filter((cmd) => cmd.category == "Information").map((cmd) => `\`${cmd.name}\``).sort().join(", ") || "`No commands found`", true)
				.addField("🧭 Misc", commands.filter((cmd) => cmd.category == "Misc").map((cmd) => `\`${cmd.name}\``).sort().join(", ") || "`No commands found`", true)
				.setTimestamp();
			message.author.send(allHelpCommand)
				.then(() => {
					if(message.channel.type !== 'dm') message.channel.send(`${message.author}, please check your DMs for the list of commands.`)
				}).catch(() => message.channel.send(`${message.author}, please enable DMs, so then I can send you the list of commands.`));
		} else {
			const command = commands.get(args[0] || args.join(' ')) || commands.find(c => c.aliases && c.aliases.includes(args[0] || args.join(' ')));
			if (!command) return message.channel.send('That\'s not a valid command!');

			const data = [];
			if(command.guildOnly) data.push(`Command usable in \`Guild\` only!`);
			if(command.dmOnly) data.push(`Command usable in \`DMs\` only!`);

			const helpE = new Discord.MessageEmbed()
				.setColor("#2F3136")
				.setAuthor(`Command: ${prefix}${command.name} ${command.usage ? command.usage : ''}`)
				.setDescription(data, {split: true})
			if(command.category) helpE.addField(`**Category:**`, `\`${command.category}\``, true);
			if(command.name) helpE.addField(`**Command:**`, `\`${command.name}\``, true);
			if(command.aliases) helpE.addField(`**Aliases:**`, `\`${command.aliases.join(', ')}\``, true);
			if(command.description) helpE.addField(`**Description:**`, `\`${command.description}\``, true);
			if(command.usage) helpE.addField(`**Usage:**`, `\`${prefix}${command.name} ${command.usage}\``, true);
			if(command.example) helpE.addField(`**Example:**`, `\`${prefix}${command.example.join(`\n${prefix}`)}\``, true);
			helpE.addField(`**Cooldown:**`, `\`${command.cooldown ? `${command.cooldown > 1 ? `${command.cooldown} seconds` : `${command.cooldown} second`}` : `0 second`}\``);
			message.channel.send(helpE);
		};
	},
};
