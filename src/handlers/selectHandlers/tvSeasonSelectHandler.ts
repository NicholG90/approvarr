import type { Interaction, StringSelectMenuBuilder } from 'discord.js';
import type { TvSeriesDetails } from '../../interfaces/overseerr';
import { ActionRowBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { createSelectMenuWithPlaceholder, extractCurrentSelection } from '../../helpers/selectMenuBuilder';
import { UIUtils } from '../../helpers/uiUtils';

export async function tvSeasonSelectHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  try {
    const mediaId = interaction.values[0].split('-')[0].trim();

    const response = await overseerrApi(`/tv/${mediaId}`, 'GET');
    const tvData: TvSeriesDetails = response.data;

    const seasonOptions = tvData.seasons ? UIUtils.createSeasonOptions(tvData.seasons) : [];

    seasonOptions.unshift(
      new StringSelectMenuOptionBuilder()
        .setLabel('All Seasons')
        .setValue('all')
        .setDescription('Request all available seasons'),
    );

    if (seasonOptions.length === 1) {
      seasonOptions.push(
        new StringSelectMenuOptionBuilder()
          .setLabel('Season 1')
          .setValue('1')
          .setDescription('Default season'),
      );
    }

    // Limit to 25 options (Discord's limit for select menus)
    if (seasonOptions.length > 25) {
      const truncatedOptions = seasonOptions.slice(0, 25);
      console.info(`Truncated season options to 25 for TV series ${mediaId}`);
      seasonOptions.length = 0;
      seasonOptions.push(...truncatedOptions);
    }

    // Check for current season selection
    const currentSeason = extractCurrentSelection(mediaEmbed, 'Requested Seasons');

    const selectMenu = createSelectMenuWithPlaceholder(
      'tvSeasonSelect',
      seasonOptions,
      'What Season would you like to request?',
      currentSeason?.value,
      currentSeason?.label,
    );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

    await interaction.update({
      embeds: [mediaEmbed],
      components: allComponents,
    });
  }
  catch (error) {
    console.error('Error fetching TV season data:', error);

    // Fallback to basic options if API call fails
    const fallbackOptions = [
      new StringSelectMenuOptionBuilder()
        .setLabel('All Seasons')
        .setValue('all')
        .setDescription('Request all available seasons'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Season 1')
        .setValue('1')
        .setDescription('Season 1'),
    ];

    // Check for current season selection (fallback case)
    const currentSeason = extractCurrentSelection(mediaEmbed, 'Requested Seasons');

    const selectMenu = createSelectMenuWithPlaceholder(
      'tvSeasonSelect',
      fallbackOptions,
      'What Season would you like to request?',
      currentSeason?.value,
      currentSeason?.label,
    );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

    await interaction.update({
      embeds: [mediaEmbed],
      components: allComponents,
    });
  }
}
