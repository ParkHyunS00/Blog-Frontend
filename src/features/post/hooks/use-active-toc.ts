import { useCallback, useEffect, useRef, useState } from "react";
import type { TocItem } from "@/features/post/types/post.types";

const TOP_OFFSET = 100;

type UseActiveTocReturn = {
  activeId: string | null;
  handleTocClick: (id: string) => void;
};

type HeadingPosition = {
  id: string;
  top: number;
};

type ActiveTocOptions = {
  topOffset: number;
  previousActiveId?: string | null;
  scrollEndDistance?: number;
  hysteresis?: number;
};

export function resolveActiveTocId(
  headings: HeadingPosition[],
  {
    topOffset,
    previousActiveId = null,
    scrollEndDistance,
    hysteresis = 24,
  }: ActiveTocOptions,
): string | null {
  let activeId: string | null = null;

  for (const heading of headings) {
    if (heading.top <= topOffset) activeId = heading.id;
  }

  const lastHeading = headings.at(-1);
  if (lastHeading && scrollEndDistance !== undefined) {
    const bottomThreshold = previousActiveId === lastHeading.id ? hysteresis : 1;
    if (scrollEndDistance <= bottomThreshold) return lastHeading.id;
  }

  const previousIndex = headings.findIndex((heading) => heading.id === previousActiveId);
  const activeIndex = headings.findIndex((heading) => heading.id === activeId);
  if (previousIndex > activeIndex) {
    const previousHeading = headings[previousIndex];
    if (previousHeading.top <= topOffset + hysteresis) return previousHeading.id;
  }

  return activeId;
}

export function useActiveToc(items: TocItem[]): UseActiveTocReturn {
  const [activeId, setActiveId] = useState<string | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (items.length === 0) return;

    function update(): void {
      const headings = items.flatMap((item) => {
        const element = document.getElementById(item.id);
        return element ? [{ id: item.id, top: element.getBoundingClientRect().top }] : [];
      });
      const scrollEndDistance = Math.max(
        0,
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight),
      );

      setActiveId((currentActiveId) => {
        const nextActiveId = resolveActiveTocId(headings, {
          topOffset: TOP_OFFSET,
          previousActiveId: currentActiveId,
          scrollEndDistance,
        });

        return currentActiveId === nextActiveId ? currentActiveId : nextActiveId;
      });
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

  const handleTocClick = useCallback((id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - TOP_OFFSET + 10;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return { activeId, handleTocClick };
}
