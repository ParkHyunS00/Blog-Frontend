import { useState, lazy, Suspense } from "react";
import { TitleInput } from "@/components/post-write/title-input";
import { CategorySelect } from "@/components/post-write/category-select";
import { TagInput } from "@/components/post-write/tag-input";
import { Button } from "@/components/ui/button";
import type { PostWriteForm } from "@/features/post/types/post-write.types";

// bundle-dynamic-imports: tiptap + lowlight 번들을 지연 로딩
const PostEditor = lazy(() =>
  import("@/components/post-write/post-editor").then((m) => ({ default: m.PostEditor }))
);

// TODO: 추후 API 연동 시 실제 데이터로 교체
const MOCK_CATEGORIES = ["DX", "Frontend", "Backend", "DevOps", "AI"];
const MOCK_TAG_SUGGESTIONS = ["React", "TypeScript", "Next.js", "Vite", "Tailwind", "Node.js", "Docker", "Kubernetes", "Claude", "AI"];

export function PostWritePage(): React.ReactElement {
  const [form, setForm] = useState<PostWriteForm>({
    title: "",
    category: "",
    tags: [],
    content: "",
  });

  function handleTitleChange(title: string): void {
    setForm((prev) => ({ ...prev, title }));
  }

  function handleCategoryChange(category: string): void {
    setForm((prev) => ({ ...prev, category }));
  }

  function handleTagsChange(tags: string[]): void {
    setForm((prev) => ({ ...prev, tags }));
  }

  function handleContentChange(content: string): void {
    setForm((prev) => ({ ...prev, content }));
  }

  function handleDraft(): void {
    // TODO: 추후 API 연동
    console.log("임시 저장:", form);
  }

  function handlePublish(): void {
    // TODO: 추후 API 연동
    console.log("업로드:", form);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <div className="space-y-6">
        {/* 제목 */}
        <TitleInput value={form.title} onChange={handleTitleChange} />

        {/* 카테고리 & 태그 */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">카테고리</label>
            <CategorySelect
              value={form.category}
              onChange={handleCategoryChange}
              categories={MOCK_CATEGORIES}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">태그</label>
            <TagInput
              value={form.tags}
              onChange={handleTagsChange}
              suggestions={MOCK_TAG_SUGGESTIONS}
            />
          </div>
        </div>

        {/* 본문 에디터 - async-suspense-boundaries: 에디터 번들 로딩 중 폴백 표시 */}
        <Suspense fallback={<div className="flex h-[600px] items-center justify-center rounded-lg border border-border bg-background text-muted-foreground">에디터 로딩 중...</div>}>
          <PostEditor
            content={form.content}
            onChange={handleContentChange}
            className="h-[600px]"
          />
        </Suspense>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleDraft}>
            임시 저장
          </Button>
          <Button onClick={handlePublish}>
            업로드
          </Button>
        </div>
      </div>
    </div>
  );
}
