import DOMPurify from "dompurify";
import { useMemo } from "react";
import { processCodeBlocks } from "@/features/post/lib/highlight-code";
import { API_BASE_URL } from "@/core/lib/api-client";
import { toPostImageDisplayHtml } from "@/features/post/lib/post-image-url";
import { optimizePostContentImages } from "@/features/post/lib/optimize-post-content-images";

type PostDetailContentProps = {
  content: string;
};

export function PostDetailContent({ content }: PostDetailContentProps): React.ReactElement {
  const sanitizedContent = useMemo(
    () => optimizePostContentImages(
      DOMPurify.sanitize(processCodeBlocks(toPostImageDisplayHtml(content, API_BASE_URL))),
    ),
    [content],
  );

  function handleClick(e: React.MouseEvent<HTMLElement>): void {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("code-block-copy")) return;

    const wrapper = target.closest(".code-block-wrapper");
    const code = wrapper?.querySelector("code");
    if (code) {
      navigator.clipboard.writeText(code.textContent ?? "");
      target.textContent = "Copied!";
      setTimeout(() => {
        target.textContent = "Copy";
      }, 2000);
    }
  }

  return (
    <article
      className="post-content"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
