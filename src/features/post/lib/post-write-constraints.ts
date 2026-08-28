export const POST_SUMMARY_MAX_LENGTH = 120;
export const POST_TAG_MAX_LENGTH = 24;

export const THUMBNAIL_TARGET_WIDTH = 460;
export const THUMBNAIL_TARGET_HEIGHT = 320;
export const CONTENT_IMAGE_MAX_WIDTH = 1536;
export const POST_IMAGE_WEBP_QUALITY = 0.82;

export const THUMBNAIL_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const THUMBNAIL_ACCEPT = THUMBNAIL_ACCEPTED_TYPES.join(",");
