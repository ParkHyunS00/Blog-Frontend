const POST_IMAGE_SRC_PATTERN = /\bsrc=["']\/api\/post-images\/([1-9][0-9]*)["']/gi;

export function extractContentImageIds(html: string): number[] {
  const ids = new Set<number>();
  for (const match of html.matchAll(POST_IMAGE_SRC_PATTERN)) ids.add(Number(match[1]));
  return [...ids];
}

export function diffImageIds(previousIds: number[], currentIds: number[]): number[] {
  const currentIdSet = new Set(currentIds);
  return previousIds.filter((id) => !currentIdSet.has(id));
}
