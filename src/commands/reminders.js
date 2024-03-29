const Command = require("../modules/commands/command");
const { Interaction, MessageEmbed } = require("discord.js");

module.exports = class RemindersCommand extends Command {
    constructor(client) {
        super(client, {
            name: "reminders",
            description: "View your reminders",
            permissions: [],
            staff_only: true,
            dev_only: false,
            internal: true,
            options: []
        });
    }

    /**
     * @param {Interaction} interaction
     * @returns {Promise<void|any>}
     */
    async execute(interaction) {
        var reminders = await db.models.Reminder.findAll({
            where: { user_id: interaction.user.id }
        });

        const embed = new MessageEmbed().setColor(config.colors.default_color).setTitle("Reminders");

        if (reminders.length === 0) {
            embed.setDescription("You do not have any reminders set!");
        } else {
            await reminders.forEach(reminder => {
                embed.addField(`\`${reminder.reminder_id}\` <t:${reminder.after}:f>`, reminder.message);
            });
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
