import type { Interaction } from 'discord.js';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData.js';
import { UIUtils } from '../../helpers/uiUtils.js';

export async function tvIssueTypeSubmitHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  const selectedEpisode = interaction.values[0];

  const updatedEmbed = { ...mediaEmbed };

  let episodeInfo = '';

  if (selectedEpisode === 'season') {
    episodeInfo = 'Entire Season';
  }
  else {
    episodeInfo = `Episode ${selectedEpisode}`;
  }

  const episodeField = updatedEmbed.fields.find((field: any) => field.name === 'Episode');

  if (!episodeField) {
    updatedEmbed.fields.push({
      name: 'Episode',
      value: episodeInfo,
      inline: true,
    });
  }

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('issueReportType')
    .setPlaceholder('What is the issue with the media?')
    .addOptions(...issueReasons);

  const row = new ActionRowBuilder<StringSelectMenuBuilder>()
    .addComponents(selectMenu);

  const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

  await interaction.update({
    embeds: [updatedEmbed],
    components: allComponents,
  });
}
