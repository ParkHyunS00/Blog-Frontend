export type PostTagSize = "sm" | "lg";

const POST_TAG_SIZE_CLASS_NAMES: Record<PostTagSize, string> = {
  sm: "px-3 py-1 text-xs",
  lg: "px-4 py-2 text-sm",
};

export function getPostTagSizeClassName(size: PostTagSize): string {
  return POST_TAG_SIZE_CLASS_NAMES[size];
}
