import { authenticateRequest } from "@/server/utils/auth";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from 'bcrypt';
import userService from "@/server/services/users";
import { UserCreate } from "@/types/users";
import { cookies } from "next/headers";
import authService from "@/server/services/auth";

export async function POST(req: NextRequest) {
  try {
    // autenticação: se estiver logado não deixa criar uma conta.
    const { errorResponse, user } = await authenticateRequest(req)
    if (user) {
      return NextResponse.json({success: false, message: "Você já esta logado!"})
    }

    // extrai usuário email e senha
    const body: UserCreate = await req.json()
    const { name, email, password } = body

    // faz o hash da senha
    const passHash = await bcrypt.hash(password, 10)

    // cria o usuário
    const newUser: UserCreate = { name, email, password: passHash }
    const data = await userService.create(newUser)

    // Gera um token opaco aleatório seguro de 64 caracteres hexadecimais
    const token = crypto.randomBytes(32).toString("hex")
    await authService.tokenCreate({ id: data.id, token })

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
    return NextResponse.json({
      success: true, message: `Usuário ${data.name} com e-mail ${data.emails[0].email} criado com sucesso!`
    })

  } catch (error: any) {
    // caso email já exista informa o front-end
    console.error("ERROR API AUTH CREATE", error)
    if (error.code === '23505') {
      return NextResponse.json({
        success: false, message: "E-Mail já existe"
      })
    }

    // retorn padrão
    return NextResponse.json({
      success: false, message: "Erro interno do servidor"
    })
  }
}