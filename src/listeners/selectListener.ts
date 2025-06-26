import { Client } from 'discord.js';
import { issueTypeSubmitHandler } from '../handlers/selectHandlers/issueTypeSubmitHandler';
import { issueReportSubmitHandler } from '../handlers/selectHandlers/issueReportSubmitHandler';
import { mediaRequestSubmitHandler } from '../handlers/selectHandlers/mediaRequestSubmitHandler';
import { mediaEmbedBuilder } from '../helpers/mediaEmbedBuilder';
import { tvSeasonSelectHandler } from '../handlers/selectHandlers/tvSeasonSelectHandler';
import { tvSeasonSubmitHandler } from '../handlers/selectHandlers/tvSeasonSubmitHandler';

export function selectListener(client: Client) {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isStringSelectMenu()) return;
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
                    // For TV shows, show season selection first
                    await tvSeasonSelectHandler(interaction, mediaEmbed);
                } else {
                    // For movies, proceed directly to request submission
                    await mediaRequestSubmitHandler(interaction, mediaEmbed);
                }
                break;
            }
            case 'tvSeasonSelect': {
                // For season selection, we need to get the original media embed data
                // from the existing embed rather than rebuilding it from the interaction
                const existingEmbed = interaction.message.embeds[0];
                const mediaEmbed = {
                    title: existingEmbed.title,
                    url: existingEmbed.url,
                    color: existingEmbed.color,
                    fields: [...existingEmbed.fields],
                    thumbnail: existingEmbed.thumbnail
                };
                await tvSeasonSubmitHandler(interaction, mediaEmbed);
                break;
            }
            default: {
                console.error('No handler found for this select interaction');
            }
        }
    });
}
