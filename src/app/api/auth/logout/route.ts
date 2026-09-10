import authService from "@/server/services/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  
  // captura o token 
  const token = req.cookies.get('auth_token')?.value
  if(!token) return NextResponse.json({msg: 'sem token'})
  
  // apaga o cookie
  const cookieStore = await cookies()


  const data = await authService.tokenDelete(token)
  
  cookieStore.delete({ name: 'auth_token', path: '/' })

  return NextResponse.json({msg: 'token removido?'})
}