import type { CommandInteraction } from 'discord.js';
import type { OverseerrSearchMediaResults } from '../../interfaces/overseerr';
import {
  ActionRowBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { UIUtils } from '../../helpers/uiUtils';

export async function mediaSelectList(
  interaction: CommandInteraction,
  mediaArray: OverseerrSearchMediaResults[],
) {
  const { mediaType } = mediaArray[0];
  const options = mediaArray.map((media) => {
    const label = UIUtils.formatMediaLabel(media, mediaType);
    return new StringSelectMenuOptionBuilder()
      .setLabel(label)
      .setValue(`${media.id.toString()}-${media.mediaType.toString()}`);
  });
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
