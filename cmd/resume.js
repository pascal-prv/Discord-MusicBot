const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if(!message.member.voiceChannel) return message.channel.send("`❌` | Error » You're not in a voice room.")
    if(!serverQueue) return message.channel.send("`❌` | Error » No music in the queue.")
    if (serverQueue.playing === false) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return message.channel.send("`✅` | The current music has been resumed !")
    }
    if (serverQueue.playing === true) {
        return message.channel.send("`❌` | Error » The music is already playing. So you can't resume this music")

    }
}