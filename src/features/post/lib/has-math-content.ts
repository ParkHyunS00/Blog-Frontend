// Recognize the stored math nodes, not KaTeX's generated display HTML.
export function hasMathContent(html: string): boolean {
  const tags = html.match(/<(?:span|div)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi) ?? [];
  return tags.some((tag) => {
    const attributes = new Map<string, string>();
    for (const match of tag.matchAll(/([^\s=<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]);
    }
    const type = attributes.get("data-type");
    const validType = /^<span\b/i.test(tag) ? type === "inline-math" : type === "block-math";
    return (
      validType &&
      !!attributes
        .get("data-latex")
        ?.replace(/&nbsp;|&#(?:160|32);|&#x(?:a0|20);/gi, " ")
        .trim()
    );
  });
}
