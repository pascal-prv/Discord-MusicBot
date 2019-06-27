const {RichEmbed} = require('discord.js')

module.exports.run = (client, message, args) => {
    var p = client.config.prefix
    const embed = new RichEmbed()
    .setTitle(":information_source: Help for MusicBot")
    .setDescription(`» **${p}help** - See the help page.\n» **${p}play** - Start a music.\n» **${p}stop** - Stop the music.\n» **${p}skip** - Skip the music\n» **${p}pause** - Pause the music\n» **${p}resume** - Resume the music\n» **${p}queue** - See the list of music\n» **${p}volume** - Change the volume\n» **${p}radio** - Listen to a radio\n   \n**Github** » https://github.com/Maxsteel91Dev/Discord-MusicBot`)
    .setColor("#ec6116")
    .setAuthor(`Requested by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
    .setFooter(`Created by ${client.users.get("320852984365973504").username}#${client.users.get("320852984365973504").discriminator}`, client.users.get("320852984365973504").avatarURL)
    .setTimestamp()
    message.channel.send(embed)
}