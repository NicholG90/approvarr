import { MessageFlags, SlashCommandBuilder } from 'discord.js';
import { checkUserPermission } from '../../helpers/permissionCheck.js';
import { Permission } from '../../helpers/permissions.js';
import { checkUserQuota, formatQuotaMessage } from '../../helpers/quotaCheck.js';

export const data = new SlashCommandBuilder()
  .setName('quota_status')
  .setDescription('Check your current request quota status');

export async function execute(interaction: any) {
  const { hasPermission, overseerrId } = await checkUserPermission(
    interaction,
    Permission.REQUEST,
    'You do not have permission to view quota status.',
  );

  if (!hasPermission || !overseerrId) {
    return;
  }

  try {
    const movieQuota = await checkUserQuota(Number.parseInt(overseerrId, 10), 'movie');
    const tvQuota = await checkUserQuota(Number.parseInt(overseerrId, 10), 'tv');

    const movieMessage = formatQuotaMessage(movieQuota);
    const tvMessage = formatQuotaMessage(tvQuota);

    const response = `**Your Request Quota Status:**\n\n🎬 **Movies:** ${movieMessage}\n📺 **TV Shows:** ${tvMessage}`;

    await interaction.reply({
      content: response,
      flags: MessageFlags.Ephemeral,
    });
  }
  catch (error) {
    console.error('Error fetching quota status:', error);
    await interaction.reply({
      content: 'An error occurred while fetching your quota status.',
      flags: MessageFlags.Ephemeral,
    });
  }
}
