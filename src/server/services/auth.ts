import sql from "../db/supabase";

// check token
async function check(token: string) {
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
  return row || null
}

const authService = {
  check
}

export default authService