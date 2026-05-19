export interface PostWriteForm {
  title: string;
  summary: string;
  thumbnailFile: File | null;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  content: string;
}
