import { Client } from 'discord.js';
import { issueTypeSubmitHandler } from '../handlers/selectHandlers/issueTypeSubmitHandler';
import { issueReportSubmitHandler } from '../handlers/selectHandlers/issueReportSubmitHandler';
import { mediaRequestSubmitHandler } from '../handlers/selectHandlers/mediaRequestSubmitHandler';
import { mediaEmbedBuilder } from '../helpers/mediaEmbedBuilder';
import { tvSeasonSelectHandler } from '../handlers/selectHandlers/tvSeasonSelectHandler';
import { tvSeasonSubmitHandler } from '../handlers/selectHandlers/tvSeasonSubmitHandler';
import { tvIssueEpisodeSelectHandler } from '../handlers/selectHandlers/tvIssueEpisodeSelectHandler';
import { tvIssueTypeSubmitHandler } from '../handlers/selectHandlers/tvIssueTypeSubmitHandler';

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
            case 'tvIssueSeasonSelect': {
                // For TV issue season selection, show episode selection
                const existingEmbed = interaction.message.embeds[0];
                
                // Update or add season field
                const fields = [...existingEmbed.fields];
                const seasonFieldIndex = fields.findIndex(f => f.name === 'Season');
                const seasonField = {
                    name: 'Season',
                    value: `Season ${interaction.values[0]}`,
                    inline: true
                };
                
                if (seasonFieldIndex >= 0) {
                    fields[seasonFieldIndex] = seasonField;
                } else {
                    fields.push(seasonField);
                }
                
                const mediaEmbed = {
                    title: existingEmbed.title,
                    url: existingEmbed.url,
                    color: existingEmbed.color,
                    fields: fields,
                    thumbnail: existingEmbed.thumbnail
                };
                await tvIssueEpisodeSelectHandler(interaction, mediaEmbed);
                break;
            }
            case 'tvIssueEpisodeSelect': {
                // For TV issue episode selection, show issue type selection
                const existingEmbed = interaction.message.embeds[0];
                
                // Update or add episode field
                const fields = [...existingEmbed.fields];
                const episodeFieldIndex = fields.findIndex(f => f.name === 'Episode');
                const episodeValue = interaction.values[0] === 'season' ? 'Entire Season' : `Episode ${interaction.values[0]}`;
                const episodeField = {
                    name: 'Episode',
                    value: episodeValue,
                    inline: true
                };
                
                if (episodeFieldIndex >= 0) {
                    fields[episodeFieldIndex] = episodeField;
                } else {
                    fields.push(episodeField);
                }
                
                const mediaEmbed = {
                    title: existingEmbed.title,
                    url: existingEmbed.url,
                    color: existingEmbed.color,
                    fields: fields,
                    thumbnail: existingEmbed.thumbnail
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
