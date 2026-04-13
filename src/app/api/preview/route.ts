import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: false,
    message: "Rota de preview ainda não implementada. Requer OAuth e integração com o Process API."
  });
}
