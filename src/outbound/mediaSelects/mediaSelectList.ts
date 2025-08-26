import type { CommandInteraction } from 'discord.js';
import type { OverseerrSearchMediaResults } from '../../interfaces/overseerr.js';
import {
  ActionRowBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { UIUtils } from '../../helpers/uiUtils.js';

export async function mediaSelectList(
  interaction: CommandInteraction,
  mediaArray: OverseerrSearchMediaResults[],
) {
  if (!mediaArray || mediaArray.length === 0) {
    await interaction.reply('No valid media results found');
    return;
  }

  const { mediaType } = mediaArray[0];

  const validOptions = mediaArray
    .filter((media) => {
      const hasValidId = media.id !== undefined && media.id !== null;
      const hasValidMediaType = media.mediaType !== undefined;
      const hasTitle = mediaType === 'tv' ? media.name : media.title;
      return hasValidId && hasValidMediaType && hasTitle;
    })
    .map((media) => {
      const label = UIUtils.formatMediaLabel(media, mediaType);
      return new StringSelectMenuOptionBuilder()
        .setLabel(label)
        .setValue(`${media.id.toString()}-${media.mediaType.toString()}`);
    });

  if (validOptions.length === 0) {
    await interaction.reply('No valid media options found');
    return;
  }

  const options = validOptions;
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('mediaSelect')
    .setPlaceholder('What would you like to request!')
    .addOptions(...options);
  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);
  await interaction.reply({
    content: `Please select a ${mediaType === 'tv' ? 'TV Series' : 'Movie'}:`,
    components: [row],
    flags: MessageFlags.Ephemeral,
  });
}
