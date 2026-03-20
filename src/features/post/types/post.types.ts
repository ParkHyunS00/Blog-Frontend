export interface Post {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
  tags: string[];
  category: string;
  createdAt: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface PostDetail {
  id: number;
  title: string;
  category: string;
  createdAt: string;
  content: string;
}
