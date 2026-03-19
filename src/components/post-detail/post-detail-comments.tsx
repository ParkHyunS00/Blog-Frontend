import { lazy, Suspense } from "react";
import { useThemeStore } from "@/core/stores/use-theme-store";

const Giscus = lazy(() => import("@giscus/react").then((m) => ({ default: m.default })));

export function PostDetailComments(): React.ReactElement {
  const isDark = useThemeStore((state) => state.theme === "dark");

  return (
    <section className="mt-16 border-t border-border pt-10">
      <Suspense fallback={null}>
        <Giscus
          repo="ParkHyunS00/Blog-Frontend"
          repoId="R_kgDORGuuyw"
          category="General"
          categoryId="DIC_kwDORGuuy84C4rmA"
          mapping="pathname"
          strict="0"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="bottom"
          theme={isDark ? "dark" : "light"}
          lang="ko"
          loading="lazy"
        />
      </Suspense>
    </section>
  );
}
