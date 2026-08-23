const INDENT_SIZE = 4;

export function getEditorIndentationText(isCodeBlock: boolean): string {
  return (isCodeBlock ? " " : "\u00A0").repeat(INDENT_SIZE);
}
