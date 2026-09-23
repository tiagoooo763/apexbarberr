export interface FieldErrors {
  [field: string]: string;
}

export function isValidDateISO(s: unknown): s is string {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
export function isValidTime(s: unknown): s is string {
  return typeof s === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
}
export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
/** Aceita números de telefone brasileiros com DDD, com ou sem formatação. */
export function isValidPhoneBR(s: string): boolean {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 11;
}
export function isNonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export function validateCustomer(input: { name: string; phone: string; email: string }, requireEmail: boolean): FieldErrors {
  const errors: FieldErrors = {};
  if (!isNonEmpty(input.name) || input.name.trim().length < 2) {
    errors.name = "Informe seu nome completo.";
  }
  if (!isValidPhoneBR(input.phone)) {
    errors.phone = "Informe um telefone válido com DDD.";
  }
  if (requireEmail || input.email.trim().length > 0) {
    if (!isValidEmail(input.email)) errors.email = "Informe um e-mail válido.";
  }
  return errors;
}
