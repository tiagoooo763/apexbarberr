import Link from "next/link";

import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section className={styles.cta} aria-labelledby="final-cta-title">
      <div className={`wrap ${styles.inner} reveal`}>
        <p className={styles.kicker}>Sua próxima visita</p>
        <h2 id="final-cta-title" className={styles.title}>
          Reserve sua cadeira na Apex Barber
        </h2>
        <Link href="/agendar" className="btn btn-gold">
          Agendar meu horário
        </Link>
      </div>
    </section>
  );
}
