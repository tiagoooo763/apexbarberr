import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/config/site";
import { InstagramIcon } from "@/components/ui/Icon";
import type { NavLink } from "./Header";
import styles from "./Footer.module.css";

export function Footer({ navLinks }: { navLinks: NavLink[] }) {
  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <div className={styles.brand}>
              <Image src="/brand/apex-medalhao.png" alt="" width={40} height={40} />
              <span className={styles.brandName}>{SITE.name}</span>
            </div>
            <span className={styles.tagline}>{SITE.tagline}</span>
            <p className={styles.desc}>{SITE.description}</p>
          </div>

          <div className={styles.cols}>
            <div>
              <p className={styles.colTitle}>Site</p>
              <nav className={styles.list} aria-label="Links do rodapé">
                {navLinks.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                <Link href="/agendar">Agendar horário</Link>
              </nav>
            </div>
            <div>
              <p className={styles.colTitle}>Contato</p>
              <div className={styles.list}>
                <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
                <a href={SITE.appbarberUrl} target="_blank" rel="noopener noreferrer">
                  Agenda oficial (AppBarber)
                </a>
                <Link href="/privacidade">Privacidade</Link>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </span>
          <a
            className={styles.social}
            href={SITE.social.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon size={16} />@{SITE.social.instagram.handle}
          </a>
        </div>
      </div>
    </footer>
  );
}
