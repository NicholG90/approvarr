// Import the necessary modules
import { Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { EmbedColors, Notification } from '../../constants/notificationData';
import { MediaNotification } from '../../interfaces/notifications';
import { findMessageByRequestId } from '../../helpers/findDiscordMessage';
import { getRequestDetails } from '../../helpers/getRequestDetails';

export async function mediaSender(client: Client, payload: MediaNotification): Promise<void> {
    // Set the channel ID from the environment variables
    const channelId = process.env.REQUEST_CHANNEL_ID || process.env.CHANNEL_ID;

    // Check if the channel ID is defined
    if (!channelId) {
        console.error('Channel ID is undefined in the environment variables.');
        return;
    }

    // Try to get additional user information from Overseerr for the request
    const overseerrUserInfo = await getRequestDetails(payload.request.request_id);

    // For approved/declined requests, check if there's an existing message to update
    const isUpdateNotification = [
        Notification.MEDIA_APPROVED,
        Notification.MEDIA_AUTO_APPROVED,
        Notification.MEDIA_DECLINED
    ].includes(payload.notification_type as Notification);

    if (isUpdateNotification) {
        const existingMessage = await findMessageByRequestId(client, payload.request.request_id, channelId);

        if (existingMessage) {
            const isDeclined = payload.notification_type === Notification.MEDIA_DECLINED;

            // Determine the button label based on the existing component
            let buttonLabel = isDeclined ? 'Request Declined Externally' : 'Request Approved Externally';

            // Check for existing components and preserve custom approval messages
            const existingComponent = existingMessage.components?.[0]?.components?.[0];
            if (existingComponent &&
                'label' in existingComponent &&
                typeof existingComponent.label === 'string') {

                // If the label contains "by", it's a custom approval/decline message we should keep
                if (existingComponent.label.includes(' by ')) {
                    buttonLabel = existingComponent.label;
                } else if (overseerrUserInfo?.modifiedBy) {
                    // If we have user information from Overseerr, use it to enhance the label
                    buttonLabel = isDeclined
                        ? `Request Declined by ${overseerrUserInfo.modifiedBy.displayName}`
                        : `Request Approved by ${overseerrUserInfo.modifiedBy.displayName}`;
                }
            }

            // Create the button with the appropriate label
            const button = new ButtonBuilder()
                .setCustomId(isDeclined ? 'mediaDeclined' : 'mediaApproved')
                .setDisabled(true)
                .setLabel(buttonLabel)
                .setStyle(isDeclined ? ButtonStyle.Danger : ButtonStyle.Success);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

            // Update embed color based on notification type
            const updatedColor = isDeclined ? EmbedColors.RED : EmbedColors.PURPLE;

            // Create updated embed with new color and updated status
            const updatedEmbed = {
                ...existingMessage.embeds[0].toJSON(),
                color: updatedColor
            };

            // Update the status field in the embed
            if (updatedEmbed.fields) {
                const statusFieldIndex = updatedEmbed.fields.findIndex(
                    field => field.name === 'Requested Status'
                );

                if (statusFieldIndex !== -1) {
                    updatedEmbed.fields[statusFieldIndex].value = isDeclined ?
                        'Declined' :
                        'Approved';
                }

                // If we have modified by information, add or update that field too
                if (overseerrUserInfo?.modifiedBy) {
                    const modifiedByIndex = updatedEmbed.fields.findIndex(
                        field => field.name === 'Processed By'
                    );

                    if (modifiedByIndex !== -1) {
                        updatedEmbed.fields[modifiedByIndex].value = overseerrUserInfo.modifiedBy.displayName;
                    } else {
                        updatedEmbed.fields.push({
                            name: 'Processed By',
                            value: overseerrUserInfo.modifiedBy.displayName,
                            inline: true
                        });
                    }
                }
            }

            // Update the existing message
            await existingMessage.edit({
                embeds: [updatedEmbed],
                components: [row]
            });

            // If we updated an existing message, return early
            return;
        }
    }

    // Create embed color based on notification type
    let color = EmbedColors.DARK_PURPLE;
    switch (payload.notification_type) {
        case Notification.MEDIA_PENDING:
            color = EmbedColors.ORANGE;
            break;
        case Notification.MEDIA_APPROVED:
        case Notification.MEDIA_AUTO_APPROVED:
            color = EmbedColors.PURPLE;
            break;
        case Notification.MEDIA_AVAILABLE:
            color = EmbedColors.GREEN;
            break;
        case Notification.MEDIA_DECLINED:
        case Notification.MEDIA_FAILED:
            color = EmbedColors.RED;
            break;
    }

    // Create an embed using the payload data
    const embed = {
        title: payload.subject,
        url: `${process.env.OVERSEERR_URL}/requests`,
        description: payload.event,
        color,
        fields: [
            {
                name: 'Description',
                value: payload.message,
            },
            {
                name: 'Request ID',
                value: payload.request.request_id,
                inline: true,
            },
            {
                name: 'Requested By',
                value: payload.request.requestedBy_username || 'Unknown',
                inline: true,
            },
            {
                name: 'Requested Status',
                value: (payload.event.split(' ').pop() === 'Request')
                    ? 'Pending'
                    : payload.event.split(' ').pop() || 'Unknown',
                inline: true,
            },
        ],
        thumbnail: {
            url: payload.image,
        },
    };

    // Add information about who processed the request if available
    if (overseerrUserInfo?.modifiedBy && isUpdateNotification) {
        embed.fields.push({
            name: 'Processed By',
            value: overseerrUserInfo.modifiedBy.displayName,
            inline: true,
        });
    }

    // Add season information if available
    if (payload.extra?.length > 0) {
        embed.fields.push({
            name: 'Requested Seasons',
            value: payload.extra[0].value || 'Not specified',
        });
    }

    // Get the channel from the client cache
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (!channel) {
        console.error(`Channel with ID ${channelId} not found.`);
        return;
    }

    // Only add action buttons for pending requests
    if (payload.notification_type === Notification.MEDIA_PENDING) {
        const approve = new ButtonBuilder()
            .setCustomId('approve')
            .setLabel('Approve')
            .setStyle(ButtonStyle.Success);

        const decline = new ButtonBuilder()
            .setCustomId('decline')
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(approve, decline);

        await channel.send({
            embeds: [embed],
            components: [row],
        });
    } else {
        await channel.send({
            embeds: [embed],
        });
    }
}
