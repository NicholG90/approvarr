import type { StringSelectMenuOptionBuilder } from 'discord.js';
import { StringSelectMenuBuilder } from 'discord.js';

/**
 * Creates a select menu with dynamic placeholder based on current selection
 * @param customId The custom ID for the select menu
 * @param options The options for the select menu
 * @param defaultPlaceholder The default placeholder when no selection is made
 * @param currentSelection The current selected value (if any)
 * @param currentSelectionLabel The display label for the current selection
 * @returns Configured StringSelectMenuBuilder
 */
export function createSelectMenuWithPlaceholder(
  customId: string,
  options: StringSelectMenuOptionBuilder[],
  defaultPlaceholder: string,
  currentSelection?: string,
  currentSelectionLabel?: string,
): StringSelectMenuBuilder {
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(customId)
    .addOptions(...options);

  if (currentSelection && currentSelectionLabel) {
    selectMenu.setPlaceholder(`✓ ${currentSelectionLabel}`);
  }
  else {
    selectMenu.setPlaceholder(defaultPlaceholder);
  }

  return selectMenu;
}

/**
 * Extracts current selection information from embed fields
 * @param embed The message embed
 * @param fieldName The name of the field to extract
 * @returns Object with value and label, or null if not found
 */
export function extractCurrentSelection(embed: any, fieldName: string): { value: string; label: string } | null {
  const field = embed.fields?.find((f: any) => f.name === fieldName);
  if (!field)
    return null;

  return {
    value: field.value,
    label: field.value,
  };
}
