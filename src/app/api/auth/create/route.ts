import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import userService from "@/server/services/users";
import { UserCreate } from "@/types/users";
import { cookies } from "next/headers";
import authService from "@/server/services/auth";

export async function POST(req: NextRequest) {
  try {
    // autenticação: se estiver logado não deixa criar conta
    const session = await authService.session(req)

    if (session.user) {
      return NextResponse.json(
        { message: "Você esta logado no sistema, faça logout para criar outro usuário." },
        { status: 409 }
      )
    }

    // extrai campos do body da requisição
    const { name, email, password }: UserCreate = await req.json()

    // faz o hash da senha
    const passHash = await bcrypt.hash(password, 10)

    // cria o usuário
    const newUser: UserCreate = { name, email, password: passHash }
    const data = await userService.create(newUser)

    // gera um token de autenticação
    const token = await authService.tokenCreate(data.id)

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
      { message: `Usuário ${data.name} com e-mail ${data.emails[0].email} criado com sucesso!` },
      { status: 201 }
    )

  } catch (error: any) {
    // caso email já exista informa o front-end
    console.error("ERROR API AUTH CREATE", error)
    if (error?.code === '23505') {
      return NextResponse.json(
        { message: "E-Mail já existe" },
        { status: 409 }
      )
    }

    // retorn padrão
    return NextResponse.json(
      { message: "Ocorreu um erro interno em nossos servidores. Tente novamente mais tarde." },
      { status: 500 }
    )
  }
}