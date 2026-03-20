import { useState, useEffect, useRef } from "react";
import type { TocItem } from "@/features/post/types/post.types";

const TOP_OFFSET = 100;

type UseActiveTocReturn = {
  activeId: string | null;
  handleTocClick: (id: string) => void;
};

export function useActiveToc(items: TocItem[]): UseActiveTocReturn {
  const [activeId, setActiveId] = useState<string | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (items.length === 0) return;

    function update(): void {
      // 페이지 하단 도달 시 마지막 헤딩
      const scrollBottom = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight - scrollBottom < 30) {
        setActiveId(items[items.length - 1].id);
        return;
      }

      // TOP_OFFSET 을 지난 마지막 헤딩
      let active: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= TOP_OFFSET) {
          active = item.id;
        }
      }
      setActiveId(active);
    }

    function handleScroll(): void {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId.current);
    };
  }, [items]);

  function handleTocClick(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - TOP_OFFSET + 10;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  return { activeId, handleTocClick };
}
