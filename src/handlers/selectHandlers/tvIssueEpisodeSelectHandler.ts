import type { Interaction, StringSelectMenuBuilder } from 'discord.js';
import { ActionRowBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { fetchSeasonEpisodes } from '../../helpers/episodeDataFetcher.js';
import { createSelectMenuWithPlaceholder, extractCurrentSelection } from '../../helpers/selectMenuBuilder.js';
import { UIUtils } from '../../helpers/uiUtils.js';

export async function tvIssueEpisodeSelectHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  try {
    const mediaId = UIUtils.extractMediaId(mediaEmbed);
    const seasonNumber = interaction.values[0];

    const episodes = await fetchSeasonEpisodes(mediaId, seasonNumber);

    const episodeOptions = episodes.length > 0
      ? UIUtils.createEpisodeOptions(episodes)
      : UIUtils.createFallbackEpisodeOptions();

    episodeOptions.unshift(
      new StringSelectMenuOptionBuilder()
        .setLabel(`Entire Season ${seasonNumber}`)
        .setValue('season')
        .setDescription('Issue affects the entire season'),
    );

    if (episodeOptions.length > 25) {
      episodeOptions.splice(25);
    }

    const currentEpisode = extractCurrentSelection(mediaEmbed, 'Episode');
    const selectMenu = createSelectMenuWithPlaceholder(
      'tvIssueEpisodeSelect',
      episodeOptions,
      'Which episode has the issue?',
      currentEpisode?.value,
      currentEpisode?.label,
    );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

    await interaction.update({
      embeds: [mediaEmbed],
      components: allComponents,
    });
  }
  catch (error) {
    console.error('Error in episode select handler:', error);

    const fallbackOptions = [
      new StringSelectMenuOptionBuilder()
        .setLabel(`Entire Season ${interaction.values[0]}`)
        .setValue('season')
        .setDescription('Issue affects the entire season'),
      ...UIUtils.createFallbackEpisodeOptions(),
    ];

    const currentEpisode = extractCurrentSelection(mediaEmbed, 'Episode');
    const selectMenu = createSelectMenuWithPlaceholder(
      'tvIssueEpisodeSelect',
      fallbackOptions,
      'Which episode has the issue?',
      currentEpisode?.value,
      currentEpisode?.label,
    );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);
    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

    await interaction.update({
      embeds: [mediaEmbed],
      components: allComponents,
    });
  }
}
