import { randomUUID } from "crypto";

export function newOrderId(): string {
  return `APX-${randomUUID().slice(0, 8).toUpperCase()}`;
}
