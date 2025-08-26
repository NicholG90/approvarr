import type { Interaction } from 'discord.js';
import type { TvSeason, TvSeriesDetails } from '../../interfaces/overseerr.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi.js';
import { UIUtils } from '../../helpers/uiUtils.js';

function formatSelectedSeasons(selectedSeasons: string[]): string {
  if (selectedSeasons.includes('all')) {
    return 'All Seasons';
  }

  const seasonNumbers = selectedSeasons
    .filter(season => season !== 'all')
    .map(season => Number.parseInt(season, 10))
    .filter(num => !Number.isNaN(num))
    .sort((a, b) => a - b);

  if (seasonNumbers.length === 0) {
    return 'Season 1';
  }

  return seasonNumbers.map(num => `Season ${num}`).join(', ');
}

function validateSeasonSelection(
  selectedSeasons: string[],
  availableSeasons?: TvSeason[],
): { isValid: boolean; errorMessage?: string } {
  if (!selectedSeasons || selectedSeasons.length === 0) {
    return { isValid: false, errorMessage: 'No seasons selected' };
  }

  if (selectedSeasons.includes('all')) {
    return { isValid: true };
  }

  if (!availableSeasons || availableSeasons.length === 0) {
    return { isValid: true };
  }

  const seasonNumbers = selectedSeasons
    .map(season => Number.parseInt(season, 10))
    .filter(num => !Number.isNaN(num));

  const availableSeasonNumbers = availableSeasons
    .filter(season => season.seasonNumber > 0)
    .map(season => season.seasonNumber);

  const invalidSeasons = seasonNumbers.filter(num => !availableSeasonNumbers.includes(num));

  if (invalidSeasons.length > 0) {
    return {
      isValid: false,
      errorMessage: `Selected seasons not available: ${invalidSeasons.join(', ')}`,
    };
  }

  return { isValid: true };
}

export async function tvSeasonSubmitHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  try {
    const mediaId = UIUtils.extractMediaId(mediaEmbed);
    const selectedSeasons = interaction.values;

    const response = await overseerrApi(`/tv/${mediaId}`, 'GET');
    const mediaInfo: TvSeriesDetails = response.data;

    const validation = validateSeasonSelection(selectedSeasons, mediaInfo.seasons);
    if (!validation.isValid) {
      await interaction.reply({
        content: `Error: ${validation.errorMessage}`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const updatedEmbed = { ...mediaEmbed };

    updatedEmbed.fields = updatedEmbed.fields.filter((field: any) => field.name !== 'Requested Seasons');

    updatedEmbed.fields.push({
      name: 'Requested Seasons',
      value: formatSelectedSeasons(selectedSeasons),
      inline: true,
    });

    const requestButton = new ButtonBuilder()
      .setCustomId('requestTvWithSeasons')
      .setLabel('Request')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(requestButton);

    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

    await interaction.update({
      embeds: [updatedEmbed],
      components: allComponents,
    });
  }
  catch (error) {
    console.error('Error processing season selection:', error);
    await interaction.reply({
      content: 'An error occurred while processing your season selection. Please try again.',
      flags: MessageFlags.Ephemeral,
    });
  }
}
