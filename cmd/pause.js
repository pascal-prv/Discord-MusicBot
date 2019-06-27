const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if(!message.member.voiceChannel) return message.channel.send("`❌` | Error » You're not in a voice room.")
    if(!serverQueue) return message.channel.send("`❌` | Error » No music in the queue.")
    if (serverQueue.playing === true) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send("`✅` | The current music has been paused !")
    }
    if (!serverQueue.playing === true) {
        message.channel.send("`❌` | Error » The music has already paused !")
    }
}