// this module just stores a bunch of client.functions i use often

const Discord = require('discord.js');
module.exports = {
	simpleEmbed(title, desc, color, image) {
		const embed = new Discord.MessageEmbed()
			.setTitle(title)
			.setDescription(desc || '')
			.setColor(color)
			.setImage(image);
		return { embeds: [embed] };
	},
};
