const Command = require("../modules/commands/command");
const { Interaction } = require("discord.js");

module.exports = class ShutdownCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shutdown",
            description: "Shuts down the client",
            permissions: [],
            staff_only: false,
            dev_only: true,
            internal: true,
            options: []
        });
    }

    /**
     * @param {Interaction} interaction
     * @returns {Promise<void|any>}
     */
    async execute(interaction) {
        log.info("Shutting Down...");

        // prettier-ignore
        await interaction.reply({
            content: `Shutting down...`,
            ephemeral: true
        })
        .then(() => process.exit());
    }
};
