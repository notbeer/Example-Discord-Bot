const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
    guildOnly: true,
    botpermissions: ['EMBED_LINKS'],
    category: 'Misc',
    name: 'serverinfo',
    aliases: [
        "server",
        "guild",
    ],
    description: 'Get information about the guild',
    cooldown: 60,
	async execute(message, args, bot) {
        function trimArray(arr, maxLen = 20) {
            if (arr.length > maxLen) {
                const len = arr.length - maxLen;
                arr = arr.slice(0, maxLen);
                arr.push(`${len} more...`);
            }
            return arr;
        }
        let icon = message.guild.iconURL({ dynamic: true }); // Server Avatar
    
        const region = {
          "brazil": "Brazil",
          "eu-central": "Central Europe",
          "singapore": "Singapore",
          "london": "London",
          "russia": "Russia",
          "japan": "Japan",
          "hongkong": "Hongkong",
          "sydney": "Sydney",
          "southafrica": "South Africa",
          "us-central": "U.S. Central",
          "us-east": "U.S. East",
          "us-south": "U.S. South",
          "us-west": "U.S. West",
          "eu-west": "Western Europe",
          "europe": "Europe",
          "india": "India"
        }
    
        //verification
        const verificationLevels = {
            NONE: 'None',
            LOW: 'Low',
            MEDIUM: 'Medium',
            HIGH: 'High (╯°□°）╯︵ ┻━┻',
            VERY_HIGH: 'Very High ┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        };
    
        //filter
        const filterLevels = {
            DISABLED: 'Off',
            MEMBERS_WITHOUT_ROLES: 'No Role',
            ALL_MEMBERS: 'Everyone'
        };
        
        // Members
        let member = message.guild.members;
        let offline = member.cache.filter(m => m.user.presence.status === "offline").size,
            online = member.cache.filter(m => m.user.presence.status === "online").size,
            idle = member.cache.filter(m => m.user.presence.status === "idle").size,
            dnd = member.cache.filter(m => m.user.presence.status === "dnd").size,
            robot = member.cache.filter(m => m.user.bot).size,
            people = member.cache.filter(m => !m.user.bot).size,
            total = message.guild.memberCount;
        
        // Channels
        let channels = message.guild.channels;
        let text = channels.cache.filter(r => r.type === "text").size,
            vc = channels.cache.filter(r => r.type === "voice").size,
            category = channels.cache.filter(r => r.type === "category").size,
            totalchan = text + vc
    
        //roles and emojis count
        /*
        const roles = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        */
        const roles = message.guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1);
        const emojis = message.guild.emojis.cache;
        
        // Region
        let location = region[message.guild.region];
        
        const serverinfo = new Discord.MessageEmbed()
            .setColor("#36393f")
            .setThumbnail(icon)
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle(message.guild.name)
            .setDescription(`**Server ID: ** \`${message.guild.id}\` \n**Server Region: ** \`${location}\``)
            .addField(`**Verification Level: ** \`${verificationLevels[message.guild.verificationLevel]}\``, `**Explicit Filter:  **\`${filterLevels[message.guild.explicitContentFilter]}\``)
            .addField(`**Server Boost Tier: ** \`${message.guild.premiumTier ? `Level ${message.guild.premiumTier}` : 'Level 0'}\``, `\n**Total Boosts: **\`${message.guild.premiumSubscriptionCount || '0'}\``)
            .addField(`**Server Owner: **`, `\`${message.guild.owner.user.tag}\` (\`${message.guild.owner.user.id}\`)`)
            .addField("**Date Created: **", moment(message.guild.createdAt).format("LLLL") + "" + `\nMade **${Math.floor((Date.now() - message.guild.createdAt) / 86400000)}** day(s) ago`)
            .addField(`**Total Category: ** ${category}`, `Total Channels: ${totalchan} \nText: ${text} \nVoice: ${vc}`)
            .addField(`**Total Emojis: ** ${emojis.size}`, `Regular Emojis: ${emojis.filter(emoji => !emoji.animated).size} \nAnimated Emojis: ${emojis.filter(emoji => emoji.animated).size}`)
            .addField(`**Total Users: ** ${total}`, `\nMembers: ${people} \nBots: ${robot} \nOnline: ${online} \nIdle: ${idle} \nDo Not Disturb: ${dnd} \nOffline: ${offline}`)
            .addField(`**Roles: ** [${roles.length - 1}]`, roles.length < 20 ? roles.join(', ') : trimArray(roles).join(', '))
            .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL())
            .setTimestamp()
        message.channel.send({embed: serverinfo})
	},
};