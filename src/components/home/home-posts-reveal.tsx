import { useEffect, useRef } from "react";
import { getHomePostsRevealOpacity } from "@/features/home/lib/home-posts-reveal";

export function HomePostsReveal(): React.ReactElement {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const updateOpacity = (): void => {
      animationFrameId = null;

      if (!overlayRef.current) return;

      overlayRef.current.style.opacity = String(getHomePostsRevealOpacity(window.scrollY));
    };

    const handleScroll = (): void => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(updateOpacity);
    };

    updateOpacity();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none relative z-20 -mb-[45svh] h-[45svh] bg-gradient-to-b from-[#f5f7fb]/85 via-[#f5f7fb]/40 to-[#f5f7fb]/10 backdrop-blur-[5px] will-change-[opacity] dark:from-[#10141b]/85 dark:via-[#10141b]/40 dark:to-[#10141b]/10"
    />
  );
}
