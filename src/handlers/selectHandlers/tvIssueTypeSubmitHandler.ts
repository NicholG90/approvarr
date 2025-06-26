import { Interaction, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData';
import { UIUtils } from '../../helpers/uiUtils';

export async function tvIssueTypeSubmitHandler(interaction: Interaction, mediaEmbed: any) {
    if (!interaction.isStringSelectMenu()) return;

    // Get the selected episode information
    const selectedEpisode = interaction.values[0];
    
    // Add season and episode information to the embed
    const updatedEmbed = { ...mediaEmbed };
    
    // Find season information from previous selection (stored in the interaction message)
    const existingEmbed = interaction.message.embeds[0];
    let seasonInfo = '';
    let episodeInfo = '';
    
    // Extract season from the select menu custom ID or previous components
    // Since we're at the episode selection stage, we can infer season info
    if (selectedEpisode === 'season') {
        episodeInfo = 'Entire Season';
    } else {
        episodeInfo = `Episode ${selectedEpisode}`;
    }
    
    // Add season/episode fields to the embed
    const seasonField = updatedEmbed.fields.find((field: any) => field.name === 'Season');
    const episodeField = updatedEmbed.fields.find((field: any) => field.name === 'Episode');
    
    if (!episodeField) {
        updatedEmbed.fields.push({
            name: 'Episode',
            value: episodeInfo,
            inline: true
        });
    }

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('issueReportType')
        .setPlaceholder('What is the issue with the media?')
        .addOptions(...issueReasons);
        
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
        .addComponents(selectMenu);
        
    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);
    
    await interaction.update({
        embeds: [updatedEmbed],
        components: allComponents,
    });
}