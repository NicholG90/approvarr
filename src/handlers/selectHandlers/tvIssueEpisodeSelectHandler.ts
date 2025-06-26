import { Interaction, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { createSelectMenuWithPlaceholder, extractCurrentSelection } from '../../helpers/selectMenuBuilder';

export async function tvIssueEpisodeSelectHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;

    try {
        // Extract media ID and season number from the existing embed
        const mediaIdField = mediaEmbed.fields.find((field: any) => field.name === 'Media ID');
        const seasonNumber = interaction.values[0];
        
        if (!mediaIdField) {
            throw new Error('Media ID not found in embed');
        }
        
        const mediaId = mediaIdField.value;

        // Try different API endpoints to fetch episode data
        let seasonData: any = null;
        const episodeOptions: StringSelectMenuOptionBuilder[] = [];
        
        try {
            // First try the season-specific endpoint
            const seasonResponse = await overseerrApi(`/tv/${mediaId}/season/${seasonNumber}`, 'GET');
            seasonData = seasonResponse.data;
        } catch (seasonError) {
            try {
                // Fallback to main TV endpoint and find the season
                const tvResponse = await overseerrApi(`/tv/${mediaId}`, 'GET');
                const tvData = tvResponse.data;
                
                // Look for season data in the main TV response
                if (tvData.seasons && Array.isArray(tvData.seasons)) {
                    const targetSeason = tvData.seasons.find((s: any) => s.seasonNumber === parseInt(seasonNumber));
                    if (targetSeason && targetSeason.episodes) {
                        seasonData = { episodes: targetSeason.episodes };
                    }
                }
            } catch (tvError) {
                // Both endpoints failed, will use fallback options
            }
        }

        if (seasonData && seasonData.episodes && Array.isArray(seasonData.episodes) && seasonData.episodes.length > 0) {
            // Add actual episodes from API
            seasonData.episodes.forEach((episode: any) => {
                const episodeTitle = episode.name || `Episode ${episode.episode_number}`;
                const episodeOverview = episode.overview ? 
                    (episode.overview.length > 60 ? episode.overview.substring(0, 60) + '...' : episode.overview) : 
                    'No description available';
                
                episodeOptions.push(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`Episode ${episode.episode_number}: ${episodeTitle}`)
                        .setValue(`${episode.episode_number}`)
                        .setDescription(episodeOverview)
                );
            });
        } else {
            // No API episodes found, add fallback options (1-10)
            for (let i = 1; i <= 10; i++) {
                episodeOptions.push(
                    new StringSelectMenuOptionBuilder()
                        .setLabel(`Episode ${i}`)
                        .setValue(`${i}`)
                        .setDescription(`Episode ${i}`)
                );
            }
        }

        // Add "Entire Season" option at the beginning
        episodeOptions.unshift(
            new StringSelectMenuOptionBuilder()
                .setLabel(`Entire Season ${seasonNumber}`)
                .setValue('season')
                .setDescription(`Issue affects the entire season`)
        );

        // Limit to 25 options (Discord's limit for select menus)
        if (episodeOptions.length > 25) {
            const truncatedOptions = episodeOptions.slice(0, 25);
            console.info(`Truncated episode options to 25 for season ${seasonNumber} of TV series ${mediaId}`);
            episodeOptions.length = 0;
            episodeOptions.push(...truncatedOptions);
        }

        // Check for current episode selection
        const currentEpisode = extractCurrentSelection(mediaEmbed, 'Episode');
        
        const selectMenu = createSelectMenuWithPlaceholder(
            'tvIssueEpisodeSelect',
            episodeOptions,
            'Which episode has the issue?',
            currentEpisode?.value,
            currentEpisode?.label
        );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        // Add episode select menu (preserve existing components)
        const existingComponents = interaction.message.components || [];
        const allComponents = [...existingComponents, row];
        
        await interaction.update({
            embeds: [mediaEmbed],
            components: allComponents,
        });
    } catch (error) {
        console.error('Error fetching TV episode data for issue reporting:', error);

        // Fallback to basic options if API call fails
        const fallbackOptions = [
            new StringSelectMenuOptionBuilder()
                .setLabel(`Entire Season ${interaction.values[0]}`)
                .setValue('season')
                .setDescription('Issue affects the entire season'),
        ];
        
        // Add episodes 1-10 as fallback
        for (let i = 1; i <= 10; i++) {
            fallbackOptions.push(
                new StringSelectMenuOptionBuilder()
                    .setLabel(`Episode ${i}`)
                    .setValue(`${i}`)
                    .setDescription(`Episode ${i}`)
            );
        }

        // Check for current episode selection (fallback case)
        const currentEpisode = extractCurrentSelection(mediaEmbed, 'Episode');
        
        const selectMenu = createSelectMenuWithPlaceholder(
            'tvIssueEpisodeSelect',
            fallbackOptions,
            'Which episode has the issue?',
            currentEpisode?.value,
            currentEpisode?.label
        );

        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        // Add episode select menu (fallback - preserve existing components)
        const existingComponents = interaction.message.components || [];
        const allComponents = [...existingComponents, row];
        
        await interaction.update({
            embeds: [mediaEmbed],
            components: allComponents,
        });
    }
}