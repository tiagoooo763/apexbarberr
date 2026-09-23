import { REVIEWS } from "@/data/reviews";
import styles from "./Reviews.module.css";

export function Reviews() {
  if (REVIEWS.length === 0) return null;

  return (
    <section id="avaliacoes" className="section" aria-labelledby="reviews-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">Quem já passou pela cadeira</p>
          <h2 id="reviews-title" className="section-title">
            Avaliações
          </h2>
        </div>
        <ul className={`${styles.grid} reveal`}>
          {REVIEWS.map((r) => (
            <li key={r.id} className={styles.card}>
              <div className={styles.stars} aria-label={`${r.rating} de 5 estrelas`}>
                {"★★★★★".slice(0, r.rating)}
                <span aria-hidden="true" style={{ opacity: 0.3 }}>
                  {"★★★★★".slice(r.rating)}
                </span>
              </div>
              <p className={styles.text}>{r.text}</p>
              <div className={styles.author}>
                <span>{r.author}</span>
                {r.dateLabel && <span>{r.dateLabel}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
