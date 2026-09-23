import "server-only";
import { serverEnv } from "@/config/env";
import { demoPaymentProvider } from "./demoProvider";
import type { PaymentProvider } from "./provider";

/** Ponto único de resolução do gateway de pagamento ativo. */
export function getPaymentProvider(): PaymentProvider | null {
  switch (serverEnv.paymentProvider) {
    case "demo":
      return demoPaymentProvider;
    default:
      return null;
  }
}
