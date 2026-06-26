"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/types/PostProps";

type PhotoGalleryLabels = {
  empty: string;
  close: string;
  view: string;
};

type PhotoGalleryProps = {
  photos: Photo[];
  labels: PhotoGalleryLabels;
};

export default function PhotoGallery({ photos, labels }: PhotoGalleryProps) {
  const [active, setActive] = useState<Photo | null>(null);
  const close = useCallback(() => setActive(null), []);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // While the modal is open: lock body scroll, close on Escape, move focus into
  // the dialog and trap it there, then restore focus to the trigger on close.
  useEffect(() => {
    if (!active) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [active, close]);

  if (photos.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-muted text-center text-muted-foreground font-semibold">
        {labels.empty}
      </div>
    );
  }

  return (
    <>
      {/* Masonry via CSS columns; items avoid breaking across columns.
          We use plain <img> rather than next/image on purpose: the photos are
          remote GitHub attachments with unknown intrinsic dimensions, which
          next/image's masonry layout (CSS columns + auto height) can't size,
          and `loading="lazy"` already defers off-screen images. */}
      <div className="columns-2 sm:columns-3 gap-4">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setActive(photo)}
            className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl group cursor-zoom-in"
            aria-label={`${labels.view}: ${photo.title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full h-auto rounded-xl transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={labels.close}
            className="absolute top-4 right-4 text-3xl leading-none text-neutral-300 hover:text-white duration-200"
          >
            &times;
          </button>
          <figure
            className="flex max-h-full max-w-4xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.src}
              alt={active.alt}
              className="max-h-[80vh] w-auto rounded-lg object-contain"
            />
            {active.title && (
              <figcaption className="mt-4 max-w-2xl text-center text-neutral-300">
                {active.title}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
