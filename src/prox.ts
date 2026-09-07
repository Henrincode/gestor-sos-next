// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function prox(request: NextRequest) {
  // Executado tanto para navegantes da Web quanto para requisições do Expo à API
  const token = request.cookies.get("auth_token")?.value;
  const response = NextResponse.next();

  if (token) {
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 400,
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