import { formatBRL, formatDateLabel } from "@/lib/format";
import type { Service } from "@/types";
import styles from "./Checkout.module.css";

export function OrderSummary({
  service,
  professionalName,
  date,
  time,
}: {
  service: Service;
  professionalName: string;
  date: string;
  time: string;
}) {
  const finalCents = service.promoPriceCents ?? service.priceCents;
  const discountCents = Math.max(0, service.priceCents - finalCents);

  return (
    <aside className={styles.summaryCard} aria-label="Resumo do pedido">
      <p className={styles.summaryTitle}>Resumo do pedido</p>

      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Serviço</span>
        <span>{service.name}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Profissional</span>
        <span>{professionalName}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Data</span>
        <span>{formatDateLabel(date)}</span>
      </div>
      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Horário</span>
        <span>{time}</span>
      </div>
      {service.durationMin && (
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Duração</span>
          <span>{service.durationMin} min</span>
        </div>
      )}

      <hr className="divider" />

      <div className={styles.summaryRow}>
        <span className={styles.summaryLabel}>Subtotal</span>
        <span>{formatBRL(service.priceCents)}</span>
      </div>
      {discountCents > 0 && (
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Desconto{service.promoLabel ? ` (${service.promoLabel})` : ""}</span>
          <span className={styles.summaryDiscount}>−{formatBRL(discountCents)}</span>
        </div>
      )}

      <hr className="divider" />

      <div className={styles.summaryTotalRow}>
        <span className={styles.summaryLabel}>Total</span>
        <span className={styles.summaryTotal}>{formatBRL(finalCents)}</span>
      </div>
    </aside>
  );
}
