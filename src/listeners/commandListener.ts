import type { Client } from 'discord.js';
import { execute as executeOverseerrQuotaStatus } from '../commands/overseerr/quotaStatus';
import { execute as executeOverseerrReportIssue } from '../commands/overseerr/reportIssue';
import { execute as executeOverseerrMovieRequest } from '../commands/overseerr/requestMovie';
import { execute as executeOverseerrTvRequest } from '../commands/overseerr/requestTv';

export function commandListener(client: Client): void {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand())
      return;

    const { commandName } = interaction;

    switch (commandName) {
      case 'request_movie': {
        await executeOverseerrMovieRequest(interaction);
        break;
      }
      case 'request_tv': {
        await executeOverseerrTvRequest(interaction);
        break;
      }
      case 'report_issue': {
        // Issue reporting doesn't require special permissions check in the original code
        await executeOverseerrReportIssue(interaction);
        break;
      }
      case 'quota_status': {
        await executeOverseerrQuotaStatus(interaction);
        break;
      }
      default:
        console.error(`Unknown command: ${commandName}`);
    }
  });
}
