import { Interaction, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { TvSeriesDetails, TvSeason } from '../../interfaces/overseerr';
import { createSelectMenuWithPlaceholder, extractCurrentSelection } from '../../helpers/selectMenuBuilder';

export async function tvIssueSeasonSelectHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;

    try {
        const mediaId = interaction.values[0].split('-')[0].trim();

        // Fetch season data from Overseerr API
        const response = await overseerrApi(`/tv/${mediaId}`, 'GET');
        const tvData: TvSeriesDetails = response.data;

        // Create season options from the TV data
        const seasonOptions: StringSelectMenuOptionBuilder[] = [];

        if (tvData.seasons && Array.isArray(tvData.seasons)) {
            // Filter out special seasons (season 0) and create options
            const validSeasons = tvData.seasons.filter((season: TvSeason) => season.seasonNumber > 0);

            validSeasons.forEach((season: TvSeason) => {
                seasonOptions.push(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`Season ${season.seasonNumber}`)
                        .setValue(season.seasonNumber.toString())
                        .setDescription(`${season.episodeCount || 0} episodes`)
                );
            });
        }

        // If no valid seasons found, add a default option
        if (seasonOptions.length === 0) {
            seasonOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Season 1')
                    .setValue('1')
                    .setDescription('Default season')
            );
        }

        // Limit to 25 options (Discord's limit for select menus)
        if (seasonOptions.length > 25) {
            const truncatedOptions = seasonOptions.slice(0, 25);
            console.info(`Truncated season options to 25 for TV series ${mediaId}`);
            seasonOptions.length = 0;
            seasonOptions.push(...truncatedOptions);
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('tvIssueSeasonSelect')
            .setPlaceholder('Which season has the issue?')
            .addOptions(...seasonOptions);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        // Add season select menu (preserve existing components)
        const existingComponents = interaction.message.components || [];
        const allComponents = [...existingComponents, row];
        
        await interaction.update({
            embeds: [mediaEmbed],
            components: allComponents,
        });
    } catch (error) {
        console.error('Error fetching TV season data for issue reporting:', error);

        // Fallback to basic options if API call fails
        const fallbackOptions = [
            new StringSelectMenuOptionBuilder()
                .setLabel('Season 1')
                .setValue('1')
                .setDescription('Season 1'),
        ];

        // Check for current season selection (fallback case)
        const currentSeason = extractCurrentSelection(mediaEmbed, 'Season');
        
        const selectMenu = createSelectMenuWithPlaceholder(
            'tvIssueSeasonSelect',
            fallbackOptions,
            'Which season has the issue?',
            currentSeason?.value,
            currentSeason?.label
        );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        // Add season select menu (fallback - preserve existing components)
        const existingComponents = interaction.message.components || [];
        const allComponents = [...existingComponents, row];
        
        await interaction.update({
            embeds: [mediaEmbed],
            components: allComponents,
        });
    }
}