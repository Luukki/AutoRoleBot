const Discord = require("discord.js");
const bot = new Discord.Client();

// Preset variables
const token = "Njg3Mzc2MjU5NDQ5MzU2MzYy.XtZ5hg.GUzo-NOyuezaA8dk1RgW3DHo_VI";
const prefix = "%";

class Variables // class to store "global" variables TODO: This is a VERY ugly solution as this really only allows the bot to work on 1 server at a time
{
	constructor(prefix) 
	{
		this.prefix = prefix;
		this.enabled = false;
		this.roleName = null;
	}
}

function Commands(msg) 
{
	let command = msg.content.split(" "); // Splits the command to parts from spaces and stores the values in an array called "command"
	command[0] = command[0].slice(1); // removes the prefix from the command as it is useless now
	switch(command[0].toLowerCase())
	{
		case "toggle": // Toggles the bot on and off
		{
			v.enabled = !v.enabled;
            if(v.enabled) 
				msg.channel.send("The bot is now on!");
			else
				msg.channel.send("The bot is now off!");
			break;
		}
		case "prefix": // Changes the prefix
		{
			if(command[1].charAt(0) != ' ' || command[1] != null)
			{
				v.prefix =  command[1].charAt(0);
				msg.channel.send("Prefix changed to `" + v.prefix + "`");
				break;
			}
			else
			{
				msg.channel.send("Invalid prefix given!");
			}
		}
		case "setrole": // Defines the role to add new users to
		{
			if(command[1] === "null")
			{
				v.roleName = null;
				msg.channel.send("Set the role to nothing");
				break;
			}
			if(msg.guild.roles.cache.find(role => role.name === msg.content.substr(9)) != null)
			{
				v.roleName = msg.content.substr(9);
				msg.channel.send("Changed the default role to: `" + v.roleName + "`");
				break;
			}
			else
			{
				msg.channel.send("That role doesn't exist!");
				break;
			}
		}
	}
}

v = new Variables(prefix);

bot.on("ready", () => {
	console.log("Logged in as " + bot.user.tag) // TODO: This line should be made cleaner as well.
});

bot.on("message", msg => {
	if(msg.author.id === bot.user.id) // Ignore messages from the bot itself
		return;
	if(msg.content.toLowerCase().startsWith(v.prefix)) // Forward the messages with the correct prefix to a separate function
	{
		if (!msg.member.hasPermission("ADMINISTRATOR"))
		{
		msg.channel.send("You have no permission to use this command! :no_entry_sign: \nThis incident will be reported! :angry:");
		console.log(msg.author.tag + "  Tried to use the a command without permission!");
		return;
		}
		else
			Commands(msg);
	}

});

bot.on("guildMemberAdd", member => { // Adds the role to the new member
	if(v.enabled) // Checks if the bot is on
	{
		let role = member.guild.roles.cache.find(role => role.name === v.roleName);
		member.roles.add(role);
	}
});

bot.login(token);
