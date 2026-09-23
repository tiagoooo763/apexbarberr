import Link from "next/link";
import { getServices } from "@/lib/data";
import { formatBRL } from "@/lib/format";
import { SITE } from "@/config/site";
import { AlertIcon, ClockIcon } from "@/components/ui/Icon";
import styles from "./Services.module.css";

export function Services() {
  const services = getServices();

  return (
    <section id="servicos" className="section" aria-labelledby="services-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">O que fazemos</p>
          <h2 id="services-title" className="section-title">
            Serviços
          </h2>
        </div>

        {services.length > 0 ? (
          <ul className={`${styles.list} reveal`}>
            {services.map((s) => (
              <li key={s.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowName}>{s.name}</span>
                  {s.description && <p className={styles.rowDesc}>{s.description}</p>}
                  {s.durationMin && (
                    <span className={styles.rowMeta}>
                      <ClockIcon size={14} />
                      {s.durationMin} min
                    </span>
                  )}
                </div>
                <div className={styles.rowSide}>
                  <div className={styles.priceBlock}>
                    {s.promoPriceCents ? (
                      <>
                        <span className={styles.priceWas}>{formatBRL(s.priceCents)}</span>
                        <span className={styles.priceNow}>{formatBRL(s.promoPriceCents)}</span>
                        {s.promoLabel && <span className={styles.promoLabel}>{s.promoLabel}</span>}
                      </>
                    ) : (
                      <span className={styles.priceNow}>{formatBRL(s.priceCents)}</span>
                    )}
                  </div>
                  <Link href={`/agendar?service=${s.id}`} className="btn btn-outline btn-sm">
                    Agendar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className={`${styles.empty} reveal`}>
            <AlertIcon size={22} />
            <p>
              A lista de serviços e preços está sendo atualizada neste site. Enquanto isso, consulte os
              valores e agende diretamente pela agenda oficial da {SITE.name}.
            </p>
            <div className={styles.emptyActions}>
              <a href={SITE.appbarberUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Ver serviços no AppBarber
              </a>
              <a
                href={SITE.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Ver no Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
