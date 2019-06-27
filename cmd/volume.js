const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if(!message.member.voiceChannel) return message.channel.send("`❌` | Error » You're not in a voice room.")
    if(!serverQueue) return message.channel.send("`❌` | Error » No Music in the queue.")
    if(serverQueue) {
        if(!args[0]) return message.channel.send("`✅` | Volume: `"+serverQueue.volume+"%`")
        if(args[0] <= 100) {
            serverQueue.volume = args[0];
            serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
            message.channel.send("`✅` | The Volume has been set to: `"+serverQueue.volume+"%`")
        }
        if(args[0] > 100) {
            message.channel.send("`❌` | Error » The volume must be between 0 and 100.") 
        }
    }
}