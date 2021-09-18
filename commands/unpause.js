const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'unpause',
	description: 'Unpauses the currently playing track.',
	async execute(client, message, args, functions) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.channel.send(functions.simpleEmbed('No voice channel!', 'You have to connect to a voice channel to use this command.', '#FF0000'));
		}
		const connection = getVoiceConnection(voiceChannel.guild.id);
		const player = connection.state.subscription.player;
		player.unpause();
		return message.react('▶️');
	},
};