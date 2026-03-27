import { useState, lazy, Suspense } from "react";
import { TitleInput } from "@/components/post-write/title-input";
import { CategorySelect } from "@/components/post-write/category-select";
import { TagInput } from "@/components/post-write/tag-input";
import { DraftListDialog } from "@/components/post-write/draft-list-dialog";
import { Button } from "@/components/ui/button";
import type { PostWriteForm } from "@/features/post/types/post-write.types";
import type { Draft } from "@/features/post/types/draft.types";

// bundle-dynamic-imports: tiptap + lowlight 번들을 지연 로딩
const PostEditor = lazy(() =>
  import("@/components/post-write/post-editor").then((m) => ({ default: m.PostEditor }))
);

// TODO: 추후 API 연동 시 실제 데이터로 교체
const MOCK_CATEGORIES = ["DX", "Frontend", "Backend", "DevOps", "AI"];
const MOCK_TAG_SUGGESTIONS = ["React", "TypeScript", "Next.js", "Vite", "Tailwind", "Node.js", "Docker", "Kubernetes", "Claude", "AI"];

const MOCK_DRAFTS: Draft[] = [
  {
    id: "1",
    title: "React 19의 새로운 기능 정리",
    category: "Frontend",
    tags: ["React", "TypeScript"],
    content: "<p>React 19에서 달라진 점들을 정리합니다...</p>",
    savedAt: "2026-03-27T14:30:00",
  },
  {
    id: "2",
    title: "Docker 멀티스테이지 빌드 가이드",
    category: "DevOps",
    tags: [],
    content: "<p>멀티스테이지 빌드를 활용하면...</p>",
    savedAt: "2026-03-26T09:15:00",
  },
  {
    id: "3",
    title: "",
    category: "AI",
    tags: ["Claude", "AI"],
    content: "<p>Claude API를 활용한 프로젝트...</p>",
    savedAt: "2026-03-25T18:45:00",
  },
  {
    id: "4",
    title: "",
    category: "",
    tags: [],
    content: "<p>아이디어 메모...</p>",
    savedAt: "2026-03-24T22:00:00",
  },
  {
    id: "5",
    title: "Kubernetes 클러스터 운영에서 자주 겪는 트러블슈팅 사례 모음집",
    category: "Infrastructure & Cloud Native",
    tags: ["Kubernetes", "Docker", "CI/CD", "Monitoring", "Troubleshooting"],
    content: "<p>K8s 운영 중 자주 겪는 문제들...</p>",
    savedAt: "2026-03-23T11:20:00",
  },
  {
    id: "6",
    title: "Tailwind CSS v4 마이그레이션",
    category: "Frontend",
    tags: ["Tailwind"],
    content: "<p>Tailwind v4로 마이그레이션하면서...</p>",
    savedAt: "2026-03-22T16:00:00",
  },
  {
    id: "7",
    title: "",
    category: "Backend",
    tags: [],
    content: "<p>API 설계 초안...</p>",
    savedAt: "2026-03-21T08:30:00",
  },
  {
    id: "8",
    title: "Zustand vs Jotai 비교",
    category: "",
    tags: ["React", "TypeScript", "Zustand"],
    content: "<p>상태 관리 라이브러리 비교...</p>",
    savedAt: "2026-03-20T20:10:00",
  },
  {
    id: "9",
    title: "Vite 플러그인 개발기",
    category: "DX",
    tags: ["Vite", "TypeScript"],
    content: "<p>커스텀 Vite 플러그인을 만들면서...</p>",
    savedAt: "2026-03-19T13:45:00",
  },
  {
    id: "10",
    title: "",
    category: "",
    tags: ["AI"],
    content: "<p>LLM 관련 메모...</p>",
    savedAt: "2026-03-18T09:00:00",
  },
  {
    id: "11",
    title: "GitHub Actions 워크플로우 최적화",
    category: "DevOps",
    tags: ["CI/CD", "Docker"],
    content: "<p>빌드 시간 단축을 위한...</p>",
    savedAt: "2026-03-17T15:30:00",
  },
  {
    id: "12",
    title: "Next.js App Router 심층 분석",
    category: "Frontend",
    tags: ["Next.js", "React", "TypeScript", "Vercel", "Performance"],
    content: "<p>App Router의 내부 동작을...</p>",
    savedAt: "2026-03-16T10:00:00",
  },
];

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

  function handleDraftSelect(draft: Draft): void {
    // TODO: 추후 API 연동
    console.log("불러오기:", draft);
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
          <DraftListDialog drafts={MOCK_DRAFTS} onSelect={handleDraftSelect} />
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
