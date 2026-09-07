import userService from "@/server/services/users";
import { UserCreate } from "@/types/users";
import bcrypt from "bcrypt";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: UserCreate = await req.json();

    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Dados incompletos ou não enviados" },
        { status: 400 }
      );
    }

    // Criptografa a senha antes de chamar o serviço
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const userPayload = { ...body, password: hashedPassword };

    // 1. Chama a Service diretamente (e NÃO a Server Action)
    const data = await userService.create(userPayload);

    // 2. Invalida o cache via revalidateTag
    revalidateTag("users", "default");

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("ERROR POST /api/users", error);
    return NextResponse.json(
      { success: false, message: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}