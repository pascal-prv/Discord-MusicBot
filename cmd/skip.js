const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if(!message.member.voiceChannel) return message.channel.send("`❌` | Error » You're not in a voice room.")
    if(!serverQueue) return message.channel.send("`❌` | Error » No Music in the queue.")
    if(serverQueue) {
        serverQueue.connection.dispatcher.end();
        message.channel.send("`✅` | The current music has been skipped !")
        
    }
}