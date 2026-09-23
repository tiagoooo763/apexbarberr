import type { Metadata } from "next";
import Link from "next/link";
import { getServiceById, getProfessionalById, getProfessionals } from "@/lib/data";
import { getCapabilities } from "@/config/env";
import { SITE } from "@/config/site";
import { isValidDateISO, isValidTime } from "@/lib/validate";
import { ANY_PROFESSIONAL } from "@/types";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { AlertIcon } from "@/components/ui/Icon";
import styles from "@/components/checkout/Checkout.module.css";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

function Problem({ message }: { message: string }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className={styles.form} style={{ maxWidth: "34rem" }}>
          <div className={styles.banner} role="alert">
            <AlertIcon size={18} />
            <span>{message}</span>
          </div>
          <Link href="/agendar" className="btn btn-gold">
            Voltar para o agendamento
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; professional?: string; date?: string; time?: string }>;
}) {
  const params = await searchParams;
  const capabilities = getCapabilities();

  if (!capabilities.booking || !capabilities.payment) {
    return (
      <Problem message="O checkout online está temporariamente indisponível. Agende diretamente pela agenda oficial ou fale pelo Instagram." />
    );
  }

  const service = params.service ? getServiceById(params.service) : undefined;
  const date = params.date ?? "";
  const time = params.time ?? "";
  const professionalId = params.professional ?? ANY_PROFESSIONAL;

  if (!service || !isValidDateISO(date) || !isValidTime(time)) {
    return <Problem message="Não encontramos os dados do agendamento. Refaça a escolha de serviço, data e horário." />;
  }

  let professionalName = "Sem preferência";
  if (professionalId !== ANY_PROFESSIONAL) {
    const professional = getProfessionalById(professionalId);
    if (!professional) {
      return <Problem message="O profissional selecionado não foi encontrado. Escolha novamente." />;
    }
    professionalName = professional.name;
  } else if (getProfessionals().length === 0) {
    professionalName = "A definir";
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <p className="section-kicker">Quase lá</p>
          <h1 className="section-title">Finalizar agendamento</h1>
        </div>

        <div className={styles.layout}>
          <OrderSummary service={service} professionalName={professionalName} date={date} time={time} />
          <CheckoutForm
            serviceId={service.id}
            professionalId={professionalId}
            date={date}
            time={time}
            requireEmail={SITE.checkout.requireEmail}
            paymentIsPlaceholder={capabilities.paymentIsPlaceholder}
          />
        </div>
      </div>
    </section>
  );
}
