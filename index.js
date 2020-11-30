const Discord = require('discord.js');
const settings = require('./bot_settings/settings.json');
const colors = require("./bot_settings/colors.json");

const bot = new Discord.Client({ disableEveryone: true});

//Login
bot.login(settings.token);

//random status 
bot.on("ready", async() => {
    function randomstatus() {
        let status = [
            `Over ${bot.users.cache.size} users!`,
            `Over ${bot.guilds.cache.size} servers!`,
            "By notbeer",
            "test",
            "lol"
        ]
        let rstatus = Math.floor(Math.random() * status.length)
            bot.user.setActivity(status[rstatus], {type: "STREAMING", url: "https://twitch.tv/sidecraft86"});
    };
    //1000 = 1 second 
    setInterval(randomstatus, 2000)

    console.log(`${bot.user.username} is online`)
})

//command handler

const fs = require("fs");
bot.command = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
 
  if(err) console.log(err)

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0) {
      return console.log("Couldn't Find Commands in 'commands' folder!");
  }

  jsfile.forEach((f, i) => {
      let pull = require(`./commands/${f}`);
      bot.command.set(pull.config.name, pull);
      pull.config.aliases.forEach(alias => {
          bot.aliases.set(alias, pull.config.name)
        });
    });
});

//prefix handler
bot.on("message", async message => {

    if(message.author.bot || message.channel.type  === "dm") return;

    //prefix
    let prefixes = JSON.parse(fs.readFileSync("./bot_settings/prefixes.json", "utf8"));
    if(!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefix: settings.prefix,
        }
    }
    let prefix = prefixes[message.guild.id].prefix;

    let icon = message.guild.iconURL({size: 2048});
    if (message.content.includes(bot.user.id)) {
        let mentionb = new Discord.MessageEmbed()
        .setColor(colors.lime)
        .setAuthor(message.guild.name, icon)
        .setTitle(`Type ${prefix}help`)
        .setDescription("My prefix in this server is " + `**${prefix}**`)
        .setThumbnail(icon)
        .setFooter(`${bot.user.username}`)
        .setTimestamp();
          message.delete()
            message.channel.send({embed: mentionb})
            .then(msg => {
              msg.delete({ timeout: 10000})
              })
              .catch(console.error);
        }
    
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.command.get(cmd.slice(prefix.length)) || bot.command.get(bot.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(bot, message, args)
});