const Command = require("../modules/commands/command");
const { Interaction, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = class RemindCommand extends Command {
    constructor(client) {
        super(client, {
            name: "remind",
            description: "Set a reminder",
            permissions: [],
            staff_only: true,
            dev_only: false,
            internal: true,
            options: [
                {
                    name: "duration",
                    description: "The duration until the reminder is triggered",
                    required: true,
                    type: Command.option_types.STRING
                },
                {
                    name: "message",
                    description: "The message to send",
                    required: true,
                    type: Command.option_types.STRING
                }
            ]
        });
    }

    /**
     * @param {Interaction} interaction
     * @returns {Promise<void|any>}
     */
    async execute(interaction) {
        var reminderProfile = await db.models.Reminder.findAll({
            where: { user_id: interaction.user.id }
        });

        if (reminderProfile.length >= 5) {
            return await interaction.reply({
                content: "You have too many reminders, you can clear them using `/reset-reminders`",
                ephemeral: true
            });
        }

        var random = "abcdefghijklmnopqrstuvwxyz0123456789";
        var checkId = true;
        var id = "";

        while (checkId) {
            id = "";

            for (var i = 0; i < 7; i++)
                id += random.charAt(Math.floor(Math.random() * (random.length - 1)));

            checkId = await db.models.Reminder.findOne({
                where: { reminder_id: id }
            });
        }

        const duration = ms(interaction.options.getString("duration"));
        const message = interaction.options.getString("message");

        const timestampAfter = parseInt((Date.now() + duration) / 1000);
        const timestampBefore = parseInt(Date.now() / 1000);

        await db.models.Reminder.create({
            user_id: interaction.user.id,
            reminder_id: id,
            channel_id: interaction.channel.id,
            message: message,
            before: timestampBefore,
            after: timestampAfter
        });

        global[`reminder_${interaction.user.id}_${id}`] = setTimeout(async () => {
            await interaction.channel.send({
                content: interaction.member.toString(),
                embeds: [
                    new MessageEmbed()
                        .setColor(config.colors.default_color)
                        .setTitle("Reminder")
                        .setDescription(
                            `You asked me to give you a reminder <t:${timestampBefore}:R> (<t:${timestampBefore}:f>)`
                        )
                        .addField("Reminder", message)
                ]
            });

            var reminderToRemove = await db.models.Reminder.findOne({
                where: {
                    user_id: interaction.user.id,
                    reminder_id: id
                }
            });

            if (reminderToRemove) reminderToRemove.destroy();

            delete global[`reminder_${interaction.user.id}_${id}`];
        }, duration);

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor(config.colors.default_color)
                    .setDescription(
                        `Okay! I will remind you in <t:${timestampAfter}:R> (<t:${timestampAfter}:f>)`
                    )
                    .addField("Reminder", message)
            ],
            ephemeral: true
        });
    }
};
