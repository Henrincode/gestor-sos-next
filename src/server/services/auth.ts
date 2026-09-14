import { NextRequest } from "next/server";
import sql from "../db/supabase";
import crypto from 'crypto'
import { revalidateTag, unstable_cache } from "next/cache";
import tokenService from "./tokens";

// ----------
// SESSION
// ----------
export async function session(req: NextRequest) {
  // tenta extrair token do cookie
  const tokenFromCookie = req.cookies.get("auth_token")?.value
  // tenta extrair token do header
  const authHeader = req.headers.get("authorization")
  // tenta extrair do padrão de mercado para app "Bearer ${token}"
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.headers.get("auth_token") // fallback mantido por compatibilidade

  const token = tokenFromCookie ?? tokenFromHeader

  // verifica se token é undefined
  if (!token) {
    return {
      user: null,
      token: null,
      error: {
        message: "Token não fornecido, faça login para um novo token.",
        example: "auth_token: token, or authorization: Bearer ${token}"
      }
    }
  }

  // valida no banco/serviço
  const user = await tokenService.check(token);

  // erro se o token for inválido
  if (!user) {
    return {
      user: null,
      token: null,
      error: {
        message: "Token inválido ou expirado",
        example: "auth_token: token, or authorization: Bearer ${token}"
      }
    }
  }

  // retorna os dados validados
  return { user, token, error: null }
}

const authService = {
  session
}

export default authService