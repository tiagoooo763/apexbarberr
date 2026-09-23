import "server-only";
import type { Capabilities } from "@/types";

/**
 * Leitura centralizada de variáveis de ambiente do SERVIDOR.
 * Este módulo nunca deve ser importado por componentes de cliente
 * (o import "server-only" faz o build falhar se isso acontecer).
 */
export const isDemo = process.env.NEXT_PUBLIC_DEMO_DATA === "true";

/**
 * Mecanismo de agendamento/pagamento do PRÓPRIO site — deliberadamente
 * independente de `isDemo`. `isDemo` controla só os DADOS (serviços, equipe,
 * produtos fictícios usados para preview). Já o mecanismo abaixo é o motor
 * real de agendamento e checkout deste site: por padrão ("demo", o valor
 * padrão) ele roda inteiramente aqui, sem redirecionar para nenhum sistema
 * externo — apenas ainda não está ligado a uma agenda/gateway de pagamento
 * de terceiros de verdade (porque isso depende de qual agenda/gateway vocês
 * forem contratar; ver docs/INTEGRACOES.md).
 *
 * Para desligar o agendamento online por completo (ex.: querer só um site
 * institucional por enquanto), defina BOOKING_PROVIDER=off e/ou
 * PAYMENT_PROVIDER=off no ambiente.
 */
function resolveProvider(envValue: string | undefined): string {
  const v = (envValue ?? "demo").trim();
  return v.toLowerCase() === "off" ? "" : v;
}

export const serverEnv = {
  bookingProvider: resolveProvider(process.env.BOOKING_PROVIDER),
  paymentProvider: resolveProvider(process.env.PAYMENT_PROVIDER),
  appbarberApiUrl: process.env.APPBARBER_API_URL ?? "",
  appbarberApiToken: process.env.APPBARBER_API_TOKEN ?? "",
  paymentApiKey: process.env.PAYMENT_API_KEY ?? "",
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET ?? "",
};

/** O que o site consegue fazer de verdade neste ambiente. */
export function getCapabilities(): Capabilities {
  return {
    demo: isDemo,
    booking: serverEnv.bookingProvider !== "",
    payment: serverEnv.paymentProvider !== "",
    // Sinaliza para a UI que o pagamento ainda é o mecanismo interno do site
    // (sem gateway real conectado), independente de `demo` (dados fictícios).
    paymentIsPlaceholder: serverEnv.paymentProvider === "demo",
  };
}
