import { OrderStatusFind } from '@/server/actions/orders'
import { Crushed } from 'next/font/google'
import { NextResponse } from 'next/server'

export async function GET() {

  return NextResponse.json(await OrderStatusFind())

  return NextResponse.json({
    sucesso: true,
    mensagem: 'Conexão estabelecida com sucesso entre Expo e Next.js!',
    timestamp: new Date().toISOString(),
  })
}