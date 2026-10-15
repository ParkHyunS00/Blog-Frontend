import { useLayoutEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { ChevronLeft, ChevronRight, Minus, Plus, Minimize2, X } from "lucide-react";

export type ViewerImage = { src: string; alt: string; caption: string };
const control = "flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30";

export function PostImageViewer({ images, initialIndex, onClose, returnFocus, postTitle }: {
  postTitle: string;
  images: ViewerImage[];
  initialIndex: number;
  onClose: () => void;
  returnFocus: HTMLElement | null;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [stageHeight, setStageHeight] = useState<number>();
  const panel = useRef<HTMLDivElement>(null);
  const header = useRef<HTMLDivElement>(null);
  const footer = useRef<HTMLElement>(null);
  const imageBox = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const previousZoom = useRef(1);
  const image = images[index];

  useLayoutEffect(() => {
    const root = panel.current;
    const top = header.current;
    const bottom = footer.current;
    const box = imageBox.current;
    if (!root || !top || !bottom || !box) return;
    const measure = () => {
      const padding = getComputedStyle(box);
      const horizontal = parseFloat(padding.paddingLeft) + parseFloat(padding.paddingRight);
      const vertical = parseFloat(padding.paddingTop) + parseFloat(padding.paddingBottom);
      const maxHeight = parseFloat(getComputedStyle(root).maxHeight);
      const available = Math.max(0, maxHeight - top.offsetHeight - bottom.offsetHeight);
      const fitted = Math.max(0, root.clientWidth - horizontal) * imageSize.height / imageSize.width + vertical;
      setStageHeight(Math.min(available, fitted));
    };
    measure();
    const observer = new ResizeObserver(measure);
    [root, top, bottom].forEach((element) => observer.observe(element));
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [imageSize]);

  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const ratio = zoom / previousZoom.current;
    element.scrollLeft = (element.scrollLeft + element.clientWidth / 2) * ratio - element.clientWidth / 2;
    element.scrollTop = (element.scrollTop + element.clientHeight / 2) * ratio - element.clientHeight / 2;
    previousZoom.current = zoom;
  }, [zoom]);

  function move(delta: number) {
    const next = index + delta;
    if (next < 0 || next >= images.length) return;
    setIndex(next);
    setZoom(1);
    setFailed(false);
    if (viewport.current) {
      viewport.current.scrollTo(0, 0);
      viewport.current.focus({ preventScroll: true });
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60" />
        <Dialog.Content
          ref={panel}
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-[60] flex max-h-[90dvh] w-[94vw] max-w-[1600px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-neutral-900/90 text-white shadow-2xl outline-none sm:w-[92vw]"
          onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus?.focus({ preventScroll: true }); }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" && zoom === 1) { event.preventDefault(); move(-1); }
            if (event.key === "ArrowRight" && zoom === 1) { event.preventDefault(); move(1); }
          }}
        >
          <header className="flex shrink-0 items-center">
          <div ref={header} className="grid w-full grid-cols-[2.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 px-3 py-4 sm:px-6">
            <span aria-live="polite" className="text-xs text-white/60">{index + 1} / {images.length}</span>
            <div className="min-w-0 text-center">
              <Dialog.Title className="line-clamp-2 text-lg leading-snug font-semibold sm:text-xl">{postTitle}</Dialog.Title>
              {image.caption && <p className="mt-1 line-clamp-2 text-sm leading-snug text-white/65" title={image.caption}>{image.caption}</p>}
            </div>
            <Dialog.Close className={control} aria-label="이미지 뷰어 닫기"><X size={22} /></Dialog.Close>
          </div>
          </header>
          <div className="relative min-h-0 shrink-0" style={{ height: stageHeight ?? "60dvh" }}>
            <div ref={viewport} tabIndex={-1} aria-label="확대 이미지 영역" className="post-image-viewer-viewport h-full overflow-auto overscroll-contain outline-none" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
              <div ref={imageBox} style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }} className="flex items-center justify-center px-3 pt-1 pb-3 sm:px-6" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
                {failed ? <p role="status">이미지를 불러오지 못했습니다.</p> : <img key={image.src} src={image.src} alt={image.alt} onLoad={(event) => { const img = event.currentTarget; setImageSize({ width: img.naturalWidth || 1, height: img.naturalHeight || 1 }); }} onError={() => setFailed(true)} draggable={false} className="block size-full object-contain object-top" />}
              </div>
            </div>
            {images.length > 1 && <>
              <button type="button" className={`${control} absolute top-1/2 left-2 -translate-y-1/2 sm:left-5`} aria-label="이전 이미지" disabled={index === 0} onClick={() => move(-1)}><ChevronLeft /></button>
              <button type="button" className={`${control} absolute top-1/2 right-2 -translate-y-1/2 sm:right-5`} aria-label="다음 이미지" disabled={index === images.length - 1} onClick={() => move(1)}><ChevronRight /></button>
            </>}
          </div>
          <footer ref={footer} className="flex shrink-0 items-center justify-center gap-3 px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button type="button" className={control} aria-label="축소" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - 0.5))}><Minus size={20} /></button>
            <span className="w-12 text-center text-sm tabular-nums" aria-live="polite">{zoom * 100}%</span>
            <button type="button" className={control} aria-label="확대" disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + 0.5))}><Plus size={20} /></button>
            <button type="button" className={control} aria-label="화면에 맞추기" title="화면에 맞추기" onClick={() => setZoom(1)}><Minimize2 size={18} /></button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
