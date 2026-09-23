import Link from "next/link";
import { getProfessionals } from "@/lib/data";
import { UserIcon } from "@/components/ui/Icon";
import styles from "./Team.module.css";

export function Team() {
  const professionals = getProfessionals();
  if (professionals.length === 0) return null;

  return (
    <section id="equipe" className="section" aria-labelledby="team-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">Quem corta</p>
          <h2 id="team-title" className="section-title">
            Profissionais
          </h2>
        </div>

        <ul className={`${styles.grid} reveal`}>
          {professionals.map((p) => (
            <li key={p.id} className={styles.card}>
              <div className={styles.photo}>
                {p.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photo.src} alt={p.photo.alt} loading="lazy" />
                ) : (
                  <div className={styles.photoFallback} aria-hidden="true">
                    <UserIcon size={40} />
                  </div>
                )}
              </div>
              <div className={styles.body}>
                <span className={styles.name}>{p.name}</span>
                {p.specialty && <p className={styles.specialty}>{p.specialty}</p>}
                <Link href={`/agendar?professional=${p.id}`} className="btn btn-outline btn-sm">
                  Agendar com {p.name.split(" ")[0]}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
