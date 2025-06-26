import { Interaction, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { TvSeriesDetails, TvSeason } from '../../interfaces/overseerr';
import { UIUtils } from '../../helpers/uiUtils';

// Helper function to format selected seasons for display
function formatSelectedSeasons(selectedSeasons: string[]): string {
    if (selectedSeasons.includes('all')) {
        return 'All Seasons';
    }

    const seasonNumbers = selectedSeasons
        .filter(season => season !== 'all')
        .map(season => parseInt(season, 10))
        .filter(num => !isNaN(num))
        .sort((a, b) => a - b);

    if (seasonNumbers.length === 0) {
        return 'Season 1'; // Default fallback
    }

    return seasonNumbers.map(num => `Season ${num}`).join(', ');
}

// Helper function to validate season selection
function validateSeasonSelection(
    selectedSeasons: string[],
    availableSeasons?: TvSeason[]
): { isValid: boolean; errorMessage?: string } {
    if (!selectedSeasons || selectedSeasons.length === 0) {
        return { isValid: false, errorMessage: 'No seasons selected' };
    }

    if (selectedSeasons.includes('all')) {
        return { isValid: true };
    }

    if (!availableSeasons || availableSeasons.length === 0) {
        return { isValid: true }; // Allow if we can't validate against available seasons
    }

    const seasonNumbers = selectedSeasons
        .map(season => parseInt(season, 10))
        .filter(num => !isNaN(num));

    const availableSeasonNumbers = availableSeasons
        .filter(season => season.seasonNumber > 0)
        .map(season => season.seasonNumber);

    const invalidSeasons = seasonNumbers.filter(num => !availableSeasonNumbers.includes(num));

    if (invalidSeasons.length > 0) {
        return {
            isValid: false,
            errorMessage: `Selected seasons not available: ${invalidSeasons.join(', ')}`
        };
    }

    return { isValid: true };
}

export async function tvSeasonSubmitHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;

    try {
        const mediaId = UIUtils.extractMediaId(mediaEmbed);
        const selectedSeasons = interaction.values;

        // Fetch TV data to validate seasons and get status
        const response = await overseerrApi(`/tv/${mediaId}`, 'GET');
        const mediaInfo: TvSeriesDetails = response.data;

        // Validate season selection
        const validation = validateSeasonSelection(selectedSeasons, mediaInfo.seasons);
        if (!validation.isValid) {
            await interaction.reply({
                content: `Error: ${validation.errorMessage}`,
                flags: MessageFlags.Ephemeral,
            });
            return;
        }

        // Update embed with season information
        const updatedEmbed = { ...mediaEmbed };

        // Remove existing season field if it exists
        updatedEmbed.fields = updatedEmbed.fields.filter((field: any) => field.name !== 'Requested Seasons');

        // Add formatted season information
        updatedEmbed.fields.push({
            name: 'Requested Seasons',
            value: formatSelectedSeasons(selectedSeasons),
            inline: true,
        });

        // Check media status and create appropriate buttons
        const requestButton = new ButtonBuilder()
            .setCustomId('requestTvWithSeasons')
            .setLabel('Request')
            .setStyle(ButtonStyle.Primary);

        const mediaExists = new ButtonBuilder()
            .setCustomId('mediaExists')
            .setDisabled(true)
            .setLabel('Media Exists')
            .setStyle(ButtonStyle.Danger);

        const requestExists = new ButtonBuilder()
            .setCustomId('requestExists')
            .setDisabled(true)
            .setLabel('Request Exists')
            .setStyle(ButtonStyle.Danger);

        let row;
        if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status >= 4) {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(mediaExists);
        } else if (mediaInfo && mediaInfo.mediaInfo && mediaInfo.mediaInfo.status > 1) {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(requestExists);
        } else {
            row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(requestButton);
        }

        const allComponents = UIUtils.preserveComponents(interaction.message.components, row);
        
        await interaction.update({
            embeds: [updatedEmbed],
            components: allComponents,
        });

    } catch (error) {
        console.error('Error processing season selection:', error);
        await interaction.reply({
            content: 'An error occurred while processing your season selection. Please try again.',
            flags: MessageFlags.Ephemeral,
        });
    }
}
