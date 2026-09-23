import type { Product } from "@/types";

/** Nenhum produto/preço de loja foi confirmado nas fontes disponíveis. */
export const PRODUCTS: Product[] = [];

export const DEMO_PRODUCTS: Product[] = [
  { id: "pomada", name: "Pomada modeladora", description: "Fixação forte, acabamento fosco.", priceCents: 4500 },
  { id: "oleo-barba", name: "Óleo para barba", description: "Hidrata e amacia os fios.", priceCents: 3900 },
];
