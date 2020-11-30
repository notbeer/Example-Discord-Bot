const Discord = require("discord.js")
const botsettings = require('../bot_settings/settings.json');
const fs = require("fs")

module.exports.run = async (bot, message, arg) => {
    //moderation prefix
    let prefixes = JSON.parse(fs.readFileSync("./bot_settings/prefixes.json", "utf8"));
    if(!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: botsettings.prefix
        }
    }
    let prefix = prefixes[message.guild.id].prefix;

    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) {
        return;
    };
    const setpre = message.content.split(" ").slice(1).join(" ");
    prefixes[message.guild.id] = {
        prefix: setpre,
    }
    if(!setpre) return message.reply("Please enter the new server prefix");

    fs.writeFile("./bot_settings/prefixes.json", JSON.stringify(prefixes), (err) => {
        if (err) console.log(err)
    })
    let icon = message.guild.iconURL({ dynamic: true });
    let prefixEmbed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.guild.name, icon)
        .setTitle('Prefix')
        .setDescription(`Changed server Prefix to **${setpre}**`)
        .setThumbnail(icon)
        .setFooter(`${bot.user.username}`)
        .setTimestamp();
            message.channel.send({embed: prefixEmbed})
}

module.exports.config = {
    name: "Prefix",
    aliases: ["prefix", "setprefix", "changeprefix"]
}