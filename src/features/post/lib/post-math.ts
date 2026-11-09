import katex, { type KatexOptions } from "katex";

export const MATH_MAX_LENGTH = 5000;
export const mathOptions: KatexOptions = {
  trust: false,
  strict: "error",
  throwOnError: true,
  maxExpand: 200,
  maxSize: 20,
};

export function renderMath(latex: string, displayMode: boolean): string {
  if (!latex.trim() || latex.length > MATH_MAX_LENGTH) throw new Error("수식은 1~5,000자로 입력해 주세요.");
  return katex.renderToString(latex, { ...mathOptions, displayMode });
}

// Call only after sanitizing the saved article. KaTeX receives text, never HTML.
export function renderPostMath(sanitizedHtml: string): string {
  const template = document.createElement("div");
  template.innerHTML = sanitizedHtml;
  template
    .querySelectorAll<HTMLElement>('span[data-type="inline-math"], div[data-type="block-math"]')
    .forEach((element) => {
      const latex = element.getAttribute("data-latex");
      if (!latex) return;
      try {
        element.innerHTML = renderMath(latex, element.dataset.type === "block-math");
      } catch {
        element.textContent = latex;
        element.classList.add("math-error");
      }
    });
  return template.innerHTML;
}
