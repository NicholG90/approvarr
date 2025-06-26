import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { overseerrApi } from '../../helpers/apis/overseerr/overseerrApi';
import { mediaSelectList } from '../../outbound/mediaSelects/mediaSelectList';
import { checkUserPermission } from '../../helpers/permissionCheck';
import { Permission } from '../../helpers/permissions';
import { checkUserQuota, formatQuotaMessage } from '../../helpers/quotaCheck';

export const data = new SlashCommandBuilder()
    .setName('request_tv')
    .setDescription('Request a TV series from Overseerr')
    .addStringOption((option) => option
        .setName('tv_title')
        .setDescription('Enter the TV Series you are requesting')
        .setRequired(true));

export async function execute(interaction: any) {
    const tvSeries = interaction.options.getString('tv_title');
    if (!tvSeries) {
        await interaction.reply('You did not provide a TV Series title');
        return;
    }

    // Check user permissions and quota before searching
    const { hasPermission, overseerrId } = await checkUserPermission(
        interaction,
        Permission.REQUEST,
        'You do not have permission to request TV shows.'
    );

    if (!hasPermission || !overseerrId) {
        return;
    }

    // Check quota before allowing user to search
    const quotaCheck = await checkUserQuota(parseInt(overseerrId, 10), 'tv');
    if (!quotaCheck.hasQuota) {
        await interaction.reply({
            content: formatQuotaMessage(quotaCheck),
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    const tvSearchResults = await overseerrApi(`/search?query=${tvSeries}`, 'get');
    if (tvSearchResults.data.results.length === 0) {
        await interaction.reply('No results found');
        return;
    }
    const tvSearchResultsArray = tvSearchResults.data.results;
    // filter out the results that are not tv
    const tvSearchResultsArrayFiltered = tvSearchResultsArray.filter(
        (result: any) => result.mediaType === 'tv',
    );
    await mediaSelectList(interaction, tvSearchResultsArrayFiltered);
}
