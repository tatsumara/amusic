const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const playdl = require('play-dl');

module.exports = {
	name: 'play',
	description: 'Adds music from a URL to the queue or searches on YouTube.',
	usage: 'play <url or search term>',
	aliases: ['queue', 'add'],
	args: true,
	async execute(client, message, args, functions) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.channel.send(functions.simpleEmbed('No voice channel!', 'You have to connect to a voice channel to use this command.', '#FF0000'));
		}
		const connection = joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		});
		const stream = await playdl.stream(args[0]);
		const player = createAudioPlayer();
		const resource = createAudioResource(stream.stream, {
			inputType: stream.type,
		});
		connection.subscribe(player);
		player.play(resource);
	},
};