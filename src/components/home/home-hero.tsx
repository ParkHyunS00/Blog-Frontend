import { RiArrowDownLine } from "@remixicon/react";
import { Link } from "react-router-dom";
import { truncateTerminalPostTitle } from "@/features/home/lib/terminal-post-title";

const TERMINAL_SECTIONS = [
  { command: "whoami", lines: ["Hi, I'm Hyunsoo."] },
  { command: "echo $FOCUS", lines: ["Web", "AI", "Infrastructure"] },
  { command: "echo $MINDSET", lines: ["understand deeply", "keep improving"] },
] as const;

type HomeHeroProps = {
  latestPost: { id: number; title: string } | null;
  isLatestPostLoading: boolean;
  isLatestPostError: boolean;
};

const BACKGROUND_TOKENS = [
  { text: "</>", className: "left-1/2 top-[7%] -translate-x-1/2 opacity-60" },
  { text: "class Blog {", className: "left-[31%] top-[13%] opacity-70" },
  { text: "public static", className: "right-[27%] top-[16%] opacity-50" },
  { text: "<T>", className: "left-[18%] top-[22%] text-xs opacity-80" },
  { text: "{ ... }", className: "right-[13%] top-[25%] text-xs opacity-70" },
  { text: "@Transactional", className: "left-[5%] top-[35%] opacity-60" },
  { text: "SELECT *", className: "right-[22%] top-[37%] opacity-80" },
  { text: "HTTP 200", className: "right-[5%] top-[45%] opacity-60" },
  { text: "return result;", className: "left-[8%] top-[52%] opacity-70" },
  { text: "items.map(() =>)", className: "right-[11%] top-[58%] opacity-50" },
  { text: "docker compose", className: "left-[19%] top-[66%] opacity-60" },
  { text: "JOIN", className: "right-[23%] top-[69%] text-xs opacity-80" },
  { text: "011010", className: "left-[6%] top-[77%] opacity-50" },
  { text: "0xCAFE", className: "right-[7%] top-[80%] opacity-70" },
  { text: "git commit", className: "left-[27%] top-[86%] opacity-60" },
  { text: "const api = await fetch()", className: "right-[27%] top-[88%] opacity-50" },
  { text: "::", className: "left-1/2 top-[93%] -translate-x-1/2 text-xs opacity-70" },
] as const;

const LIGHT_DOT_STYLE: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(48, 92, 236, 0.13) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

const DARK_DOT_STYLE: React.CSSProperties = {
  backgroundImage: "radial-gradient(circle, rgba(91, 127, 255, 0.13) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

function scrollToPostList(): void {
  document.getElementById("post-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomeHero({ latestPost, isLatestPostLoading, isLatestPostError }: HomeHeroProps): React.ReactElement {
  return (
    <section
      className="relative z-10 flex min-h-[clamp(36rem,91svh,58rem)] w-full items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-10 dark:bg-[#10141b] sm:px-6 sm:py-12"
      aria-labelledby="home-hero-title"
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-70 dark:hidden" style={LIGHT_DOT_STYLE} />
      <div aria-hidden="true" className="absolute inset-0 hidden opacity-70 dark:block" style={DARK_DOT_STYLE} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(48,92,236,0.11),transparent_58%)] dark:bg-[radial-gradient(circle_at_center,rgba(91,127,255,0.10),transparent_58%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 hidden font-mono text-[11px] tracking-wide text-[#305CEC]/25 sm:block dark:text-[#8ba6ff]/25"
      >
        {BACKGROUND_TOKENS.map((token) => (
          <span key={`${token.text}-${token.className}`} className={`absolute ${token.className}`}>
            {token.text}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-[640px] -translate-y-8 flex-col items-center sm:-translate-y-10">
        <div className="mb-8 flex w-full flex-col items-center text-center">
          <div className="flex w-full max-w-[270px] items-center gap-3 font-mono text-[9px] tracking-[0.28em] text-[#68738a] dark:text-[#9aa5b8] sm:text-[10px]"></div>
          <h1
            id="home-hero-title"
            className="mt-5 mb-4 text-[clamp(1.75rem,5vw,3rem)] leading-tight font-bold tracking-[-0.035em] text-[#151b29] dark:text-[#f4f7ff]"
          >
            In Pursuit of Growth
          </h1>
        </div>

        <div className="w-full max-w-[600px] overflow-hidden rounded-xl border border-black/10 bg-white/95 shadow-[0_24px_80px_rgba(35,48,82,0.18)] dark:border-white/10 dark:bg-[#171b22]/95 dark:shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
          <div className="relative flex h-10 items-center justify-center border-b border-black/8 bg-[#eef0f4] px-4 font-mono text-[11px] text-[#667085] dark:border-white/8 dark:bg-[#11151b] dark:text-[#8b94a3]">
            <div aria-hidden="true" className="absolute left-4 flex items-center gap-2">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-[#28c840]" />
            </div>
            <span>parkhyunsoo - zsh</span>
          </div>

          <div className="min-h-[320px] px-6 py-4 font-mono text-[13px] leading-5 sm:px-8 sm:text-sm sm:leading-6">
            <div className="space-y-5">
              {TERMINAL_SECTIONS.map((section) => (
                <div key={section.command}>
                  <p>
                    <span className="text-[#305CEC] dark:text-[#7395ff]">~ %</span>{" "}
                    <span className="text-[#172033] dark:text-[#e7eaf0]">{section.command}</span>
                  </p>
                  <div className="mt-0.5 text-[#4b5565] dark:text-[#c4cad4]">
                    {section.lines.map((line) => (
                      <p key={line} className={section.command === "whoami" ? "font-bold" : undefined}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              <div>
                <p>
                  <span className="text-[#305CEC] dark:text-[#7395ff]">~ %</span>{" "}
                  <span className="text-[#172033] dark:text-[#e7eaf0]">latest --post</span>
                </p>
                <div className="mt-0.5 min-w-0 text-[#4b5565] dark:text-[#c4cad4]">
                  {isLatestPostLoading ? <p>loading latest post...</p> : null}
                  {isLatestPostError ? <p>unable to load latest post</p> : null}
                  {!isLatestPostLoading && !isLatestPostError && !latestPost ? <p>no published posts yet</p> : null}
                  {latestPost ? (
                    <p className="flex min-w-0">
                      <span aria-hidden="true">&quot;</span>
                      <Link
                        to={`/posts/${latestPost.id}`}
                        title={latestPost.title}
                        className="min-w-0 truncate text-[#16803c] underline decoration-current/35 underline-offset-4 transition-colors hover:text-[#0f6b31] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16803c] dark:text-[#4ade80] dark:hover:text-[#86efac] dark:focus-visible:outline-[#4ade80]"
                      >
                        {truncateTerminalPostTitle(latestPost.title)}
                      </Link>
                      <span aria-hidden="true">&quot;</span>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <p aria-hidden="true" className="mt-3">
              <span className="text-[#305CEC] dark:text-[#7395ff]">~ %</span>{" "}
              <span className="inline-block h-[1em] w-1 translate-y-[2px] animate-[caret-blink_1s_steps(1,end)_infinite] bg-[#305CEC] motion-reduce:animate-none dark:bg-[#7395ff]" />
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="group absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 font-mono text-[10px] font-medium tracking-[0.3em] whitespace-nowrap text-[#34446b] transition-colors before:pointer-events-none before:absolute before:-inset-x-24 before:-inset-y-10 before:-z-10 before:bg-[radial-gradient(ellipse_at_center,rgba(48,92,236,0.22),transparent_68%)] before:content-[''] hover:text-[#244fd4] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#305CEC] dark:text-[#dbe4ff] dark:before:bg-[radial-gradient(ellipse_at_center,rgba(91,127,255,0.24),transparent_68%)] dark:hover:text-white dark:focus-visible:outline-[#8ba6ff]"
        aria-label="게시글 목록으로 이동"
        onClick={scrollToPostList}
      >
        <span className="flex size-11 items-center justify-center rounded-[10px] border border-[#305CEC]/55 bg-white/45 shadow-[0_0_24px_rgba(48,92,236,0.22),inset_0_0_12px_rgba(48,92,236,0.08)] backdrop-blur-sm transition-[transform,border-color,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:border-[#305CEC]/90 group-hover:shadow-[0_0_30px_rgba(48,92,236,0.34),inset_0_0_14px_rgba(48,92,236,0.10)] dark:border-[#a9baff]/65 dark:bg-[#172033]/65 dark:shadow-[0_0_26px_rgba(91,127,255,0.30),inset_0_0_12px_rgba(139,166,255,0.10)] dark:group-hover:border-[#cbd5ff]/90 dark:group-hover:shadow-[0_0_34px_rgba(91,127,255,0.42),inset_0_0_14px_rgba(139,166,255,0.14)]">
          <RiArrowDownLine
            aria-hidden="true"
            className="size-5 animate-bounce drop-shadow-[0_0_6px_currentColor] motion-reduce:animate-none"
          />
        </span>
        <span className="drop-shadow-[0_0_10px_rgba(48,92,236,0.30)] dark:drop-shadow-[0_0_10px_rgba(139,166,255,0.45)]">
          EXPLORE POSTS
        </span>
      </button>
    </section>
  );
}
