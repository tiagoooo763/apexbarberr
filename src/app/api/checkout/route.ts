import { NextRequest, NextResponse } from "next/server";
import { getBookingProvider } from "@/lib/booking";
import { getPaymentProvider } from "@/lib/payment";
import { getServiceById, getProfessionalById, getProfessionals } from "@/lib/data";
import { saveOrder, getOrder } from "@/lib/orders/store";
import { validateCustomer, isValidDateISO, isValidTime, isNonEmpty } from "@/lib/validate";
import { claimIdempotency } from "@/lib/idempotency";
import { newOrderId } from "@/lib/id";
import { SITE } from "@/config/site";
import { isDemo } from "@/config/env";
import type { ApiErrorBody, Order } from "@/types";

export const dynamic = "force-dynamic";

function fail(status: number, code: string, message: string, fields?: Record<string, string>): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code, message, fields } }, { status });
}

export async function POST(req: NextRequest) {
  const idempotencyKey = req.headers.get("Idempotency-Key");
  if (!isNonEmpty(idempotencyKey)) return fail(400, "bad_request", "Requisição inválida.");

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "bad_request", "JSON inválido.");
  }
  const b = body as Record<string, unknown>;

  const serviceId = String(b.serviceId ?? "");
  const professionalId = String(b.professionalId ?? "");
  const date = String(b.date ?? "");
  const time = String(b.time ?? "");
  const customer = {
    name: String((b.customer as Record<string, unknown> | undefined)?.name ?? ""),
    phone: String((b.customer as Record<string, unknown> | undefined)?.phone ?? ""),
    email: String((b.customer as Record<string, unknown> | undefined)?.email ?? ""),
  };

  if (!isNonEmpty(serviceId)) return fail(400, "bad_request", "Selecione um serviço.");
  if (!isValidDateISO(date)) return fail(400, "bad_request", "Data inválida.");
  if (!isValidTime(time)) return fail(400, "bad_request", "Horário inválido.");

  const customerErrors = validateCustomer(customer, SITE.checkout.requireEmail);
  if (Object.keys(customerErrors).length > 0) {
    return fail(422, "validation_error", "Confira os dados informados.", customerErrors);
  }

  const service = getServiceById(serviceId);
  if (!service) return fail(404, "not_found", "Serviço não encontrado.");

  let professionalName = "Sem preferência";
  if (professionalId && professionalId !== "any") {
    const prof = getProfessionalById(professionalId);
    if (!prof) return fail(404, "not_found", "Profissional não encontrado.");
    professionalName = prof.name;
  } else if (getProfessionals().length === 0) {
    professionalName = "A definir";
  }

  const bookingProvider = getBookingProvider();
  const paymentProvider = getPaymentProvider();
  if (!bookingProvider || !paymentProvider) {
    return fail(503, "checkout_unavailable", "O checkout online está temporariamente indisponível. Fale conosco para agendar.");
  }

  // Reivindica a chave de idempotência de forma atômica ANTES de cobrar ou
  // agendar. Se outra requisição concorrente já venceu com esta mesma chave,
  // devolvemos o pedido que ela criou em vez de processar de novo.
  const claim = claimIdempotency(idempotencyKey, newOrderId());
  if (!claim.owner) {
    const existing = getOrder(claim.orderId);
    if (existing) return NextResponse.json({ order: toPublic(existing) });
    return fail(409, "processing", "Este agendamento já está sendo processado. Aguarde um instante e tente novamente.");
  }
  const orderId = claim.orderId;

  const subtotalCents = service.priceCents;
  const finalCents = service.promoPriceCents ?? service.priceCents;
  const discountCents = Math.max(0, subtotalCents - finalCents);

  try {
    const chargeResult = await paymentProvider.charge({
      amountCents: finalCents,
      description: `${SITE.name} — ${service.name}`,
      customerName: customer.name,
      customerEmail: customer.email,
      idempotencyKey,
    });

    if (!chargeResult.approved) {
      return fail(402, "payment_declined", chargeResult.failureMessage ?? "Pagamento não aprovado. Tente novamente.");
    }

    const appointment = await bookingProvider.createAppointment({
      serviceId,
      professionalId: professionalId || "any",
      date,
      time,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
    });

    const order: Order = {
      id: orderId,
      status: "confirmed",
      createdAt: new Date().toISOString(),
      serviceId,
      serviceName: service.name,
      professionalId: professionalId || "any",
      professionalName,
      date,
      time,
      durationMin: service.durationMin,
      subtotalCents,
      discountCents,
      totalCents: finalCents,
      customerFirstName: customer.name.trim().split(/\s+/)[0] ?? customer.name,
      paymentRef: chargeResult.paymentRef,
      appointmentRef: appointment.appointmentRef,
      demo: isDemo,
    };

    saveOrder(order);

    return NextResponse.json({ order: toPublic(order) });
  } catch {
    return fail(502, "provider_error", "Não foi possível concluir o agendamento agora. Nenhuma cobrança foi feita — tente novamente.");
  }
}

function toPublic(order: Order) {
  const { paymentRef: _paymentRef, appointmentRef: _appointmentRef, ...publicOrder } = order;
  return publicOrder;
}
