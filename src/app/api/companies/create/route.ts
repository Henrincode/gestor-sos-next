import authService from "@/server/services/auth";
import companiesService from "@/server/services/companies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // autenticação:
    // se o usuário não estiver logado não roda a api
    const session = await authService.session(req)
    if (session.error) return NextResponse.json(
      { message: session.error.message },
      { status: 401 }
    )

    // extrai campos do body
    const { name } = await req.json()

    // verifica se tem campos ausente
    if (!name) {
      return NextResponse.json(
        {
          message: "Campo nome deve ser preenchido",
          errors: { name: ["Campo obrigatório"] }
        },
        { status: 400 }
      )
    }

    // cria o obj da nova empresa
    const newCompanie = {
      user_id: session.user.id,
      name
    }

    const data = await companiesService.create(newCompanie)

    return NextResponse.json({ data }, { status: 201 })

  } catch (error) {
    console.log("ERROR api/companies/create:", error)

    // retorna um erro tratado para o frontend
    return NextResponse.json(
      {
        message: "Ocorreu um erro interno em nossos servidores. Tente novamente mais tarde."
      },
      { status: 500 }
    )
  }


}