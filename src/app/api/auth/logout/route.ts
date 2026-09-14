import authService from "@/server/services/auth";
import tokenService from "@/server/services/tokens";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {

  // captura o token 
  // const token = req.cookies.get('auth_token')?.value
  // if (!token) return NextResponse.json({ msg: 'sem token.' }, {status: 401})

  const session = await authService.session(req)
  if (session.error) return NextResponse.json({ message: session.error.message }, { status: 401 })

  // apaga o cookie
  const cookieStore = await cookies()
  await tokenService.delete(session.token)

  // soft delete do token no banco
  cookieStore.delete({ name: 'auth_token', path: '/' })

  return NextResponse.json({ message: 'token removido.' }, { status: 200 })
}