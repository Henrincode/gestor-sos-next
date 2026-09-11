import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {

  // se existir cookie com token ele revalida em toda requisição
  // Executado tanto para navegantes da Web quanto para requisições do Expo à API
  const token = req.cookies.get("auth_token")?.value;
  const response = NextResponse.next();

  if (token) {
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 400, // mantém logado por 400 dias (padrão chrome)
      path: "/",
    });
  }

  return response;
}

// Configuração de captura
export const config = {
  /*
   * Filtro do Matcher:
   * Captura TODAS as rotas (incluindo /api/...), 
   * EXCETO arquivos estáticos do Next.js (_next/static, _next/image, favicon.ico, etc.)
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};