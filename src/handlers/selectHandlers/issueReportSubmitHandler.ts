import type { Interaction } from 'discord.js';
import { ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { issueReasons } from '../../constants/issuesData.js';
import { UIUtils } from '../../helpers/uiUtils.js';
import { tvIssueSeasonSelectHandler } from './tvIssueSeasonSelectHandler.js';

export async function issueReportSubmitHandler(interaction: Interaction, mediaEmbed: any) {
  if (!interaction.isStringSelectMenu())
    return;

  const mediaType = interaction.values[0].split('-')[1].trim();

  if (mediaType === 'tv') {
    await tvIssueSeasonSelectHandler(interaction, mediaEmbed);
  }
  else {
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
