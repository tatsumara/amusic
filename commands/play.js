const voice = require('@discordjs/voice');
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

		const connection = voice.joinVoiceChannel({
			channelId: voiceChannel.id,
			guildId: voiceChannel.guild.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
		});

		const info = await playdl.video_basic_info(args[0]);
		const stream = await playdl.stream_from_info(info);
		const player = voice.createAudioPlayer();
		const resource = voice.createAudioResource(stream.stream, {
			inputType: stream.type,
		});
		connection.subscribe(player);
		player.play(resource);

		const playerEmbed = {
			title: 'Now playing:',
			url: info.video_details.url,
			description: `"${info.video_details.title}"`,
			fields: [
				{
					name: 'Length:',
					value: info.video_details.durationRaw,
					inline: true,
				},
				{
					name: 'Upload date:',
					value: info.video_details.uploadedDate,
					inline: true,
				},
			],
			footer: {
				text: info.video_details.channel.name || 'Unknown',
			},
		};
		return message.channel.send({ embeds: [playerEmbed] });
	},
};