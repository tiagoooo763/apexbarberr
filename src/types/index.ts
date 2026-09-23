/** Tipos de domínio compartilhados entre cliente e servidor. */

export type Money = number; // sempre em centavos (inteiro)

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  priceCents: Money;
  /** Preço promocional; quando presente gera desconto no checkout. */
  promoPriceCents?: Money;
  promoLabel?: string;
  durationMin?: number;
  /** IDs dos profissionais que realizam o serviço. Vazio/indefinido = todos. */
  professionalIds?: string[];
}

export interface Professional {
  id: string;
  name: string;
  specialty?: string;
  photo?: ImageAsset;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  priceCents: Money;
  image?: ImageAsset;
  /** Link de compra (loja, WhatsApp etc.). Sem link, o botão não é exibido. */
  buyUrl?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  dateLabel?: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface GalleryItem {
  image: ImageAsset;
}

export interface Address {
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  zip?: string;
  /** Link "Como chegar" (Google Maps, Waze…). */
  directionsUrl?: string;
  /** URL de embed do mapa (iframe). Opcional. */
  mapEmbedUrl?: string;
}

export interface OpeningPeriod {
  /** 0 = domingo … 6 = sábado */
  days: number[];
  open: string; // "HH:mm"
  close: string; // "HH:mm"
}

/** Escolha "sem preferência" na etapa de profissional. */
export const ANY_PROFESSIONAL = "any" as const;

export interface BookingDraft {
  serviceId: string;
  /** ID do profissional ou ANY_PROFESSIONAL. */
  professionalId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface Slot {
  time: string; // HH:mm
  /** Profissionais disponíveis neste horário. */
  professionalIds: string[];
}

export interface CustomerInput {
  name: string;
  phone: string;
  email: string;
}

export type OrderStatus = "pending" | "confirmed" | "failed";

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string;
  time: string;
  durationMin?: number;
  subtotalCents: Money;
  discountCents: Money;
  totalCents: Money;
  customerFirstName: string;
  /** Referências internas (provedor de pagamento / agenda). Nunca expostas ao público. */
  paymentRef?: string;
  appointmentRef?: string;
  demo?: boolean;
}

/** Visão pública do pedido (sem referências internas nem dados pessoais). */
export type PublicOrder = Omit<Order, "paymentRef" | "appointmentRef">;

export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string> };
}

export interface Capabilities {
  demo: boolean;
  booking: boolean;
  payment: boolean;
  paymentIsPlaceholder: boolean;
}
