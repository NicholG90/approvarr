import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export async function updateEmbed(originalMessage: any, interaction: any, action: any) {
  switch (action) {
    case 'resolved': {
      const issueClosed = new ButtonBuilder()
        .setCustomId('issueClosed')
        .setDisabled(true)
        .setLabel(`Issue Closed by ${interaction.user.tag}`)
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(issueClosed);
      await interaction.update({
        components: [row],
      });
      break;
    }
    case 'comment': {
      const commentSubmitted = new ButtonBuilder()
        .setCustomId('commentSubmitted')
        .setDisabled(true)
        .setLabel(`Comment Submitted by ${interaction.user.tag}`)
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(commentSubmitted);
      await interaction.update({
        components: [row],
      });
      break;
    }
    case 'requested': {
      const requestSubmitted = new ButtonBuilder()
        .setCustomId('requestSubmitted')
        .setDisabled(true)
        .setLabel('Request Submitted')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(requestSubmitted);
      await interaction.update({
        components: [row],
      });
      break;
    }
    case 'report': {
      const reportSubmitted = new ButtonBuilder()
        .setCustomId('reportSubmitted')
        .setDisabled(true)
        .setLabel('Issue Report Submitted')
        .setStyle(ButtonStyle.Success);

      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(reportSubmitted);
      await interaction.update({
        components: [row],
      });
      break;
    }
    default: {
      console.error('Invalid action provided.');
    }
  }
}
