import type { Client, TextChannel } from 'discord.js';
import type { MediaNotification } from '../../interfaces/notifications.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { EmbedColors, Notification } from '../../constants/notificationData.js';
import { findMessageByRequestId } from '../../helpers/findDiscordMessage.js';
import { getRequestDetails } from '../../helpers/getRequestDetails.js';

export async function mediaSender(client: Client, payload: MediaNotification): Promise<void> {
  const channelId = process.env.REQUEST_CHANNEL_ID || process.env.CHANNEL_ID;

  if (!channelId) {
    console.error('Channel ID is undefined in the environment variables.');
    return;
  }

  const overseerrUserInfo = await getRequestDetails(payload.request.request_id);

  const isUpdateNotification = [
    Notification.MEDIA_APPROVED,
    Notification.MEDIA_AUTO_APPROVED,
    Notification.MEDIA_DECLINED,
  ].includes(payload.notification_type as Notification);

  if (isUpdateNotification) {
    const existingMessage = await findMessageByRequestId(client, payload.request.request_id, channelId);

    if (existingMessage) {
      const isDeclined = payload.notification_type === Notification.MEDIA_DECLINED;

      let buttonLabel = isDeclined ? 'Request Declined Externally' : 'Request Approved Externally';

      const existingComponent = existingMessage.components?.[0]?.type === 1
        ? existingMessage.components[0].components?.[0]
        : undefined;
      if (existingComponent
        && 'label' in existingComponent
        && typeof existingComponent.label === 'string') {
        if (existingComponent.label.includes(' by ')) {
          buttonLabel = existingComponent.label;
        }
        else if (overseerrUserInfo?.modifiedBy) {
          buttonLabel = isDeclined
            ? `Request Declined by ${overseerrUserInfo.modifiedBy.displayName}`
            : `Request Approved by ${overseerrUserInfo.modifiedBy.displayName}`;
        }
      }

      const button = new ButtonBuilder()
        .setCustomId(isDeclined ? 'mediaDeclined' : 'mediaApproved')
        .setDisabled(true)
        .setLabel(buttonLabel)
        .setStyle(isDeclined ? ButtonStyle.Danger : ButtonStyle.Success);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

      const updatedColor = isDeclined ? EmbedColors.RED : EmbedColors.PURPLE;

      const updatedEmbed = {
        ...existingMessage.embeds[0].toJSON(),
        color: updatedColor,
      };

      if (updatedEmbed.fields) {
        const statusFieldIndex = updatedEmbed.fields.findIndex(
          field => field.name === 'Requested Status',
        );

        if (statusFieldIndex !== -1) {
          updatedEmbed.fields[statusFieldIndex].value = isDeclined
            ? 'Declined'
            : 'Approved';
        }

        if (overseerrUserInfo?.modifiedBy) {
          const modifiedByIndex = updatedEmbed.fields.findIndex(
            field => field.name === 'Processed By',
          );

          if (modifiedByIndex !== -1) {
            updatedEmbed.fields[modifiedByIndex].value = overseerrUserInfo.modifiedBy.displayName;
          }
          else {
            updatedEmbed.fields.push({
              name: 'Processed By',
              value: overseerrUserInfo.modifiedBy.displayName,
              inline: true,
            });
          }
        }
      }

      await existingMessage.edit({
        embeds: [updatedEmbed],
        components: [row],
      });

      return;
    }
  }

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

  if (overseerrUserInfo?.modifiedBy && isUpdateNotification) {
    embed.fields.push({
      name: 'Processed By',
      value: overseerrUserInfo.modifiedBy.displayName,
      inline: true,
    });
  }

  if (payload.extra?.length > 0) {
    embed.fields.push({
      name: 'Requested Seasons',
      value: payload.extra[0].value || 'Not specified',
    });
  }

  const channel = client.channels.cache.get(channelId) as TextChannel;
  if (!channel) {
    console.error(`Channel with ID ${channelId} not found.`);
    return;
  }

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
  }
  else {
    await channel.send({
      embeds: [embed],
    });
  }
}
