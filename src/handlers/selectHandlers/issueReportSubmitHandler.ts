import { Interaction, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData';
import { tvIssueSeasonSelectHandler } from './tvIssueSeasonSelectHandler';

export async function issueReportSubmitHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;
    
    // Check if this is a TV show to determine if we need season selection
    const mediaType = interaction.values[0].split('-')[1].trim();
    
    if (mediaType === 'tv') {
        // For TV shows, show season selection first
        await tvIssueSeasonSelectHandler(interaction, mediaEmbed);
    } else {
        // For movies, proceed directly to issue type selection
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('issueReportType')
            .setPlaceholder('What is the issue with the media?')
            .addOptions(...issueReasons);
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);
        
        // Preserve previous select menus and add the new one
        const existingComponents = interaction.message.components || [];
        const allComponents = [...existingComponents, row];
        
        await interaction.update({
            embeds: [mediaEmbed],
            components: allComponents,
        });
    }
}
