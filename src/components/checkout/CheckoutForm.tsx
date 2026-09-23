"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertIcon, LockIcon } from "@/components/ui/Icon";
import type { ApiErrorBody } from "@/types";
import styles from "./Checkout.module.css";

export function CheckoutForm({
  serviceId,
  professionalId,
  date,
  time,
  requireEmail,
  paymentIsPlaceholder,
}: {
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  requireEmail: boolean;
  paymentIsPlaceholder: boolean;
}) {
  const router = useRouter();
  const idempotencyKey = useRef<string>(crypto.randomUUID());
  const submittingRef = useRef(false); // trava síncrona: mais confiável que o state contra duplo clique rápido

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return; // trava contra duplo clique / duplo envio
    submittingRef.current = true;
    setSubmitting(true);
    setBanner(null);
    setFieldErrors({});

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey.current },
        body: JSON.stringify({ serviceId, professionalId, date, time, customer: { name, phone, email } }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as ApiErrorBody | null;
        const message = data?.error?.message ?? "Não foi possível concluir o agendamento. Tente novamente.";
        setFieldErrors(data?.error?.fields ?? {});
        setBanner(message);
        submittingRef.current = false;
        setSubmitting(false);
        return;
      }

      const data = (await res.json()) as { order: { id: string } };
      router.push(`/sucesso?order=${data.order.id}`);
      // Mantém submitting=true: evita reabilitar o botão durante a navegação.
    } catch {
      setBanner("Falha de conexão. Verifique sua internet e tente novamente.");
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {banner && (
        <div className={styles.banner} role="alert">
          <AlertIcon size={18} />
          <span>{banner}</span>
        </div>
      )}

      <fieldset className={styles.fieldset}>
        <legend className={styles.fieldsetTitle}>Seus dados</legend>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Nome completo
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            className={`${styles.input} ${fieldErrors.name ? styles.inputError : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            required
          />
          {fieldErrors.name && (
            <span id="name-error" className={styles.errorText}>
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">
            Telefone (com DDD)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            className={`${styles.input} ${fieldErrors.phone ? styles.inputError : ""}`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            required
          />
          {fieldErrors.phone && (
            <span id="phone-error" className={styles.errorText}>
              {fieldErrors.phone}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            E-mail {!requireEmail && <span className={styles.helperText}>(opcional)</span>}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={`${styles.input} ${fieldErrors.email ? styles.inputError : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            required={requireEmail}
          />
          {fieldErrors.email && (
            <span id="email-error" className={styles.errorText}>
              {fieldErrors.email}
            </span>
          )}
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.fieldsetTitle}>Pagamento</legend>
        <p className={styles.paymentNote}>
          <LockIcon size={18} className={styles.paymentIcon} />
          {paymentIsPlaceholder
            ? "Ainda não há um gateway de pagamento conectado a este site: o botão abaixo confirma o agendamento sem cobrança online. Nenhum valor é cobrado agora."
            : "O pagamento é processado por um provedor externo no momento da confirmação. Nenhum dado de cartão é armazenado neste site."}
        </p>
      </fieldset>

      <div className={styles.submitRow}>
        <button type="submit" className="btn btn-gold btn-block" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Confirmando…" : "Confirmar e pagar"}
        </button>
        <p className={styles.secureNote}>
          <LockIcon size={14} />
          Conexão segura · seus dados não são compartilhados com terceiros
        </p>
      </div>
    </form>
  );
}
