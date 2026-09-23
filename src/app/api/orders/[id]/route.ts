import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/orders/store";
import type { ApiErrorBody, Order } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const order = getOrder(id);
  if (!order) {
    const body: ApiErrorBody = { error: { code: "not_found", message: "Pedido não encontrado." } };
    return NextResponse.json(body, { status: 404 });
  }
  const { paymentRef: _paymentRef, appointmentRef: _appointmentRef, ...publicOrder } = order satisfies Order;
  return NextResponse.json({ order: publicOrder }, { headers: { "Cache-Control": "no-store" } });
}
