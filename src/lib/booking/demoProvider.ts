import "server-only";
import { getProfessionals, getServiceById } from "@/lib/data";
import { todayISOInTZ } from "@/lib/format";
import type { BookingProvider } from "./provider";
import type { Slot } from "@/types";

const WORK_START = 9 * 60; // 09:00 em minutos
const WORK_END = 19 * 60; // 19:00
const LUNCH_START = 12 * 60 * 60 === 0 ? 0 : 12 * 60; // 12:00
const LUNCH_END = 13 * 60; // 13:00
const STEP = 30;

function minutesToHHmm(min: number): string {
  const h = Math.floor(min / 60).toString().padStart(2, "0");
  const m = (min % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Gera uma grade determinística (sem aleatoriedade) para servir de demonstração do fluxo. */
function isSlotDemoUnavailable(dateISO: string, minutes: number, profId: string): boolean {
  let hash = 0;
  const s = `${dateISO}-${minutes}-${profId}`;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash % 5 === 0; // ~20% dos horários aparecem ocupados
}

export const demoBookingProvider: BookingProvider = {
  id: "demo",

  async getAvailableSlots({ date, professionalId }) {
    const today = todayISOInTZ();
    if (date < today) return [];

    const professionals = getProfessionals();
    const candidateProfIds = professionalId === "any" ? professionals.map((p) => p.id) : [professionalId];
    if (candidateProfIds.length === 0) return [];

    const slots: Slot[] = [];
    for (let m = WORK_START; m < WORK_END; m += STEP) {
      if (m >= LUNCH_START && m < LUNCH_END) continue;
      const availableProfIds = candidateProfIds.filter((pid) => !isSlotDemoUnavailable(date, m, pid));
      if (availableProfIds.length > 0) {
        slots.push({ time: minutesToHHmm(m), professionalIds: availableProfIds });
      }
    }
    return slots;
  },

  async createAppointment(input) {
    // Ambiente de demonstração: não existe agenda real por trás. Apenas
    // valida os dados recebidos e devolve uma referência simulada.
    if (!getServiceById(input.serviceId)) {
      throw new Error("Serviço inválido.");
    }
    const ref = `DEMO-${Date.now().toString(36).toUpperCase()}`;
    return { appointmentRef: ref };
  },
};
