import userService from "@/server/services/users";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {

    const body = await req.json()
    const { email, password } = body

    // verifica se email e senha não são nulos
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'E-mail deve ser preenchido' }
      )
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Senha deve ser preenchido' }
      )
    }

    // busca email no banco, se existir já trás id e senha
    const data = await userService.getPasswordByEmail(email)

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'E-Mail ou senha inválidos' }
      )
    }

    // compara o hash das senhas
    if (!await bcrypt.compare(password, data.password)) {
      return NextResponse.json(
        { success: false, message: 'E-Mail ou senha inválidos' }
      )
    }

    // Gera um token opaco aleatório seguro de 64 caracteres hexadecimais
    const token = crypto.randomBytes(32).toString("hex")
    await userService.tokenCreate({id: data.id, token})

    // Define o Cookie HTTP-Only (Web / Navegador)
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 400, // mantém logado por 400 dias (padrão chrome)
      path: "/",
    })

    // Retorna a resposta de sucesso com os dados limpos e o token no json (expo / mobile)
    return NextResponse.json(
      {
        success: true,
        message: "Login realizado com sucesso",
        token
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('API AUTH POST', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}