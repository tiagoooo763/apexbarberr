import "server-only";
import type { ChargeInput, ChargeResult, PaymentProvider } from "./provider";

/**
 * Simula uma cobrança para permitir testar o fluxo completo de checkout sem
 * nenhum gateway real conectado. Nunca move dinheiro de verdade.
 */
export const demoPaymentProvider: PaymentProvider = {
  id: "demo",

  async charge({ amountCents, idempotencyKey }: ChargeInput): Promise<ChargeResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (amountCents <= 0) {
      return { approved: false, paymentRef: "", failureMessage: "Valor inválido." };
    }
    return { approved: true, paymentRef: `DEMO-PAY-${idempotencyKey.slice(0, 10).toUpperCase()}` };
  },
};
