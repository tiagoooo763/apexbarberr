import "server-only";
import { serverEnv } from "@/config/env";
import { demoBookingProvider } from "./demoProvider";
import type { BookingProvider } from "./provider";

/**
 * Ponto único de resolução do provedor de agenda ativo.
 * BOOKING_PROVIDER=demo -> demonstração. Vazio -> nenhum provedor (agendamento
 * online desativado; o site direciona para a agenda oficial no AppBarber).
 * Uma futura integração real entra aqui como mais um `case`.
 */
export function getBookingProvider(): BookingProvider | null {
  switch (serverEnv.bookingProvider) {
    case "demo":
      return demoBookingProvider;
    default:
      return null;
  }
}
