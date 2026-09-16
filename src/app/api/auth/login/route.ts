import userService from "@/server/services/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { cookies } from "next/headers";
import authService from "@/server/services/auth";
import tokenService from "@/server/services/tokens";

export async function POST(req: NextRequest) {
  try {
    // autenticação:
    // se estiver logado não gera outro token
    const session = await authService.session(req)

    if (session.user) {
      return NextResponse.json(
        { message: "Você já esta logado no sistema, faça logout para entrar com outra conta." },
        { status: 409 }
      )
    }

    // extrai campos do body da requisição
    const { email, password } = await req.json()

    // verifica se existem campos undefined
    if (!email || !password) {
      return NextResponse.json(
        {
          message: "Body contém campos ausente",
          errors: {
            ...(!email && { email: ["Campo ausente"] }),
            ...(!password && { name: ["Campo ausente"] }),
          }
        },
        { status: 400 }
      )
    }

    // busca email no banco, se existir retorna id e senha
    const data = await userService.getPasswordByEmail(email)

    if (!data) {
      return NextResponse.json(
        { message: 'E-Mail ou senha inválidos' },
        { status: 400 }
      )
    }

    // compara o hash das senhas
    if (!await bcrypt.compare(password, data.password)) {
      return NextResponse.json(
        { message: 'E-Mail ou senha inválidos' },
        { status: 400 }
      )
    }

    // gera um token de autenticação
    const token = await tokenService.create(data.id)

    // define o Cookie HTTP-Only (Web / Navegador)
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 400, // mantém logado por 400 dias (padrão chrome)
      path: "/",
    })

    // retorna a resposta de sucesso com token (expo / mobile)
    return NextResponse.json(
      {
        message: "Login realizado com sucesso.",
        token
      },
      { status: 200 }
    )

  } catch (error) {
    console.log('ERRPR api/auth/login', error)

    // retorna um erro tratado para o frontend
    return NextResponse.json(
      { message: "Ocorreu um erro interno em nossos servidores. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}