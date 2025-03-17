// Import the necessary modules
import {
    Client, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalActionRowComponentBuilder,
    MessageFlags,
} from 'discord.js';
import { overseerrApi } from '../helpers/apis/overseerr/overseerrApi';
import { updateEmbed } from '../outbound/updateButtons';
import { Permission } from '../helpers/permissions';
import { checkUserPermission } from '../helpers/permissionCheck';
import { getRequestDetails } from '../helpers/getRequestDetails';

export function buttonListener(client: Client): void {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isButton()) return;

        // Find the relevant ID field (Request, Issue, or Media)
        const buttonID = interaction.message.embeds[0].fields.find(
            (field) => field.name === 'Request ID' || field.name === 'Issue ID' || field.name === 'Media ID',
        );

        if (!buttonID) {
            console.error('ID field not found in embed.');
            return;
        }

        const mediaTitle = interaction.message.embeds[0].title;
        const uniqueId = buttonID.value;

        // Handle each button type
        switch (interaction.customId) {
            case 'decline': {
                const { hasPermission } = await checkUserPermission(
                    interaction,
                    Permission.MANAGE_REQUESTS,
                    'You do not have permission to decline requests.'
                );

                if (hasPermission) {
                    try {
                        const url = `/request/${uniqueId}/decline`;
                        await overseerrApi(url, 'POST');

                        await interaction.deferUpdate();
                    } catch (error) {
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
                    'You do not have permission to approve requests.'
                );

                if (hasPermission) {
                    try {
                        const url = `/request/${uniqueId}/approve`;
                        await overseerrApi(url, 'POST');

                        await interaction.deferUpdate();
                    } catch (error) {
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
                    'You do not have permission to close issues.'
                );

                if (hasPermission) {
                    try {
                        const url = `/issue/${uniqueId}/resolved`;
                        await overseerrApi(url, 'POST');
                        await updateEmbed(interaction.message, mediaTitle, interaction, 'resolved');
                    } catch (error) {
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
                    'You do not have permission to comment on issues.'
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
            case 'requestMedia': {
                const { hasPermission, overseerrId } = await checkUserPermission(
                    interaction,
                    Permission.REQUEST,
                    'You do not have permission to request media.'
                );

                if (hasPermission && overseerrId) {
                    try {
                        const requestType = interaction.message.interaction?.commandName.split('_')[1];
                        const url = `/request/`;
                        const requestBody = {
                            mediaType: requestType,
                            mediaId: parseInt(uniqueId, 10),
                        };

                        await overseerrApi(url, 'POST', requestBody, parseInt(overseerrId, 10));
                        await updateEmbed(interaction.message, mediaTitle, interaction, 'requested');
                    } catch (error) {
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
