import { RiGithubFill, RiMailLine } from "@remixicon/react";

const ICON_LINK_CLASS =
  "flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground";

export function Footer(): React.ReactElement {
  return (
    <footer className="mt-24 w-full border-t border-border/40 bg-background py-8">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-3 px-4">
        <p className="text-sm text-muted-foreground">
          ⓒ 2026. ParkHyunS00 All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/ParkHyunS00"
            target="_blank"
            rel="noopener noreferrer"
            className={ICON_LINK_CLASS}
            aria-label="GitHub"
          >
            <RiGithubFill size={24} />
          </a>
          <a
            href="mailto:parkhyuns00@naver.com"
            className={ICON_LINK_CLASS}
            aria-label="이메일 보내기"
          >
            <RiMailLine size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
