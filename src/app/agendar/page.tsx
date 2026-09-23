import type { Metadata } from "next";
import { getCapabilities } from "@/config/env";
import { SITE } from "@/config/site";
import { getServices, getProfessionals } from "@/lib/data";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { AlertIcon } from "@/components/ui/Icon";
import styles from "@/components/booking/BookingFlow.module.css";

export const metadata: Metadata = {
  title: "Agendar horário",
  description: `Agende seu horário na ${SITE.name}: escolha o serviço, o profissional, a data e o horário.`,
  alternates: { canonical: "/agendar" },
};

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; professional?: string }>;
}) {
  const params = await searchParams;
  const capabilities = getCapabilities();
  const services = getServices();

  const canBook = capabilities.booking && services.length > 0;

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head reveal">
          <p className="section-kicker">Reserve sua cadeira</p>
          <h1 className="section-title">Agendar horário</h1>
          <p className="section-lede">Escolha o serviço, o profissional de preferência, a data e o horário.</p>
        </div>

        {canBook ? (
          <div className="reveal">
            <BookingFlow
              services={services}
              professionals={getProfessionals()}
              windowDays={SITE.bookingWindowDays}
              initialServiceId={params.service}
              initialProfessionalId={params.professional}
            />
          </div>
        ) : (
          <div className={`${styles.fallback} reveal`}>
            <AlertIcon size={22} />
            <p>
              O agendamento online por aqui ainda está sendo configurado. Enquanto isso, marque seu
              horário direto pela agenda oficial da {SITE.name} ou fale pelo Instagram.
            </p>
            <div className={styles.fallbackActions}>
              <a href={SITE.appbarberUrl} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Agendar no AppBarber
              </a>
              <a
                href={SITE.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Falar pelo Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
