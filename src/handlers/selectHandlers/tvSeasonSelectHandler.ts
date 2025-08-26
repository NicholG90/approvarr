import type { Interaction, StringSelectMenuBuilder } from 'discord.js';
import type { TvSeriesDetails } from '../../interfaces/overseerr.js';
import { ActionRowBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi.js';
import { createSelectMenuWithPlaceholder, extractCurrentSelection } from '../../helpers/selectMenuBuilder.js';
import { UIUtils } from '../../helpers/uiUtils.js';

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

    if (seasonOptions.length > 25) {
      const truncatedOptions = seasonOptions.slice(0, 25);
      console.info(`Truncated season options to 25 for TV series ${mediaId}`);
      seasonOptions.length = 0;
      seasonOptions.push(...truncatedOptions);
    }

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
