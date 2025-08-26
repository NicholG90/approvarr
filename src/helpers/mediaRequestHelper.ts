import { MessageFlags } from 'discord.js';
import { mediaSelectList } from '../outbound/mediaSelects/mediaSelectList.js';
import { overseerrApi } from './apis/overseerr/overseerrApi.js';
import { checkUserPermission } from './permissionCheck.js';
import { Permission } from './permissions.js';
import { checkUserQuota, formatQuotaMessage } from './quotaCheck.js';

export async function executeMediaRequest(interaction: any, mediaType: 'movie' | 'tv') {
  const titleOption = mediaType === 'movie' ? 'movie_title' : 'tv_title';
  const mediaTitle = interaction.options.getString(titleOption);

  if (!mediaTitle) {
    await interaction.reply(`You did not provide a ${mediaType === 'movie' ? 'Movie' : 'TV Series'} title`);
    return;
  }

  const { hasPermission, overseerrId } = await checkUserPermission(
    interaction,
    Permission.REQUEST,
    `You do not have permission to request ${mediaType === 'movie' ? 'movies' : 'TV shows'}.`,
  );

  if (!hasPermission || !overseerrId) {
    return;
  }

  const quotaCheck = await checkUserQuota(Number.parseInt(overseerrId, 10), mediaType);
  if (!quotaCheck.hasQuota) {
    await interaction.reply({
      content: formatQuotaMessage(quotaCheck),
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const searchResults = await overseerrApi(`/search?query=${mediaTitle}`, 'get');
  if (searchResults.data.results.length === 0) {
    await interaction.reply('No results found');
    return;
  }

  const filteredResults = searchResults.data.results.filter(
    (result: any) => result.mediaType === mediaType,
  );

  await mediaSelectList(interaction, filteredResults);
}
