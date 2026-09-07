export type CategoryLatestPost = {
  category: string;
  categorySlug: string;
  title: string;
  summary: string;
  postCount: number;
  updatedAt: string;
};

export type PopularPost = {
  id: number;
  title: string;
  category: string;
  publishedAt: string;
  viewCount: number;
};

export function formatCompactViewCount(viewCount: number): string {
  if (viewCount < 1000) return viewCount.toLocaleString("en-US");
  const thousands = Math.round(viewCount / 100) / 10;
  return `${thousands}K`;
}
