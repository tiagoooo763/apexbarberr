import { isDemo } from "@/config/env";
import { SERVICES, DEMO_SERVICES } from "@/data/services";
import { PROFESSIONALS, DEMO_PROFESSIONALS } from "@/data/professionals";
import { PRODUCTS, DEMO_PRODUCTS } from "@/data/products";
import type { Service, Professional, Product } from "@/types";

/** Resolve dados reais ou demo conforme NEXT_PUBLIC_DEMO_DATA, num único lugar. */
export function getServices(): Service[] {
  return isDemo ? DEMO_SERVICES : SERVICES;
}
export function getProfessionals(): Professional[] {
  return isDemo ? DEMO_PROFESSIONALS : PROFESSIONALS;
}
export function getProducts(): Product[] {
  return isDemo ? DEMO_PRODUCTS : PRODUCTS;
}
export function getServiceById(id: string): Service | undefined {
  return getServices().find((s) => s.id === id);
}
export function getProfessionalById(id: string): Professional | undefined {
  return getProfessionals().find((p) => p.id === id);
}
