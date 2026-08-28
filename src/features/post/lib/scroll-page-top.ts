type ScrollTarget = {
  scrollTo(options: ScrollToOptions): void;
};

export function scrollPageToTop(target: ScrollTarget): void {
  target.scrollTo({ top: 0, left: 0, behavior: "auto" });
}
