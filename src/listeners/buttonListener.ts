import type {
  Client,
  ModalActionRowComponentBuilder,
} from 'discord.js';
import { ActionRowBuilder, MessageFlags, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { overseerrApi } from '../helpers/apis/overseerr/overseerrApi.js';
import { checkUserPermission } from '../helpers/permissionCheck.js';
import { Permission } from '../helpers/permissions.js';
import { checkUserQuota, formatQuotaMessage } from '../helpers/quotaCheck.js';
import { updateEmbed } from '../outbound/updateButtons.js';

function prepareSeasonRequestData(selectedSeasons: string[]): any {
  if (selectedSeasons.includes('all')) {
    return 'all';
  }

  const seasonNumbers = selectedSeasons
    .filter(season => season !== 'all')
    .map(season => Number.parseInt(season, 10))
    .filter(num => !Number.isNaN(num));

  if (seasonNumbers.length === 0) {
    return [1];
  }

  return seasonNumbers;
}

export function buttonListener(client: Client): void {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton())
      return;

    const buttonID = interaction.message.embeds[0].fields.find(
      field => field.name === 'Request ID' || field.name === 'Issue ID' || field.name === 'Media ID',
    );

    if (!buttonID) {
      console.error('ID field not found in embed.');
      return;
    }

    const uniqueId = buttonID.value;

    switch (interaction.customId) {
      case 'decline': {
        const { hasPermission } = await checkUserPermission(
          interaction,
          Permission.MANAGE_REQUESTS,
          'You do not have permission to decline requests.',
        );

        if (hasPermission) {
          try {
            const url = `/request/${uniqueId}/decline`;
            await overseerrApi(url, 'POST');

            await interaction.deferUpdate();
          }
          catch (error) {
            console.error('Error declining request:', error);
            await interaction.reply({
              content: 'An error occurred while declining the request.',
              flags: MessageFlags.Ephemeral,
            });
          }
        }
        break;
      }
      case 'approve': {
        const { hasPermission } = await checkUserPermission(
          interaction,
          Permission.MANAGE_REQUESTS,
          'You do not have permission to approve requests.',
        );

        if (hasPermission) {
          try {
            const url = `/request/${uniqueId}/approve`;
            await overseerrApi(url, 'POST');

            await interaction.deferUpdate();
          }
          catch (error) {
            console.error('Error approving request:', error);
            await interaction.reply({
              content: 'An error occurred while approving the request.',
              flags: MessageFlags.Ephemeral,
            });
          }
        }
        break;
      }
      case 'closeIssue': {
        const { hasPermission } = await checkUserPermission(
          interaction,
          Permission.MANAGE_ISSUES,
          'You do not have permission to close issues.',
        );

        if (hasPermission) {
          try {
            const url = `/issue/${uniqueId}/resolved`;
            await overseerrApi(url, 'POST');
            await updateEmbed(interaction.message, interaction, 'resolved');
          }
          catch (error) {
            console.error('Error closing issue:', error);
            await interaction.reply({
              content: 'An error occurred while closing the issue.',
              flags: MessageFlags.Ephemeral,
            });
          }
        }
        break;
      }
      case 'comment': {
        const { hasPermission } = await checkUserPermission(
          interaction,
          Permission.MANAGE_ISSUES,
          'You do not have permission to comment on issues.',
        );

        if (hasPermission) {
          const modal = new ModalBuilder()
            .setCustomId('issueCommentResponse')
            .setTitle('Add Comment');

          const commentInput = new TextInputBuilder()
            .setCustomId('commentInput')
            .setLabel('Add your comment on the issue below')
            .setStyle(TextInputStyle.Paragraph)
            .setMaxLength(1000)
            .setMinLength(5)
            .setRequired(true);

          const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(commentInput);

          modal.addComponents(actionRow);
          await interaction.showModal(modal);
        }
        break;
      }
      case 'requestMedia':
      case 'requestTvWithSeasons': {
        const { hasPermission, overseerrId } = await checkUserPermission(
          interaction,
          Permission.REQUEST,
          'You do not have permission to request media.',
        );

        if (hasPermission && overseerrId) {
          try {
            const requestType = interaction.message.interaction?.commandName?.split('_')[1] || 'tv';
            const mediaType = requestType === 'movie' ? 'movie' : 'tv';

            const quotaCheck = await checkUserQuota(Number.parseInt(overseerrId, 10), mediaType);

            if (!quotaCheck.hasQuota) {
              await interaction.reply({
                content: formatQuotaMessage(quotaCheck),
                flags: MessageFlags.Ephemeral,
              });
              return;
            }

            const url = `/request/`;

            const requestBody: any = {
              mediaType: requestType,
              mediaId: Number.parseInt(uniqueId, 10),
            };

            if (interaction.customId === 'requestTvWithSeasons') {
              const seasonField = interaction.message.embeds[0].fields.find(
                field => field.name === 'Requested Seasons',
              );

              if (seasonField) {
                if (seasonField.value === 'All Seasons') {
                  requestBody.seasons = 'all';
                }
                else {
                  const seasonStrings = seasonField.value
                    .split(', ')
                    .map(season => season.replace('Season ', ''));

                  requestBody.seasons = prepareSeasonRequestData(seasonStrings);
                }
              }
            }

            await overseerrApi(url, 'POST', requestBody, Number.parseInt(overseerrId, 10));

            if (quotaCheck.limit !== Infinity && quotaCheck.limit > 0) {
              const updatedQuota = await checkUserQuota(Number.parseInt(overseerrId, 10), mediaType);
              const quotaMessage = formatQuotaMessage(updatedQuota);
              await interaction.reply({
                content: `✅ **Request submitted successfully!**\n\n${quotaMessage}`,
                flags: MessageFlags.Ephemeral,
              });
            }

            await updateEmbed(interaction.message, interaction, 'requested');
          }
          catch (error) {
            console.error('Error requesting media:', error);
            await interaction.reply({
              content: 'An error occurred while submitting your request.',
              flags: MessageFlags.Ephemeral,
            });
          }
        }
        break;
      }
      default: {
        console.error(`No handler found for button: ${interaction.customId}`);
      }
    }
  });
}
