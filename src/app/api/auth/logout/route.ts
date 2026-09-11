import authService from "@/server/services/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  
  // captura o token 
  const token = req.cookies.get('auth_token')?.value
  if(!token) return NextResponse.json({msg: 'sem token'})
  
  // apaga o cookie
  const cookieStore = await cookies()
  await authService.tokenDelete(token)
  
  // soft delete do token no banco
  cookieStore.delete({ name: 'auth_token', path: '/' })

  return NextResponse.json({msg: 'token removido?'})
}