import type { PostWriteForm } from "@/features/post/types/post-write.types";

const MEANINGFUL_EMBED_PATTERN = /<(?:img|video|audio|iframe|table|blockquote)\b/i;
const HTML_TAG_PATTERN = /<[^>]*>/g;
const HTML_WHITESPACE_PATTERN = /(?:&nbsp;|&#160;|&#xA0;)/gi;

function hasMeaningfulBody(content: string): boolean {
  if (MEANINGFUL_EMBED_PATTERN.test(content)) return true;

  return content
    .replace(HTML_TAG_PATTERN, "")
    .replace(HTML_WHITESPACE_PATTERN, " ")
    .trim().length > 0;
}

export function hasPostWriteContent(form: PostWriteForm): boolean {
  return (
    form.title.trim().length > 0 ||
    form.summary.trim().length > 0 ||
    form.thumbnailFile !== null ||
    form.thumbnailUrl.trim().length > 0 ||
    form.category.trim().length > 0 ||
    form.tags.length > 0 ||
    hasMeaningfulBody(form.content)
  );
}
