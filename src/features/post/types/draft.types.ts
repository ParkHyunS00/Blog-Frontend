export interface Draft {
  id: string;
  title: string;
  summary?: string;
  thumbnailUrl?: string;
  category: string;
  tags: string[];
  content: string;
  savedAt: string;
}
