import sql from "../db/supabase";
import crypto from 'crypto';
import { revalidateTag, unstable_cache } from "next/cache";

// ----------
// TOKEN CHECK
// ----------
const check = unstable_cache(
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
async function create(user_id: number) {

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
async function remove(token: string) {
  const [row] = await sql<[{ token: string }]>`
    UPDATE sos_user_tokens SET
    deleted_at = NOW()
    WHERE token = ${token}
  `

  if (row) revalidateTag("tokens", "max")

  return row
}

const tokenService = {
  check,
  create,
  delete: remove
}

export default tokenService