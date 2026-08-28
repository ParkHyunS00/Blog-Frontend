import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { getPostImageResizePlan, optimizePostImage } from "./optimize-post-image.ts";

const originalCreateImageBitmap = Object.getOwnPropertyDescriptor(globalThis, "createImageBitmap");
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");

afterEach(() => {
  if (originalCreateImageBitmap) {
    Object.defineProperty(globalThis, "createImageBitmap", originalCreateImageBitmap);
  } else {
    Reflect.deleteProperty(globalThis, "createImageBitmap");
  }

  if (originalDocument) {
    Object.defineProperty(globalThis, "document", originalDocument);
  } else {
    Reflect.deleteProperty(globalThis, "document");
  }
});

test("가로로 긴 썸네일은 중앙을 기준으로 23:16 영역을 잘라낸다", () => {
  assert.deepEqual(getPostImageResizePlan(2000, 1200, "THUMBNAIL"), {
    sourceX: 137.5,
    sourceY: 0,
    sourceWidth: 1725,
    sourceHeight: 1200,
    targetWidth: 460,
    targetHeight: 320,
  });
});

test("세로로 긴 썸네일은 중앙을 기준으로 23:16 영역을 잘라낸다", () => {
  const plan = getPostImageResizePlan(1200, 2000, "THUMBNAIL");

  assert.equal(plan.sourceX, 0);
  assert.ok(Math.abs(plan.sourceY - 582.6086956521739) < Number.EPSILON * 1000);
  assert.equal(plan.sourceWidth, 1200);
  assert.ok(Math.abs(plan.sourceHeight - 834.7826086956521) < Number.EPSILON * 1000);
  assert.equal(plan.targetWidth, 460);
  assert.equal(plan.targetHeight, 320);
});

test("본문 이미지는 비율을 유지하며 최대 너비 1536px로 축소한다", () => {
  assert.deepEqual(getPostImageResizePlan(2000, 1200, "CONTENT"), {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 2000,
    sourceHeight: 1200,
    targetWidth: 1536,
    targetHeight: 922,
  });
});

test("최대 너비보다 작은 본문 이미지는 확대하지 않는다", () => {
  assert.deepEqual(getPostImageResizePlan(800, 600, "CONTENT"), {
    sourceX: 0,
    sourceY: 0,
    sourceWidth: 800,
    sourceHeight: 600,
    targetWidth: 800,
    targetHeight: 600,
  });
});

test("유효하지 않은 이미지 크기는 거부한다", () => {
  assert.throws(() => getPostImageResizePlan(0, 600, "CONTENT"), /이미지 크기/);
});

test("썸네일 파일을 460x320 WebP 파일로 변환한다", async () => {
  let canvasWidth = 0;
  let canvasHeight = 0;
  let drawArguments: unknown[] = [];
  let bitmapClosed = false;
  const bitmap = {
    width: 2000,
    height: 1200,
    close() {
      bitmapClosed = true;
    },
  };
  const canvas = {
    get width() {
      return canvasWidth;
    },
    set width(value: number) {
      canvasWidth = value;
    },
    get height() {
      return canvasHeight;
    },
    set height(value: number) {
      canvasHeight = value;
    },
    getContext() {
      return {
        drawImage(...args: unknown[]) {
          drawArguments = args;
        },
      };
    },
    toBlob(callback: BlobCallback, type?: string) {
      callback(new Blob(["optimized"], { type }));
    },
  };

  Object.defineProperty(globalThis, "createImageBitmap", {
    configurable: true,
    value: async () => bitmap,
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      createElement: () => canvas,
    },
  });

  const optimized = await optimizePostImage(
    new File(["source"], "thumbnail.png", { type: "image/png" }),
    "THUMBNAIL",
  );

  assert.equal(optimized.name, "thumbnail.webp");
  assert.equal(optimized.type, "image/webp");
  assert.equal(canvasWidth, 460);
  assert.equal(canvasHeight, 320);
  assert.deepEqual(drawArguments.slice(1), [137.5, 0, 1725, 1200, 0, 0, 460, 320]);
  assert.equal(bitmapClosed, true);
});
