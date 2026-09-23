import Link from "next/link";
import { SITE } from "@/config/site";
import { ScissorsIcon } from "@/components/ui/Icon";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>{SITE.tagline}</p>
          <h1 id="hero-title" className={styles.title}>
            Corte, barba e acabamento com precisão de barbeiro.
          </h1>
          <p className={styles.lede}>
            Toalha quente, navalha e ferramentas certas para cada etapa — um atendimento cuidado do
            início ao fim, cadeira a cadeira.
          </p>
          <div className={styles.ctas}>
            <Link href="/agendar" className="btn btn-gold">
              Agendar meu horário
            </Link>
            <Link href="#servicos" className="btn btn-outline">
              Ver serviços
            </Link>
          </div>
        </div>

        <div className={styles.frame}>
          <div className={styles.frameInner}>
            <video autoPlay muted loop playsInline poster="/images/hero-poster.webp" aria-hidden="true">
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
            <div className={styles.frameCaption}>
              <ScissorsIcon size={16} />
              <span>Atendimento real na Apex Barber</span>
            </div>
          </div>
          <div className={styles.frameGlow} aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
