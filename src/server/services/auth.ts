import { NextRequest } from "next/server";
import sql from "../db/supabase";
import crypto from 'crypto'
import { revalidateTag, unstable_cache } from "next/cache";

// ----------
// TOKEN CHECK
// ----------
const tokenCheck = unstable_cache(
  async (token: string) => {
    const [row] = await sql<[{ id: number, name: string, email_id: number, email: string, }]>`
    SELECT 
      u.id,
      u.name,
      e.id email_id,
      e.email
    from sos_users u
    inner join sos_user_tokens t
      on u.id = t.user_id
    inner join sos_user_emails e
      on u.id = e.user_id
    where token = ${token}
      and e.is_primary = true
    LIMIT 1
  `
    return row
  },
  ["tokens"],
  { tags: ["tokens"] }
)

// ----------
// TOKEN CREATE
// ----------
async function tokenCreate(user_id: number) {

  const token = crypto.randomBytes(32).toString("hex")

  const [row] = await sql<[{ token: string }]>`
    INSERT INTO sos_user_tokens ${sql({ user_id, token })}
    RETURNING token
  `

  if (row) revalidateTag("tokens", "max")

  return row.token
}

// ----------
// TOKEN DELETE
// ----------
async function tokenDelete(token: string) {
  const [row] = await sql<[{ token: string }]>`
    UPDATE sos_user_tokens SET
    deleted_at = NOW()
    WHERE token = ${token}
  `

  if (row) revalidateTag("tokens", "max")

  return row
}

// ----------
// SESSION
// ----------
export async function session(req: NextRequest) {
  // tenta extrair token do cookie
  const tokenFromCookie = req.cookies.get("auth_token")?.value
  // tenta extrair token do header
  const authHeader = req.headers.get("authorization")
  // tenta extrair do padrão de mercado para app "Bearer ${token}"
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.headers.get("auth_token") // fallback mantido por compatibilidade

  const token = tokenFromCookie ?? tokenFromHeader

  // verifica se token é undefined
  if (!token) {
    return {
      user: null,
      token: null,
      error: {
        message: "Token não fornecido, faça login para um novo token.",
        example: "auth_token: token, or authorization: Bearer ${token}"
      }
    }
  }

  // valida no banco/serviço
  const user = await tokenCheck(token);

  // erro se o token for inválido
  if (!user) {
    return {
      user: null,
      token: null,
      error: {
        message: "Token inválido ou expirado",
        example: "auth_token: token, or authorization: Bearer ${token}"
      }
    }
  }

  // retorna os dados validados
  return { user, token, error: null }
}

const authService = {
  tokenCheck,
  tokenCreate,
  tokenDelete,
  session
}

export default authService