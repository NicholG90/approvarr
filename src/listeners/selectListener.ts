import type { Client } from 'discord.js';
import { issueReportSubmitHandler } from '../handlers/selectHandlers/issueReportSubmitHandler.js';
import { issueTypeSubmitHandler } from '../handlers/selectHandlers/issueTypeSubmitHandler.js';
import { mediaRequestSubmitHandler } from '../handlers/selectHandlers/mediaRequestSubmitHandler.js';
import { tvIssueEpisodeSelectHandler } from '../handlers/selectHandlers/tvIssueEpisodeSelectHandler.js';
import { tvIssueTypeSubmitHandler } from '../handlers/selectHandlers/tvIssueTypeSubmitHandler.js';
import { tvSeasonSelectHandler } from '../handlers/selectHandlers/tvSeasonSelectHandler.js';
import { tvSeasonSubmitHandler } from '../handlers/selectHandlers/tvSeasonSubmitHandler.js';
import { mediaEmbedBuilder } from '../helpers/mediaEmbedBuilder.js';

export function selectListener(client: Client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu())
      return;
    switch (interaction.customId) {
      case 'issueReportType': {
        await issueTypeSubmitHandler(interaction);
        break;
      }
      case 'issueReportMedia': {
        const mediaEmbed = await mediaEmbedBuilder(interaction);
        await issueReportSubmitHandler(interaction, mediaEmbed);
        break;
      }
      case 'mediaSelect': {
        const mediaEmbed = await mediaEmbedBuilder(interaction);
        const mediaType = interaction.values[0].split('-')[1].trim();
        if (mediaType === 'tv') {
          await tvSeasonSelectHandler(interaction, mediaEmbed);
        }
        else {
          await mediaRequestSubmitHandler(interaction, mediaEmbed);
        }
        break;
      }
      case 'tvSeasonSelect': {
        const existingEmbed = interaction.message.embeds[0];
        const mediaEmbed = {
          title: existingEmbed.title,
          url: existingEmbed.url,
          color: existingEmbed.color,
          fields: [...existingEmbed.fields],
          thumbnail: existingEmbed.thumbnail,
        };
        await tvSeasonSubmitHandler(interaction, mediaEmbed);
        break;
      }
      case 'tvIssueSeasonSelect': {
        const existingEmbed = interaction.message.embeds[0];

        const fields = [...existingEmbed.fields];
        const seasonFieldIndex = fields.findIndex(f => f.name === 'Season');
        const seasonField = {
          name: 'Season',
          value: `Season ${interaction.values[0]}`,
          inline: true,
        };

        if (seasonFieldIndex >= 0) {
          fields[seasonFieldIndex] = seasonField;
        }
        else {
          fields.push(seasonField);
        }

        const mediaEmbed = {
          title: existingEmbed.title,
          url: existingEmbed.url,
          color: existingEmbed.color,
          fields,
          thumbnail: existingEmbed.thumbnail,
        };
        await tvIssueEpisodeSelectHandler(interaction, mediaEmbed);
        break;
      }
      case 'tvIssueEpisodeSelect': {
        const existingEmbed = interaction.message.embeds[0];

        const fields = [...existingEmbed.fields];
        const episodeFieldIndex = fields.findIndex(f => f.name === 'Episode');
        const episodeValue = interaction.values[0] === 'season' ? 'Entire Season' : `Episode ${interaction.values[0]}`;
        const episodeField = {
          name: 'Episode',
          value: episodeValue,
          inline: true,
        };

        if (episodeFieldIndex >= 0) {
          fields[episodeFieldIndex] = episodeField;
        }
        else {
          fields.push(episodeField);
        }

        const mediaEmbed = {
          title: existingEmbed.title,
          url: existingEmbed.url,
          color: existingEmbed.color,
          fields,
          thumbnail: existingEmbed.thumbnail,
        };
        await tvIssueTypeSubmitHandler(interaction, mediaEmbed);
        break;
      }
      default: {
        console.error('No handler found for this select interaction');
      }
    }
  });
}
