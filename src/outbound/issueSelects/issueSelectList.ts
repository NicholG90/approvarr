import type { CommandInteraction } from 'discord.js';
import type { OverseerrSearchMediaResults } from '../../interfaces/overseerr.js';
import {
  ActionRowBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from 'discord.js';
import { UIUtils } from '../../helpers/uiUtils.js';

export async function issueSelectList(
  interaction: CommandInteraction,
  mediaArray: OverseerrSearchMediaResults[],
) {
  const options = mediaArray.map((media) => {
    const label = UIUtils.formatMediaLabel(media);
    return new StringSelectMenuOptionBuilder()
      .setLabel(label)
      .setValue(`${media.id.toString()}-${media.mediaType.toString()}-${media.mediaInfo.id.toString()}`);
  });
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('issueReportMedia')
    .setPlaceholder('What media would you like to report an issue with?')
    .addOptions(...options);
  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);
  await interaction.reply({
    content: `Please select the media with an issue:`,
    components: [row],
    flags: MessageFlags.Ephemeral,
  });
}
