import type { Interaction } from 'discord.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi.js';
import { UIUtils } from '../../helpers/uiUtils.js';

export async function mediaRequestSubmitHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;
  const mediaType = interaction.values[0].split('-')[1].trim();
  const mediaId = interaction.values[0].split('-')[0].trim();

  const mediaInfo = (await overseerrApi(`/${mediaType}/${mediaId}`, 'get')).data;
  mediaInfo.name = `
    ${mediaInfo.name} (${mediaType === 'tv'
      ? mediaInfo.firstAirDate?.split('-')[0]
      : mediaInfo.releaseDate?.split('-')[0]})
    `;
  const requestButton = new ButtonBuilder()
    .setCustomId('requestMedia')
    .setLabel('Request')
    .setStyle(ButtonStyle.Primary);
  const mediaExists = new ButtonBuilder()
    .setCustomId('mediaExists')
    .setDisabled(true)
    .setLabel('Media Exists')
    .setStyle(ButtonStyle.Danger);
  const requestExists = new ButtonBuilder()
    .setCustomId('requestExists')
    .setDisabled(true)
    .setLabel('Request Exists')
    .setStyle(ButtonStyle.Danger);

  let row;
  if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status >= 4) {
    row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(mediaExists);
  }
  else if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status > 1) {
    row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(requestExists);
  }
  else {
    row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(requestButton);
  }
  const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

  await interaction.update({
    embeds: [mediaEmbed],
    components: allComponents,
  });
}
