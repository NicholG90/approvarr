import { SlashCommandBuilder, CommandInteraction, MessageFlags } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { mediaSelectList } from '../../outbound/mediaSelects/mediaSelectList';
import { checkUserPermission } from '../../helpers/permissionCheck';
import { Permission } from '../../helpers/permissions';
import { checkUserQuota, formatQuotaMessage } from '../../helpers/quotaCheck';

export const data = new SlashCommandBuilder()
    .setName('request_movie')
    .setDescription('Request a movie from Overseerr')
    .addStringOption((option) => option
        .setName('movie_title')
        .setDescription('Enter the movie you are requesting')
        .setRequired(true));

export async function execute(interaction: any) {
    const movie = interaction.options.getString('movie_title');
    if (!movie) {
        await interaction.reply('You did not provide a Movie title');
        return;
    }

    // Check user permissions and quota before searching
    const { hasPermission, overseerrId } = await checkUserPermission(
        interaction,
        Permission.REQUEST,
        'You do not have permission to request movies.'
    );

    if (!hasPermission || !overseerrId) {
        return;
    }

    // Check quota before allowing user to search
    const quotaCheck = await checkUserQuota(parseInt(overseerrId, 10), 'movie');
    if (!quotaCheck.hasQuota) {
        await interaction.reply({
            content: formatQuotaMessage(quotaCheck),
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    const movieSearchResults = await overseerrApi(`/search?query=${movie}`, 'get');
    if (movieSearchResults.data.results.length === 0) {
        await interaction.reply('No results found');
        return;
    }
    const movieSearchResultsArray = movieSearchResults.data.results;
    // filter out the results that are not movies
    const movieSearchResultsArrayFiltered = movieSearchResultsArray.filter(
        (result: any) => result.mediaType === 'movie',
    );
    await mediaSelectList(interaction, movieSearchResultsArrayFiltered);
}
