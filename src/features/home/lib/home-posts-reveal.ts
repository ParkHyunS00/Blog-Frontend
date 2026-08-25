const DEFAULT_FADE_DISTANCE = 180;

export function getHomePostsRevealOpacity(
  scrollY: number,
  fadeDistance = DEFAULT_FADE_DISTANCE,
): number {
  const progress = Math.max(0, scrollY) / fadeDistance;

  return Math.max(0, Math.min(1, 1 - progress));
}
