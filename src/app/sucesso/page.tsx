import type { Metadata } from "next";
import Link from "next/link";
import { getOrder } from "@/lib/orders/store";
import { formatBRL, formatDateLabel } from "@/lib/format";
import { CheckIcon, AlertIcon } from "@/components/ui/Icon";
import { AddToCalendar } from "@/components/checkout/AddToCalendar";
import styles from "@/components/checkout/Success.module.css";

export const metadata: Metadata = { title: "Agendamento confirmado", robots: { index: false, follow: false } };

export default async function SucessoPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const params = await searchParams;
  const order = params.order ? getOrder(params.order) : undefined;

  if (!order) {
    return (
      <section className="section">
        <div className={`wrap ${styles.wrap}`}>
          <span className={styles.badge}>
            <AlertIcon size={26} />
          </span>
          <h1 className="section-title">Pedido não encontrado</h1>
          <p className="section-lede" style={{ textAlign: "center" }}>
            Não encontramos os dados deste agendamento — ele pode ter expirado. Se você concluiu o
            pagamento, seu horário está reservado; qualquer dúvida, procure a Apex Barber.
          </p>
          <Link href="/" className="btn btn-gold">
            Voltar para a Apex Barber
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className={`wrap ${styles.wrap}`}>
        <span className={styles.badge}>
          <CheckIcon size={28} />
        </span>
        <h1 className="section-title">Agendamento confirmado!</h1>
        <p className="section-lede" style={{ textAlign: "center" }}>
          Te esperamos na cadeira. Um resumo do seu horário está logo abaixo.
        </p>

        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.label}>Serviço</span>
            <span>{order.serviceName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Profissional</span>
            <span>{order.professionalName}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Data</span>
            <span>{formatDateLabel(order.date)}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Horário</span>
            <span>{order.time}</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Valor pago</span>
            <span>{formatBRL(order.totalCents)}</span>
          </div>
          <hr className="divider" />
          <div className={styles.row}>
            <span className={styles.orderId}>Pedido {order.id}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <AddToCalendar
            title={`${order.serviceName} — Apex Barber`}
            date={order.date}
            time={order.time}
            durationMin={order.durationMin}
            orderId={order.id}
          />
          <Link href="/" className="btn btn-gold">
            Voltar para a Apex Barber
          </Link>
        </div>
      </div>
    </section>
  );
}
