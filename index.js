const { Client, Collection, Intents } = require('discord.js');
const { readdirSync } = require('fs');
const chalk = require('chalk');
const functions = require('../modules/functions.js');
require('dotenv').config();

const intents = [
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_MESSAGES,
];

const client = new Client({ retryLimit: 3, intents: intents });
console.log(chalk.grey('[main] Initialized music client.'));

client.commands = new Collection();
const commandFiles = readdirSync(`./commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
console.log(chalk.grey(`[cmnd] Loaded ${client.commands.size} commands.`));

client.queue = new Map();

client.once('ready', () => {
	client.user.setActivity('to the sounds of the universe.', { type: 'LISTENING' });
	console.log(chalk.blueBright(`[almu] Ready to play on ${client.guilds.cache.size} servers!`));
});

client.on('messageCreate', async (message) => {
	if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(process.env.PREFIX)) return;

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	await message.channel.sendTyping();

	console.log(chalk.yellow(`[cmnd] ${message.author.tag} ran '${command.name} ${args.join(' ')}'`));
	try {
		await command.execute(client, message, args, functions);
	} catch (error) {
		console.log(chalk.red(`[main] An error has occured in '${command.name} ${args.join(' ')}'!`));
		console.log(chalk.redBright(error.stack));
		message.channel.send(functions.simpleEmbed('', `I'm sorry, something went wrong. Please contact <@${process.env.OWNER_ID}> if this issue persists!`, '#FF0000'));
	}
});

process.on('unhandledRejection', error => {
	console.error(chalk.red('[main] Unhandled promise rejection:'));
	console.error(chalk.redBright('[----]', error));
});

process.on('uncaughtException', error => {
	console.error(chalk.red('[main] Uncaught exception:'));
	console.error(chalk.redBright('[----]', error));
});

client.login();