import {
  CONTENT_IMAGE_MAX_WIDTH,
  POST_IMAGE_WEBP_QUALITY,
  THUMBNAIL_TARGET_HEIGHT,
  THUMBNAIL_TARGET_WIDTH,
} from "../../post/lib/post-write-constraints.ts";
import type { PostImageType } from "../types/post-write-api.types.ts";

type PostImageResizePlan = {
  sourceX: number;
  sourceY: number;
  sourceWidth: number;
  sourceHeight: number;
  targetWidth: number;
  targetHeight: number;
};

function assertValidDimensions(width: number, height: number): void {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error("이미지 크기가 올바르지 않습니다.");
  }
}

export function getPostImageResizePlan(
  sourceWidth: number,
  sourceHeight: number,
  type: PostImageType,
): PostImageResizePlan {
  assertValidDimensions(sourceWidth, sourceHeight);

  if (type === "CONTENT") {
    const scale = Math.min(1, CONTENT_IMAGE_MAX_WIDTH / sourceWidth);
    return {
      sourceX: 0,
      sourceY: 0,
      sourceWidth,
      sourceHeight,
      targetWidth: Math.round(sourceWidth * scale),
      targetHeight: Math.round(sourceHeight * scale),
    };
  }

  const targetRatio = THUMBNAIL_TARGET_WIDTH / THUMBNAIL_TARGET_HEIGHT;
  const sourceRatio = sourceWidth / sourceHeight;
  let croppedWidth = sourceWidth;
  let croppedHeight = sourceHeight;

  if (sourceRatio > targetRatio) {
    croppedWidth = sourceHeight * targetRatio;
  } else if (sourceRatio < targetRatio) {
    croppedHeight = sourceWidth / targetRatio;
  }

  return {
    sourceX: (sourceWidth - croppedWidth) / 2,
    sourceY: (sourceHeight - croppedHeight) / 2,
    sourceWidth: croppedWidth,
    sourceHeight: croppedHeight,
    targetWidth: THUMBNAIL_TARGET_WIDTH,
    targetHeight: THUMBNAIL_TARGET_HEIGHT,
  };
}

function canvasToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.type !== "image/webp") {
          reject(new Error("이미지를 WebP 형식으로 변환하지 못했습니다."));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      POST_IMAGE_WEBP_QUALITY,
    );
  });
}

function toWebpFileName(fileName: string): string {
  const baseName = fileName.replace(/\.[^./\\]+$/, "").trim();
  return `${baseName || "image"}.webp`;
}

export async function optimizePostImage(file: File, type: PostImageType): Promise<File> {
  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("이미지를 불러올 수 없습니다. 다른 파일을 선택하세요.");
  }

  try {
    const plan = getPostImageResizePlan(bitmap.width, bitmap.height, type);
    const canvas = document.createElement("canvas");
    canvas.width = plan.targetWidth;
    canvas.height = plan.targetHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("이미지를 변환할 수 없는 브라우저입니다.");

    context.drawImage(
      bitmap,
      plan.sourceX,
      plan.sourceY,
      plan.sourceWidth,
      plan.sourceHeight,
      0,
      0,
      plan.targetWidth,
      plan.targetHeight,
    );

    const webpBlob = await canvasToWebp(canvas);
    return new File([webpBlob], toWebpFileName(file.name), {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    bitmap.close();
  }
}
