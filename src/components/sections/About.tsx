import { ScissorsIcon, SparkleIcon, CheckIcon } from "@/components/ui/Icon";
import styles from "./About.module.css";

const PRINCIPLES = [
  {
    icon: ScissorsIcon,
    title: "Técnica clássica",
    text: "Tesoura, máquina e navalha usadas com precisão em cada etapa do corte e da barba.",
  },
  {
    icon: SparkleIcon,
    title: "Ritual completo",
    text: "Toalha quente, vapor e produtos de acabamento fazem parte do atendimento, não são um extra.",
  },
  {
    icon: CheckIcon,
    title: "Atenção aos detalhes",
    text: "Cada cliente sai da cadeira com o acabamento conferido antes de ir embora.",
  },
];

export function About() {
  return (
    <section id="sobre" className={`section ${styles.about}`} aria-labelledby="about-title">
      <div className="wrap">
        <div className={styles.grid}>
          <div className={`${styles.media} reveal`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/galeria-atendimento.webp" alt="Barbeiro da Apex Barber atendendo um cliente na cadeira" width={720} height={900} loading="lazy" />
          </div>

          <div className={`${styles.copy} reveal`}>
            <p className="section-kicker">Sobre a Apex Barber</p>
            <h2 id="about-title" className="section-title">
              Style and Excellence
            </h2>
            <p className="section-lede">
              É a frase que abre o brasão da Apex Barber, e é o padrão que guia cada atendimento: cuidado
              com a técnica, com o ambiente e com o resultado que o cliente leva para casa.
            </p>

            <div className={styles.principles}>
              {PRINCIPLES.map((p) => (
                <div className={styles.principle} key={p.title}>
                  <span className={styles.principleMark}>
                    <p.icon size={18} />
                  </span>
                  <div>
                    <p className={styles.principleTitle}>{p.title}</p>
                    <p className={styles.principleText}>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
