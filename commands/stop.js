const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
	name: 'stop',
	description: 'Stops the player and leaves the channel.',
	aliases: ['quit', 'die', 'bye', 'leave'],
	async execute(client, message, args, functions) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			return message.channel.send(functions.simpleEmbed('No voice channel!', 'You have to connect to a voice channel to use this command.', '#FF0000'));
		}
		const connection = getVoiceConnection(voiceChannel.guild.id);
		const player = connection.state.subscription.player;
		player.stop();
		connection.destroy();
		return message.react('👋');
	},
};