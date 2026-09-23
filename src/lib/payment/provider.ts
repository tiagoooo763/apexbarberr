import "server-only";

export interface ChargeInput {
  amountCents: number;
  description: string;
  customerName: string;
  customerEmail: string;
  idempotencyKey: string;
}

export interface ChargeResult {
  approved: boolean;
  paymentRef: string;
  failureMessage?: string;
}

/**
 * Contrato para qualquer gateway de pagamento. Implemente esta interface em
 * um novo arquivo (ex.: `stripe.ts`, `mercadopago.ts`) usando a SDK oficial do
 * gateway e credenciais lidas de variáveis de ambiente do servidor — nunca do
 * frontend. Troque o provedor ativo em `index.ts`. Ver docs/INTEGRACOES.md.
 */
export interface PaymentProvider {
  readonly id: string;
  charge(input: ChargeInput): Promise<ChargeResult>;
}
