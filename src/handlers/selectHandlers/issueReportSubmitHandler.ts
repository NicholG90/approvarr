import type { Interaction } from 'discord.js';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData';
import { UIUtils } from '../../helpers/uiUtils';
import { tvIssueSeasonSelectHandler } from './tvIssueSeasonSelectHandler';

export async function issueReportSubmitHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  // Check if this is a TV show to determine if we need season selection
  const mediaType = interaction.values[0].split('-')[1].trim();

  if (mediaType === 'tv') {
    // For TV shows, show season selection first
    await tvIssueSeasonSelectHandler(interaction, mediaEmbed);
  }
  else {
    // For movies, proceed directly to issue type selection
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('issueReportType')
      .setPlaceholder('What is the issue with the media?')
      .addOptions(...issueReasons);
    const row = new ActionRowBuilder<StringSelectMenuBuilder>()
      .addComponents(selectMenu);

    const allComponents = UIUtils.preserveComponents(interaction.message.components, row);

    await interaction.update({
      embeds: [mediaEmbed],
      components: allComponents,
    });
  }
}
