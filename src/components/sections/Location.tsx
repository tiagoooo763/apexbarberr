import { SITE } from "@/config/site";
import { MapPinIcon, ClockIcon, PhoneIcon, InstagramIcon } from "@/components/ui/Icon";
import styles from "./Location.module.css";

const WEEKDAY_LABEL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function Location() {
  const { address, hours, contact } = SITE;

  return (
    <section id="contato" className={`section ${styles.location}`} aria-labelledby="location-title">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">Onde estamos</p>
          <h2 id="location-title" className="section-title">
            Localização e contato
          </h2>
        </div>

        <div className={`${styles.grid} reveal`}>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowIcon}>
                <MapPinIcon />
              </span>
              <div>
                <p className={styles.rowTitle}>Endereço</p>
                {address ? (
                  <p className={styles.rowText}>
                    {address.street}
                    {address.number ? `, ${address.number}` : ""}
                    {address.complement ? ` — ${address.complement}` : ""}
                    <br />
                    {address.neighborhood ? `${address.neighborhood}, ` : ""}
                    {address.city} - {address.state}
                    {address.zip ? `, ${address.zip}` : ""}
                  </p>
                ) : (
                  <p className={styles.rowText}>
                    Em atualização neste site. Consulte pelo Instagram ou pela agenda no AppBarber.
                  </p>
                )}
              </div>
            </div>

            <div className={styles.row}>
              <span className={styles.rowIcon}>
                <ClockIcon />
              </span>
              <div>
                <p className={styles.rowTitle}>Horário de funcionamento</p>
                {hours ? (
                  <div className={styles.hoursTable}>
                    {hours.map((h) => (
                      <div className={styles.hoursRow} key={h.days.join("-")}>
                        <span>{h.days.map((d) => WEEKDAY_LABEL[d]).join(", ")}</span>
                        <span>
                          {h.open} – {h.close}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.rowText}>Em atualização neste site.</p>
                )}
              </div>
            </div>

            {contact.phone && (
              <div className={styles.row}>
                <span className={styles.rowIcon}>
                  <PhoneIcon />
                </span>
                <div>
                  <p className={styles.rowTitle}>Telefone</p>
                  <p className={styles.rowText}>{contact.phone}</p>
                </div>
              </div>
            )}

            <div className={styles.row}>
              <span className={styles.rowIcon}>
                <InstagramIcon />
              </span>
              <div>
                <p className={styles.rowTitle}>Instagram</p>
                <p className={styles.rowText}>@{SITE.social.instagram.handle}</p>
              </div>
            </div>

            <div className={styles.actions}>
              {address?.directionsUrl && (
                <a href={address.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-sm">
                  Como chegar
                </a>
              )}
              <a href={SITE.social.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Ver Instagram
              </a>
              <a href={SITE.appbarberUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Agenda no AppBarber
              </a>
            </div>
          </div>

          <div className={styles.map}>
            {address?.mapEmbedUrl ? (
              <iframe src={address.mapEmbedUrl} title="Mapa de localização da Apex Barber" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className={styles.mapPlaceholder}>
                O mapa aparece aqui assim que o endereço for confirmado.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
