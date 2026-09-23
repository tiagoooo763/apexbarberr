import { NextRequest, NextResponse } from "next/server";
import { getBookingProvider } from "@/lib/booking";
import { isValidDateISO, isNonEmpty } from "@/lib/validate";
import type { ApiErrorBody } from "@/types";

export const dynamic = "force-dynamic";

function badRequest(message: string): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code: "bad_request", message } }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date") ?? "";
  const serviceId = req.nextUrl.searchParams.get("serviceId") ?? "";
  const professionalId = req.nextUrl.searchParams.get("professionalId") ?? "any";

  if (!isValidDateISO(date)) return badRequest("Data inválida.");
  if (!isNonEmpty(serviceId)) return badRequest("Selecione um serviço.");

  const provider = getBookingProvider();
  if (!provider) {
    return NextResponse.json(
      { error: { code: "booking_unavailable", message: "Agendamento online está temporariamente indisponível." } },
      { status: 503 },
    );
  }

  try {
    const slots = await provider.getAvailableSlots({ date, serviceId, professionalId });
    return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json(
      { error: { code: "provider_error", message: "Não foi possível consultar os horários agora. Tente novamente." } },
      { status: 502 },
    );
  }
}
