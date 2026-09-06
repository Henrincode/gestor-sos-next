import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ tipo: 'GET' })
}

export async function POST() {
  return NextResponse.json({tipo: 'POST'})
}

export async function PUT() {
  return NextResponse.json({tipo: 'PUT'})
}

export async function DELETE() {
  return NextResponse.json({tipo: 'DELETE'})
}