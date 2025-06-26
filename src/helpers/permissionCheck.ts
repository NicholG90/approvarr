import type { Interaction } from 'discord.js';
import type { Permission } from './permissions';
import { MessageFlags } from 'discord.js';
import { overseerrApi } from './apis/overseerr/overseerrApi';
import { getDiscordUserIds } from './getDiscordUserIds';
import { hasPermission } from './permissions';

/**
 * Checks if a user has the specified permission to perform an action
 *
 * @param interaction The Discord interaction
 * @param requiredPermission The permission required to perform the action
 * @param errorMessage Custom error message to display if permission is denied
 * @returns An object containing the result of the check and the overseerrId if successful
 */
export async function checkUserPermission(
  interaction: Interaction,
  requiredPermission: Permission | Permission[],
  errorMessage: string = 'You do not have permission to perform this action.',
): Promise<{ hasPermission: boolean; overseerrId?: string }> {
  try {
    // Get all Discord user mappings
    const users = await getDiscordUserIds();

    // Find the user's Overseerr ID
    const overseerrId = Object.keys(users).find(
      (key: string) => users[Number.parseInt(key)] === interaction.user.id,
    );

    if (!overseerrId) {
      if (interaction.isRepliable()) {
        await interaction.reply({
          content: 'Your Discord ID is not linked to an Overseerr account.',
          flags: MessageFlags.Ephemeral,
        });
      }
      return { hasPermission: false };
    }

    // Get the user's permissions
    const userPermissions = await overseerrApi(`/user/${overseerrId}/settings/permissions`, 'GET');

    // Check if the user has the required permission
    const userHasPermission = hasPermission(
      requiredPermission,
      userPermissions.data.permissions,
      { type: 'or' },
    );

    if (!userHasPermission && interaction.isRepliable()) {
      await interaction.reply({
        content: errorMessage,
        flags: MessageFlags.Ephemeral,
      });
    }

    return {
      hasPermission: userHasPermission,
      overseerrId: userHasPermission ? overseerrId : undefined,
    };
  }
  catch (error) {
    console.error('Error checking permissions:', error);
    if (interaction.isRepliable()) {
      await interaction.reply({
        content: 'An error occurred while checking your permissions.',
        flags: MessageFlags.Ephemeral,
      });
    }
    return { hasPermission: false };
  }
}
