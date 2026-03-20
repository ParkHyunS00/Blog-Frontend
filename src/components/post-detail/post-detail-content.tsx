import { processCodeBlocks } from "@/features/post/lib/highlight-code";

type PostDetailContentProps = {
  content: string;
};

export function PostDetailContent({ content }: PostDetailContentProps): React.ReactElement {
  const processedContent = processCodeBlocks(content);

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
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
