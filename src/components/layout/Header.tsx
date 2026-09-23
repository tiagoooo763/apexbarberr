"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "@/config/site";
import { MenuIcon, CloseIcon, InstagramIcon } from "@/components/ui/Icon";
import styles from "./Header.module.css";

export interface NavLink {
  href: string;
  label: string;
}

export function Header({ navLinks }: { navLinks: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);

  // Fecha o menu ao navegar. Ajuste de estado durante a renderização (em vez
  // de useEffect) para evitar um ciclo extra de renderização a cada troca de rota.
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        openBtnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label={`${SITE.name} — página inicial`}>
          <Image src="/brand/apex-medalhao.png" alt="" width={44} height={44} className={styles.brandMark} priority />
          <span className={styles.brandName}>{SITE.name}</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <Link href="/agendar" className={`btn btn-gold ${styles.ctaDesktop}`}>
            Agendar horário
          </Link>
          <button
            ref={openBtnRef}
            type="button"
            className={styles.menuBtn}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Abrir menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className={styles.panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className={styles.panelTop}>
            <Link href="/" className={styles.brand} aria-label={`${SITE.name} — página inicial`}>
              <Image src="/brand/apex-medalhao.png" alt="" width={40} height={40} />
              <span className={styles.brandName}>{SITE.name}</span>
            </Link>
            <button
              ref={closeBtnRef}
              type="button"
              className={styles.menuBtn}
              aria-label="Fechar menu"
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className={styles.panelNav} aria-label="Navegação móvel">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.panelLink}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className={styles.panelFooter}>
            <Link href="/agendar" className="btn btn-gold btn-block">
              Agendar horário
            </Link>
            <a
              href={SITE.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-block"
            >
              <InstagramIcon size={18} />
              @{SITE.social.instagram.handle}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
