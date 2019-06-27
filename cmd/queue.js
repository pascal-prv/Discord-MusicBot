const discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if(!serverQueue) return message.channel.send("`❌` | Error » No Music in the queue.")
    if(serverQueue) {
        let number = 0;
        message.channel.send("`✅` | Here are the music in progress: \n```fix\n===   SERVER QUEUE   ===\n  \n"+serverQueue.songs.map(song => `${++number} - ${song.title}`).join("\n")+"```")
        console.log(serverQueue.songs.leng)
    }
}
