"use client";

import { useEffect, useRef, useState } from "react";
import { GALLERY } from "@/data/gallery";
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/Icon";
import styles from "./Gallery.module.css";

export function Gallery() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % GALLERY.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) triggerRef.current?.focus();
  }, [openIndex]);

  if (GALLERY.length === 0) return null;
  const active = openIndex !== null ? GALLERY[openIndex] : null;

  return (
    <section id="galeria" className="section section--tight" aria-labelledby="gallery-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">Bastidores</p>
          <h2 id="gallery-title" className="section-title">
            Galeria
          </h2>
        </div>

        <ul className={`${styles.grid} reveal`}>
          {GALLERY.map((item, i) => (
            <li key={item.image.src} className={styles.item}>
              <button
                type="button"
                className={styles.button}
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setOpenIndex(i);
                }}
                aria-label={`Ampliar foto: ${item.image.alt}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image.src} alt={item.image.alt} loading="lazy" width={item.image.width} height={item.image.height} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenIndex(null);
          }}
        >
          <button
            type="button"
            className={`${styles.nav} ${styles.navPrev}`}
            aria-label="Foto anterior"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + GALLERY.length) % GALLERY.length))}
          >
            <ChevronLeftIcon />
          </button>

          <figure className={styles.lightboxFigure}>
            <button ref={closeRef} type="button" className={styles.close} aria-label="Fechar" onClick={() => setOpenIndex(null)}>
              <CloseIcon />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active.image.src} alt={active.image.alt} width={active.image.width} height={active.image.height} />
            <figcaption className={styles.lightboxCaption}>{active.image.alt}</figcaption>
          </figure>

          <button
            type="button"
            className={`${styles.nav} ${styles.navNext}`}
            aria-label="Próxima foto"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % GALLERY.length))}
          >
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </section>
  );
}
