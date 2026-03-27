import { Node, mergeAttributes } from "@tiptap/react";

declare module "@tiptap/react" {
  interface Commands<ReturnType> {
    imageWithCaption: {
      setImageWithCaption: (attrs: { src: string; alt?: string; caption?: string }) => ReturnType;
    };
  }
}

export const ImageWithCaption = Node.create({
  name: "imageWithCaption",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      caption: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure.image-figure",
        getAttrs: (element) => {
          const img = (element as HTMLElement).querySelector("img");
          const figcaption = (element as HTMLElement).querySelector("figcaption");
          return {
            src: img?.getAttribute("src"),
            alt: img?.getAttribute("alt"),
            caption: figcaption?.textContent ?? null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    const children: unknown[] = [
      ["img", mergeAttributes(imgAttrs)],
    ];
    if (caption) {
      children.push(["figcaption", {}, caption]);
    }
    return ["figure", { class: "image-figure" }, ...children];
  },

  addCommands() {
    return {
      setImageWithCaption:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
