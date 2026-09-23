"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Professional, Service, Slot } from "@/types";
import { ANY_PROFESSIONAL } from "@/types";
import { formatBRL, formatDateLabel, todayISOInTZ } from "@/lib/format";
import { CheckIcon, ClockIcon, AlertIcon } from "@/components/ui/Icon";
import styles from "./BookingFlow.module.css";

const WEEKDAY_SHORT = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function buildDayOptions(count: number): { iso: string; weekday: string; day: number }[] {
  const today = todayISOInTZ();
  const [y, m, d] = today.split("-").map(Number);
  const base = new Date(Date.UTC(y!, m! - 1, d!, 12));
  const days: { iso: string; weekday: string; day: number }[] = [];
  for (let i = 0; i < count; i++) {
    const dt = new Date(base);
    dt.setUTCDate(base.getUTCDate() + i);
    const iso = dt.toISOString().slice(0, 10);
    days.push({ iso, weekday: WEEKDAY_SHORT[dt.getUTCDay()]!, day: dt.getUTCDate() });
  }
  return days;
}

export function BookingFlow({
  services,
  professionals,
  windowDays,
  initialServiceId,
  initialProfessionalId,
}: {
  services: Service[];
  professionals: Professional[];
  windowDays: number;
  initialServiceId?: string;
  initialProfessionalId?: string;
}) {
  const router = useRouter();
  const hasProfessionals = professionals.length > 0;

  const [serviceId, setServiceId] = useState(
    initialServiceId && services.some((s) => s.id === initialServiceId) ? initialServiceId : "",
  );
  const [professionalId, setProfessionalId] = useState(
    !hasProfessionals
      ? ANY_PROFESSIONAL
      : initialProfessionalId && professionals.some((p) => p.id === initialProfessionalId)
        ? initialProfessionalId
        : "",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const dayOptions = useMemo(() => buildDayOptions(windowDays), [windowDays]);
  const selectedService = services.find((s) => s.id === serviceId);
  const selectedProfessional = professionals.find((p) => p.id === professionalId);

  const step1Done = serviceId !== "";
  const step2Done = professionalId !== "";
  const step3Done = date !== "";
  const step4Done = time !== "";

  const loadSlots = useCallback(async () => {
    if (!serviceId || !date || !professionalId) return;
    setLoadingSlots(true);
    setSlotsError(null);
    setSlots(null);
    try {
      const params = new URLSearchParams({ date, serviceId, professionalId });
      const res = await fetch(`/api/availability?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) {
        setSlotsError(
          res.status === 503
            ? "O agendamento online está indisponível no momento."
            : "Não foi possível carregar os horários. Tente novamente.",
        );
        return;
      }
      const data = (await res.json()) as { slots: Slot[] };
      setSlots(data.slots);
    } catch {
      setSlotsError("Falha de conexão ao buscar horários. Tente novamente.");
    } finally {
      setLoadingSlots(false);
    }
  }, [serviceId, date, professionalId]);

  useEffect(() => {
    if (step1Done && step2Done && step3Done) void loadSlots();
  }, [serviceId, professionalId, date, step1Done, step2Done, step3Done, loadSlots]);

  function selectService(id: string) {
    setServiceId(id);
    setTime("");
  }
  function selectProfessional(id: string) {
    setProfessionalId(id);
    setTime("");
  }
  function selectDate(iso: string) {
    setDate(iso);
    setTime("");
  }

  function goToCheckout() {
    const params = new URLSearchParams({ service: serviceId, professional: professionalId, date, time });
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className={styles.flow}>
      <ol className={styles.stepList}>
        {/* Etapa 1 — Serviço */}
        <li className={styles.step}>
          <div className={styles.stepHead}>
            <div className={styles.stepHeadLeft}>
              <span className={`${styles.stepNumber} ${step1Done ? styles.stepNumberDone : ""}`}>
                {step1Done ? <CheckIcon size={14} /> : "1"}
              </span>
              <div>
                <p className={styles.stepTitle}>Serviço</p>
                {selectedService && <p className={styles.stepSummary}>{selectedService.name}</p>}
              </div>
            </div>
          </div>
          <div className={styles.stepBody}>
            <div className={styles.optionList} role="radiogroup" aria-label="Escolha o serviço">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={serviceId === s.id}
                  className={`${styles.option} ${serviceId === s.id ? styles.optionSelected : ""}`}
                  onClick={() => selectService(s.id)}
                >
                  <span>
                    <span className={styles.optionName}>{s.name}</span>
                    {s.durationMin && <span className={styles.optionMeta}> · {s.durationMin} min</span>}
                  </span>
                  <span className={styles.optionPrice}>{formatBRL(s.promoPriceCents ?? s.priceCents)}</span>
                </button>
              ))}
            </div>
          </div>
        </li>

        {/* Etapa 2 — Profissional (só quando houver mais de um cadastrado) */}
        {hasProfessionals && (
          <li className={styles.step}>
            <div className={styles.stepHead}>
              <div className={styles.stepHeadLeft}>
                <span className={`${styles.stepNumber} ${step2Done ? styles.stepNumberDone : ""}`}>
                  {step2Done ? <CheckIcon size={14} /> : "2"}
                </span>
                <div>
                  <p className={styles.stepTitle}>Profissional</p>
                  {selectedProfessional && <p className={styles.stepSummary}>{selectedProfessional.name}</p>}
                  {professionalId === ANY_PROFESSIONAL && <p className={styles.stepSummary}>Sem preferência</p>}
                </div>
              </div>
            </div>
            <div className={styles.stepBody}>
              <div className={styles.optionList} role="radiogroup" aria-label="Escolha o profissional">
                <button
                  type="button"
                  role="radio"
                  aria-checked={professionalId === ANY_PROFESSIONAL}
                  className={`${styles.option} ${professionalId === ANY_PROFESSIONAL ? styles.optionSelected : ""}`}
                  onClick={() => selectProfessional(ANY_PROFESSIONAL)}
                >
                  <span className={styles.optionName}>Sem preferência</span>
                </button>
                {professionals.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={professionalId === p.id}
                    className={`${styles.option} ${professionalId === p.id ? styles.optionSelected : ""}`}
                    onClick={() => selectProfessional(p.id)}
                  >
                    <span>
                      <span className={styles.optionName}>{p.name}</span>
                      {p.specialty && <span className={styles.optionMeta}> · {p.specialty}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </li>
        )}

        {/* Etapa 3 — Data */}
        <li className={styles.step}>
          <div className={styles.stepHead}>
            <div className={styles.stepHeadLeft}>
              <span className={`${styles.stepNumber} ${step3Done ? styles.stepNumberDone : ""}`}>
                {step3Done ? <CheckIcon size={14} /> : hasProfessionals ? "3" : "2"}
              </span>
              <div>
                <p className={styles.stepTitle}>Data</p>
                {date && <p className={styles.stepSummary}>{formatDateLabel(date)}</p>}
              </div>
            </div>
          </div>
          <div className={styles.stepBody}>
            <div className={styles.dayStrip} role="radiogroup" aria-label="Escolha a data">
              {dayOptions.map((d) => (
                <button
                  key={d.iso}
                  type="button"
                  role="radio"
                  aria-checked={date === d.iso}
                  aria-label={formatDateLabel(d.iso)}
                  className={`${styles.day} ${date === d.iso ? styles.daySelected : ""}`}
                  onClick={() => selectDate(d.iso)}
                >
                  <span className={styles.dayWeekday}>{d.weekday}</span>
                  <span className={styles.dayNumber}>{d.day}</span>
                </button>
              ))}
            </div>
          </div>
        </li>

        {/* Etapa 4 — Horário */}
        <li className={styles.step}>
          <div className={styles.stepHead}>
            <div className={styles.stepHeadLeft}>
              <span className={`${styles.stepNumber} ${step4Done ? styles.stepNumberDone : ""}`}>
                {step4Done ? <CheckIcon size={14} /> : hasProfessionals ? "4" : "3"}
              </span>
              <div>
                <p className={styles.stepTitle}>Horário</p>
                {time && <p className={styles.stepSummary}>{time}</p>}
              </div>
            </div>
          </div>
          <div className={styles.stepBody}>
            {!step3Done ? (
              <p className={styles.stepSummary}>Escolha uma data para ver os horários disponíveis.</p>
            ) : loadingSlots ? (
              <div className={styles.state}>
                <span className={styles.spinner} aria-hidden="true" />
                Buscando horários disponíveis…
              </div>
            ) : slotsError ? (
              <div className={styles.state} role="alert">
                <AlertIcon size={18} />
                {slotsError}
              </div>
            ) : slots && slots.length > 0 ? (
              <div className={styles.timeGrid} role="radiogroup" aria-label="Escolha o horário">
                {slots.map((s) => (
                  <button
                    key={s.time}
                    type="button"
                    role="radio"
                    aria-checked={time === s.time}
                    className={`${styles.time} ${time === s.time ? styles.timeSelected : ""}`}
                    onClick={() => setTime(s.time)}
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.state}>
                <ClockIcon size={18} />
                Nenhum horário disponível nesta data. Tente outro dia.
              </div>
            )}
          </div>
        </li>
      </ol>

      {step1Done && step2Done && step3Done && step4Done && selectedService && (
        <div className={styles.summaryCard} aria-live="polite">
          <p className={styles.stepTitle}>Resumo</p>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Serviço</span>
            <span>{selectedService.name}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Profissional</span>
            <span>{selectedProfessional?.name ?? "Sem preferência"}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Quando</span>
            <span>
              {formatDateLabel(date)} às {time}
            </span>
          </div>
          <hr className="divider" />
          <div className={styles.summaryRow}>
            <span className={styles.summaryLabel}>Total</span>
            <span className={styles.summaryTotal}>
              {formatBRL(selectedService.promoPriceCents ?? selectedService.priceCents)}
            </span>
          </div>
          <button type="button" className="btn btn-gold btn-block" onClick={goToCheckout}>
            Continuar para pagamento
          </button>
        </div>
      )}
    </div>
  );
}
