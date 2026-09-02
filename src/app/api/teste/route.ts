import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    sucesso: true,
    mensagem: 'Conexão estabelecida com sucesso entre Expo e Next.js!',
    timestamp: new Date().toISOString(),
  })
}