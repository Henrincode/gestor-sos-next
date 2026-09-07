import userService from "@/server/services/users";
import { NextRequest, NextResponse } from "next/server";

export async function authenticateRequest(req: NextRequest) {
  // tenta extrair do cookie ou header
  const tokenFromCookie = req.cookies.get("auth_token")?.value ?? req.cookies.get("token")?.value;
  const authHeader = req.headers.get("authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : undefined;

  const token = tokenFromCookie ?? tokenFromHeader;

  // erro se o token não for enviado
  if (!token) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "Token não fornecido" },
        { status: 401 }
      ),
      user: null,
    };
  }

  // valida no banco/serviço
  const user = await userService.tokenCheck(token);

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