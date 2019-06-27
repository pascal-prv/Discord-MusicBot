const discord = require('discord.js');
const ytdl = require('ytdl-core');
const youtube = require('simple-youtube-api');

module.exports.run = async (client, message, args) => {
    const ytb = new youtube(client.config.ytapikey);
    const p = client.config.prefix
    const url = args[0] ? args[0].replace(/<.+>/g, "$1") : "";

    var name = args.join(' ');
    if(!name) return message.channel.send("`❌` | Syntax » `"+p+"play <Link or name>` (No need to put <>).")
    if(!message.member.voiceChannel) return message.channel.send("`❌` | Error » You're not in a voice room.")
    const perm = message.member.voiceChannel.permissionsFor(message.client.user)
    if(!perm.has("CONNECT")) return message.channel.send("`❌` | Error » I can't connect, check my permissions.")
    if(!perm.has("SPEAK")) return message.channel.send("`❌` | Error » I can't speak, check my permissions.")

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await ytb.getPlaylist(url);
        const videos = await playlist.getVideos();
        for (const video of Object.values(videos)) {
          const video2 = await ytb.getVideoByID(video.id);
          await handleVideo(video2, message, message.member.voiceChannel, true);
        }
        message.channel.send("`✅` | Playlist added: `"+playlist.title+"`.")
      } else {
        try {
          var video = await ytb.getVideo(url);
          if(video) return handleVideo(video, message, message.member.voiceChannel, false);
        } catch (error) {
          try {
            ytb.searchVideos(name, 10).then(found => {
              let index = 0;
              message.channel.send("`✅` | 10 results found: \n"+found.map(video2 => `**${++index} -** ${video2.title}`).join('\n'))
              message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, { max: 1, time: 20000, errors: ['time'] })
              .then(async answers => {
                  let index = parseInt(answers.first().content);
                  var vde = await ytb.getVideoByID(found[index-1].id)
                  return handleVideo(vde, message, message.member.voiceChannel);
              }).catch(err => {
                  return message.channel.send("`❌` | Elapsed time to choose the music.");
              });
            })
            
          } catch (err) {
            console.error(err);
            message.channel.send("`❌` | Error » No music found.")
          }
        }
      }

      async function handleVideo(video, message, voiceChannel, playlist = false) {
        const serverQueue = client.queue.get(message.guild.id);
          const song = {id: video.id,
            title: discord.escapeMarkdown(video.title),
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
          if (!serverQueue) {
        const queueConstruct = {textChannel: message.channel,voiceChannel: voiceChannel,connection: null,songs: [],volume: 5,playing: true};
    
            client.queue.set(message.guild.id, queueConstruct);
            queueConstruct.songs.push(song);
            try {
              var connection = await voiceChannel.join();
              queueConstruct.connection = connection;
              play(message.guild, queueConstruct.songs[0]);
            } catch (error) {
              console.error(`Error: ${error}`);
              client.queue.delete(message.guild.id);
              console.log(error)
              message.channel.send("`❌` | Error » "+error)
            }
          } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            if (playlist) return undefined;
            else {
            message.channel.send("`✅` | Music added: `"+song.title+"`.")
            }
          }
          return undefined;
      }
      
    function play(guild, song) {
        const voiceChannel = message.member.voiceChannel;
        const serverQueue = client.queue.get(guild.id);
        if (!song) {serverQueue.voiceChannel.leave();client.queue.delete(guild.id);return;}
    
        const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
            .on("end", reason => {
            if (!reason === "Stream is not generating quickly enough.") console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
          dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
          message.channel.send("`✅` | Music added: `"+song.title+"`.")}
}