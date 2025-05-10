const { Client, GatewayIntentBits, Collection } = require("discord.js");
const config = require("./config.json");
const loadCommands = require("./src/structures/commands");
const loadEvents = require("./src/structures/events");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    presence: {
        status: "online"
    }
});

client.commands = new Collection();

(async () => {
    await loadCommands(client);
    await loadEvents(client);

    client.login(config.token);
})();

client.once("ready", () => {
    console.log(`Bot is ready as ${client.user.tag}`);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1);
});

process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.error("Uncaught Exception Monitor:", error, origin);
});

process.on("warning", (warning) => {
    console.warn("Warning:", warning);
});
