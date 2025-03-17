import { Client } from 'discord.js';
import { execute as executeOverseerrMovieRequest } from '../commands/overseerr/requestMovie';
import { execute as executeOverseerrTvRequest } from '../commands/overseerr/requestTv';
import { execute as executeOverseerrReportIssue } from '../commands/overseerr/reportIssue';
import { Permission } from '../helpers/permissions';
import { checkUserPermission } from '../helpers/permissionCheck';

export function commandListener(client: Client): void {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        const { commandName } = interaction;

        switch (commandName) {
            case 'request_movie': {
                const { hasPermission } = await checkUserPermission(
                    interaction,
                    Permission.REQUEST,
                    'You do not have permission to request Movies.'
                );

                if (hasPermission) {
                    await executeOverseerrMovieRequest(interaction);
                }
                break;
            }
            case 'request_tv': {
                const { hasPermission } = await checkUserPermission(
                    interaction,
                    Permission.REQUEST,
                    'You do not have permission to request TV shows.'
                );

                if (hasPermission) {
                    await executeOverseerrTvRequest(interaction);
                }
                break;
            }
            case 'report_issue': {
                // Issue reporting doesn't require special permissions check in the original code
                await executeOverseerrReportIssue(interaction);
                break;
            }
            default:
                console.error(`Unknown command: ${commandName}`);
        }
    });
}
