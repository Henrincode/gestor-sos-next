import authService from "@/server/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // autenticação
    const session = await authService.session(req)
    if (session.error) return NextResponse.json(
      session.error,
      { status: 401 }
    )

    // lógica da rota usando o usuário autenticado
    return NextResponse.json(
      {
        message: "tudo certo até aqui...",
        user: session.user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API ROUTE ERROR", error);
    return NextResponse.json(
      { message: "Ocorreu um erro interno em nossos servidores. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}