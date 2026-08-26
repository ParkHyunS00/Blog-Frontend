const DEFAULT_TERMINAL_POST_TITLE_LENGTH = 36;

export function truncateTerminalPostTitle(
  title: string,
  maxLength = DEFAULT_TERMINAL_POST_TITLE_LENGTH,
): string {
  const characters = Array.from(title);

  if (characters.length <= maxLength) return title;

  return `${characters.slice(0, maxLength).join("").trimEnd()}...`;
}
