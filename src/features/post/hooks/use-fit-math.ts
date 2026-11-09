import { useEffect, useState } from "react";

// Scale only oversized formulas. CSS zoom changes layout height as well as width,
// so tall matrices retain their full content without overlapping the next paragraph.
export function useFitMath(): (element: HTMLElement | null) => void {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!root) return;
    let frame = 0;
    let disposed = false;
    const observed = new Set<Element>();
    const resize = new ResizeObserver(schedule);
    function schedule(): void {
      if (disposed || frame) return;
      frame = requestAnimationFrame(fit);
    }
    function fit(): void {
      frame = 0;
      const parents = new Set<Element>([root!]);
      const wrappers = Array.from(
        root!.querySelectorAll<HTMLElement>('[data-type="inline-math"], [data-type="block-math"], .math-preview'),
      );
      if (root!.matches(".math-preview")) wrappers.push(root!);
      wrappers.forEach((wrapper) => {
        const availableBox = wrapper.dataset.type === "inline-math" ? wrapper.parentElement : wrapper;
        const formula = wrapper.querySelector<HTMLElement>(".katex");
        if (!availableBox || !formula) return;
        parents.add(availableBox);
        const style = getComputedStyle(availableBox);
        const available = availableBox.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 8;
        if (available <= 0) return; // A closed toggle will be measured when it opens.
        const previous = parseFloat(formula.style.zoom) || 1;
        const naturalWidth = formula.getBoundingClientRect().width / previous;
        if (!naturalWidth) return;
        const next = Math.min(1, available / naturalWidth);
        if (Math.abs(next - previous) > 0.001) formula.style.zoom = String(next);
      });
      for (const element of observed)
        if (!parents.has(element)) {
          resize.unobserve(element);
          observed.delete(element);
        }
      for (const element of parents)
        if (!observed.has(element)) {
          resize.observe(element);
          observed.add(element);
        }
    }
    const mutation = new MutationObserver(schedule);
    mutation.observe(root, { childList: true, subtree: true });
    root.addEventListener("toggle", schedule, true);
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutation.disconnect();
      root.removeEventListener("toggle", schedule, true);
    };
  }, [root]);
  return setRoot;
}
