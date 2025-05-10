const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const config = require("../../config.json");

module.exports = async (client) => {
    const commands = [];
    const commandFiles = fs.readdirSync(path.join(__dirname, "../commands")).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        if (command && command.data) {
            commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
        }
    }

    const rest = new REST({ version: "10" }).setToken(config.token);

    try {
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );
        console.log("Commands registered.");
    } catch (error) {
        console.error("Error registering slash commands:", error);
    }
};
