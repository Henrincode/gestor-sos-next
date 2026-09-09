import { authenticateRequest } from "@/server/utils/auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  // autenticação
  const { errorResponse, user } = await authenticateRequest(req)
  if (errorResponse) return errorResponse

  
}