import type { Interaction } from 'discord.js';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData';
import { UIUtils } from '../../helpers/uiUtils';

export async function tvIssueTypeSubmitHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  // Get the selected episode information
  const selectedEpisode = interaction.values[0];

  // Add season and episode information to the embed
  const updatedEmbed = { ...mediaEmbed };

  // Find season information from previous selection (stored in the interaction message)
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
