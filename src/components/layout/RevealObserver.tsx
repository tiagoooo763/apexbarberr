"use client";

import { useEffect } from "react";

/**
 * Único mecanismo de animação orquestrada do site: observa elementos com a
 * classe `.reveal` e adiciona `.is-visible` quando entram na viewport, uma
 * vez cada. Não é reaproveitado para hover ou outras transições — mantém a
 * regra de "um gesto por página" em vez de efeitos espalhados.
 */
export function RevealObserver() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (elements.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
