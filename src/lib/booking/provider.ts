import "server-only";
import type { Slot } from "@/types";

/**
 * Contrato que qualquer provedor de agenda precisa cumprir. Hoje existe um
 * provedor de demonstração (`demo`); quando a Apex Barber disponibilizar uma
 * API real do AppBarber (ou outro sistema), implemente esta interface em um
 * novo arquivo (ex.: `appbarber.ts`) e troque em `index.ts` — nenhum outro
 * ponto do site precisa mudar. Ver docs/INTEGRACOES.md.
 */
export interface BookingProvider {
  readonly id: string;
  getAvailableSlots(input: { date: string; serviceId: string; professionalId: string }): Promise<Slot[]>;
  /** Confirma o agendamento após pagamento aprovado. Retorna uma referência interna. */
  createAppointment(input: {
    serviceId: string;
    professionalId: string;
    date: string;
    time: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
  }): Promise<{ appointmentRef: string }>;
}
