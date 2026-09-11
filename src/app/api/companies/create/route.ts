import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

  const {name} = await req.json()
  
  if (!name) {
    return NextResponse.json({ success: false, message: "Campo nome deve ser preenchido" })
  }

  
}