export function getAvailableTagSuggestions(
  suggestions: string[],
  selectedTags: string[],
  inputValue: string,
): string[] {
  const selectedTagSet = new Set(selectedTags);
  const normalizedInput = inputValue.trim().toLowerCase();

  return suggestions.filter(
    (suggestion) =>
      !selectedTagSet.has(suggestion) && suggestion.toLowerCase().includes(normalizedInput),
  );
}
