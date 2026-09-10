import userService from "@/server/services/users";
import { NextRequest, NextResponse } from "next/server";
import authService from "../services/auth";

export async function authenticateRequest(req: NextRequest) {
  // tenta extrair do cookie ou header
  const tokenFromCookie = req.cookies.get("auth_token")?.value
  const tokenFromHeader = req.headers.get("auth_token")

  const token = tokenFromCookie ?? tokenFromHeader

  // erro se o token não for enviado
  if (!token) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "Token não fornecido, faça login para um novo token" },
        { status: 401 }
      ),
      user: null,
    };
  }

  // valida no banco/serviço
  const user = await authService.tokenCheck(token);

  // erro se o token for inválido
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "Token inválido ou expirado" },
        { status: 401 }
      ),
      user: null,
    };
  }

  // retorna os dados validados
  return { errorResponse: null, user, token };
}