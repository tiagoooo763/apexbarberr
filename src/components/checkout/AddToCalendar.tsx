"use client";

import { CalendarIcon } from "@/components/ui/Icon";
import { SITE } from "@/config/site";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Gera um arquivo .ics local (sem serviço externo) para o cliente baixar. */
function buildICS(input: { title: string; date: string; time: string; durationMin: number; orderId: string }) {
  const [y, m, d] = input.date.split("-").map(Number);
  const [hh, mm] = input.time.split(":").map(Number);
  const start = new Date(Date.UTC(y!, m! - 1, d!, hh!, mm!) - 3 * 60 * 60 * 1000); // America/Sao_Paulo (UTC-3, fixo)
  const end = new Date(start.getTime() + input.durationMin * 60 * 1000);
  const stamp = (dt: Date) =>
    `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00Z`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Apex Barber//Agendamento//PT-BR",
    "BEGIN:VEVENT",
    `UID:${input.orderId}@${SITE.url.replace(/^https?:\/\//, "")}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${input.title}`,
    `LOCATION:${SITE.name}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function AddToCalendar(props: { title: string; date: string; time: string; durationMin?: number; orderId: string }) {
  function handleClick() {
    const ics = buildICS({ ...props, durationMin: props.durationMin ?? 45 });
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `apex-barber-${props.orderId}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button type="button" className="btn btn-outline" onClick={handleClick}>
      <CalendarIcon size={18} />
      Adicionar ao calendário
    </button>
  );
}
