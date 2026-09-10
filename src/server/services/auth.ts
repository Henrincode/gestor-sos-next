import sql from "../db/supabase";

// check token
async function tokenCheck(token: string) {
  const [row] = await sql<[{ id: number }]>`
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
}

// cria um token
async function tokenCreate({ id, token }: { id: number, token: string }) {
  const [row] = await sql<[{ token: string }]>`
    INSERT INTO sos_user_tokens ${sql({ user_id: id, token })}
    RETURNING token
  `
  return row.token
}

// remove o token
async function tokenDelete(token: string) {
  const [row] = await sql<[{token: string}]>`
    UPDATE sos_user_tokens SET
    deleted_at = NOW()
    WHERE token = ${token}
  `
  return row
}

const authService = {
  tokenCheck,
  tokenCreate,
  tokenDelete
}

export default authService