import type { Interaction } from 'discord.js';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export async function issueTypeSubmitHandler(interaction: Interaction) {
  if (!interaction.isStringSelectMenu())
    return;

  const issueType = interaction.values[0];

  const modal = new ModalBuilder()
    .setCustomId(`issueCommentSubmit-${issueType}`)
    .setTitle('Report Issue');

  const issueReportComment = new TextInputBuilder()
    .setCustomId('issueReportComment')
    .setLabel('Add your comment on the issue below')
    .setStyle(TextInputStyle.Paragraph)
    .setMaxLength(1000)
    .setMinLength(5)
    .setRequired(true);

  const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(issueReportComment);

  modal.addComponents(firstActionRow);

  await interaction.showModal(modal);
}
