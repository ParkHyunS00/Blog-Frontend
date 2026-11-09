import { useFitMath } from "@/features/post/hooks/use-fit-math";
import { renderPostMath } from "@/features/post/lib/post-math";
import DOMPurify from "dompurify";
import { memo, useMemo, useState } from "react";
import { PostImageViewer, type ViewerImage } from "./post-image-viewer";
import { processCodeBlocks } from "@/features/post/lib/highlight-code";
import { API_BASE_URL } from "@/core/lib/api-client";
import { toPostImageDisplayHtml } from "@/features/post/lib/post-image-url";
import { optimizePostContentImages } from "@/features/post/lib/optimize-post-content-images";
import { wrapPostTables } from "@/features/post/lib/wrap-post-tables";

type PostDetailContentProps = {
  content: string;
  postTitle: string;
};

export const PostDetailContent = memo(function PostDetailContent({
  content,
  postTitle,
}: PostDetailContentProps): React.ReactElement {
  const mathRoot = useFitMath();
  const [viewer, setViewer] = useState<{
    images: ViewerImage[];
    index: number;
    target: HTMLElement;
    content: string;
  } | null>(null);
  // Keep the innerHTML prop stable so unrelated renders preserve native details state.
  const contentHtml = useMemo(
    () => ({
      __html: optimizePostContentImages(
        renderPostMath(
          DOMPurify.sanitize(wrapPostTables(processCodeBlocks(toPostImageDisplayHtml(content, API_BASE_URL)))),
        ),
      ),
    }),
    [content],
  );

  function handleClick(e: React.MouseEvent<HTMLElement>): void {
    const target = e.target as HTMLElement;
    if (target instanceof HTMLImageElement && target.dataset.imageViewer === "true") {
      openImage(target, e.currentTarget);
      return;
    }
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

  function openImage(target: HTMLImageElement, article: HTMLElement): void {
    const elements = Array.from(article.querySelectorAll<HTMLImageElement>('img[data-image-viewer="true"]')).filter(
      (image) => image.getClientRects().length > 0,
    );
    const index = elements.indexOf(target);
    if (index < 0) return;
    setViewer({
      content,
      index,
      target,
      images: elements.map((image) => ({
        src: image.currentSrc || image.src,
        alt: image.alt,
        caption: image.closest("figure")?.querySelector("figcaption")?.textContent?.trim() || "",
      })),
    });
  }

  return (
    <>
      <article
        ref={mathRoot}
        className="post-content"
        onClick={handleClick}
        onKeyDown={(event) => {
          if (
            (event.key === "Enter" || event.key === " ") &&
            event.target instanceof HTMLImageElement &&
            event.target.dataset.imageViewer === "true"
          ) {
            event.preventDefault();
            openImage(event.target, event.currentTarget);
          }
        }}
        dangerouslySetInnerHTML={contentHtml}
      />
      {viewer && viewer.content === content && (
        <PostImageViewer
          postTitle={postTitle}
          images={viewer.images}
          initialIndex={viewer.index}
          returnFocus={viewer.target}
          onClose={() => setViewer(null)}
        />
      )}
    </>
  );
});
