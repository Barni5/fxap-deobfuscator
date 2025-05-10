const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const ps = require("ps-node");
const config = require("../../config.json");

let isProcessing = false;

const dumpFolder = path.join(__dirname, "../../cfx/resources/dumpresource");
const cfxRoot = path.join(__dirname, "../../cfx");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cfx")
        .setDescription("Decrypt a CFX resource using your license key.")
        .addStringOption(option =>
            option.setName("license_key")
                .setDescription("Your keymaster license key")
                .setRequired(true)
        ),

    async execute(interaction, client) {
        if (interaction.channel.id !== config.channels.cfx) {
            return await interaction.reply({ content: "This command must be used in the provided channel.", ephemeral: true });
        }

        if (isProcessing) {
            return await interaction.reply({ content: "The bot is already processing a file.", ephemeral: true });
        }

        const licenseKey = interaction.options.getString("license_key");

        isProcessing = true;

        await interaction.reply("Please upload your `.fxap` and `.lua` files in **this channel** within 60 seconds.");

        const filter = m => 
            m.author.id === interaction.user.id &&
            m.attachments.size > 0;

        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 60000 });

        collector.on("collect", async msg => {
            const attachments = Array.from(msg.attachments.values());
            const fxapFile = attachments.find(a => a.name.toLowerCase().includes("fxap"));
            const luaFile = attachments.find(a => a.name.toLowerCase().endsWith(".lua"));

            if (!luaFile) {
                isProcessing = false;
                return interaction.followUp({ content: "Missing `.lua` file.", ephemeral: true });
            }

            if (!fxapFile ) {
                isProcessing = false;
                return interaction.followUp({ content: "Missing `.fxap` file.", ephemeral: true });
            }

            const { default: fetch } = await import("node-fetch");

            const fxapPath = path.join(dumpFolder, ".fxap");
            const luaPath = path.join(dumpFolder, "server.lua");

            const fxapBuffer = Buffer.from(await (await fetch(fxapFile.url)).arrayBuffer());
            fs.writeFileSync(fxapPath, fxapBuffer);

            const luaBuffer = Buffer.from(await (await fetch(luaFile.url)).arrayBuffer());
            fs.writeFileSync(luaPath, luaBuffer);

const cfgContent = `
endpoint_add_tcp "0.0.0.0:30120"
endpoint_add_udp "0.0.0.0:30120"
sv_scriptHookAllowed 0
sv_enforceGameBuild 2699
sv_maxclients 5
sv_hostname "Rp"
sets sv_projectName "Rp"
sets sv_projectDesc "https://github.com/Barni5"
set steam_webApiKey "none"
sv_licenseKey "${licenseKey}"
ensure dumpresource
`;

            fs.writeFileSync(path.join(cfxRoot, "server.cfg"), cfgContent);

            await interaction.followUp("Trying my best mate...");

            try {
                await stopFxServer();
                runCommand("server\\FxServer.exe +exec server.cfg", path.join(process.cwd(), "cfx"));
                setTimeout(async () => {
                    const nondecryptedLuac = "C:\\barni5\\barni5.luac";
                    const decryptedLua = "C:\\barni5\\decrypt.lua";

                    await runCommand("java -jar unluac54.jar barni5.luac > decrypt.lua", "C:\\barni5");
                    const file = new AttachmentBuilder(decryptedLua);
                    await interaction.channel.send({ content: `Here is your decrypted file, <@${interaction.user.id}>`, files: [file] });
                    await deleteFile(decryptedLua);
                    await deleteFile(nondecryptedLuac);
                    isProcessing = false;
                }, 3000);

            } catch (err) {
                console.error(err);
                isProcessing = false;
                await interaction.followUp({ content: "An error occurred during decryption." });
            }
        });

        collector.on("end", collected => {
            if (collected.size === 0) {
                isProcessing = false;
                interaction.followUp({ content: "No files received in time. Command cancelled." });
            }
        });
    }
};

function stopFxServer() {
    return new Promise((resolve, reject) => {
        ps.lookup({ command: "FxServer.exe" }, (err, result) => {
            if (err) return reject(err);
            if (result.length > 0) {
                exec(`taskkill /F /T /PID ${result[0].pid}`, error => {
                    if (error) return reject(error);
                    resolve();
                });
            } else resolve();
        });
    });
}

function runCommand(cmd, cwd) {
    return new Promise(resolve => {
        exec(cmd, { cwd }, () => resolve());
    });
}

function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, err => (err ? reject(err) : resolve()));
    });
}
