import { authenticateRequest } from "@/server/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // autenticação
    const { errorResponse, user } = await authenticateRequest(req)
    if (errorResponse) return errorResponse

    // lógica da rota usando o usuário autenticado
    return NextResponse.json({
      msg: "tudo certo até aqui...",
      user,
    });
  } catch (error) {
    console.error("API ROUTE ERROR", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}