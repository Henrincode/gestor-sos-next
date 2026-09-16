import authService from "@/server/services/auth";
import tokenService from "@/server/services/tokens";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // autenticação:
    // se o usuário não estiver logado não roda a api
    const session = await authService.session(req)
    if (session.error) return NextResponse.json({ message: session.error.message }, { status: 401 })

    // apaga o cookie
    const cookieStore = await cookies()
    await tokenService.delete(session.token)

    // soft delete do token no banco
    cookieStore.delete({ name: 'auth_token', path: '/' })

    return NextResponse.json({ message: 'token removido com sucesso.' }, { status: 200 })

  } catch (error) {
    console.log("ERROR api/auth/logout:", error)

    // retorna um erro tratado para o frontend
    return NextResponse.json(
      { message: "Ocorreu um erro interno em nossos servidores. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}