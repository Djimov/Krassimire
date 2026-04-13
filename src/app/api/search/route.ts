import { NextResponse } from "next/server";
import { buildStacSearchRequest } from "@/services/copernicus";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = buildStacSearchRequest(body);
  return NextResponse.json({ ok: true, payload });
}
