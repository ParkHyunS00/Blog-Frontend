import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import yaml from "highlight.js/lib/languages/yaml";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("java", java);
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("yml", yaml);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("json", json);

const cache = new Map<string, string>();

export function processCodeBlocks(html: string): string {
  const cached = cache.get(html);
  if (cached) return cached;

  const result = html.replace(
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g,
    (_, lang: string, code: string) => {
      const decoded = code
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');

      let highlighted: string;
      try {
        highlighted = hljs.highlight(decoded, { language: lang }).value;
      } catch {
        highlighted = code;
      }

      const lines = highlighted.split("\n");
      if (lines.length > 0 && lines[lines.length - 1].trim() === "") {
        lines.pop();
      }

      const lineNumbers = lines.map((_, i) => `<span>${i + 1}</span>`).join("\n");

      return `<div class="code-block-wrapper">
        <div class="code-block-header">
          <div class="code-block-dots">
            <span class="dot dot-red"></span>
            <span class="dot dot-yellow"></span>
            <span class="dot dot-green"></span>
          </div>
          <span class="code-block-lang">${lang}</span>
          <button type="button" class="code-block-copy" data-code>Copy</button>
        </div>
        <pre><div class="code-block-lines">${lineNumbers}</div><code class="hljs">${highlighted}</code></pre>
      </div>`;
    },
  );

  cache.set(html, result);
  return result;
}
