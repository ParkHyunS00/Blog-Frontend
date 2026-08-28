export interface PostWriteForm {
  title: string;
  summary: string;
  thumbnailFile: File | null;
  thumbnailUrl: string;
  thumbnailImageId: number | null;
  category: string;
  tags: string[];
  content: string;
  contentImageIds: number[];
}
