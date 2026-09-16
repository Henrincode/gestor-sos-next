import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import userService from "@/server/services/users";
import { UserCreate } from "@/types/users";
import { cookies } from "next/headers";
import authService from "@/server/services/auth";
import tokenService from "@/server/services/tokens";

export async function POST(req: NextRequest) {
  try {
    // autenticação:
    // se estiver logado não deixa criar conta outra conta
    const session = await authService.session(req)

    if (session.user) {
      return NextResponse.json(
        { message: "Você esta logado no sistema, faça logout para criar outro usuário." },
        { status: 409 }
      )
    }

    // extrai campos do body da requisição
    const { name, email, password }: UserCreate = await req.json()

    // verifica se existem campos undefined
    if (!email || !email || !password) {
      return NextResponse.json(
        {
          message: "Corpo 'body' da requisição contém campos ausente.",
          errors: {
            ...(!name && { name: ["Campo ausente"] }),
            ...(!email && { email: ["Campo ausente"] }),
            ...(!password && { name: ["Campo ausente"] }),
          }
        },
        { status: 400 }
      )
    }

    // faz o hash da senha
    const passHash = await bcrypt.hash(password, 10)

    // cria o usuário
    const newUser: UserCreate = { name, email, password: passHash }
    const data = await userService.create(newUser)

    // gera um token de autenticação
    const token = await tokenService.create(data.id)

    // Define o Cookie HTTP-Only (Web / Navegador)
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 400, // mantém logado por 400 dias (padrão chrome)
      path: "/",
    })

    // retorna mensagem de sucesso
    return NextResponse.json(
      {
        success: true,
        message: `Usuário "${data.name}" com e-mail "${data.emails[0].email}" criado com sucesso!`,
        data: { token }
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.log("ERROR api/auth/create:", error)

    // retorna informação de email já cadastrado para o frontend
    if (error?.code === "23505") {
      return NextResponse.json(
        {
          success: false,
          message: "E-Mail já cadastrado.",
          errors: {
            email: ["E-Mail já cadastrado."]
          }
        },
        { status: 409 }
      )
    }

    // retorna um erro tratado para o frontend
    return NextResponse.json(
      {
        success: false,
        message: "Ocorreu um erro interno em nossos servidores. Tente novamente mais tarde."
      },
      { status: 500 }
    )
  }
}