import sql from "../db/supabase";

async function create(params: {user_id: number, name: string}) {

  const [row] = await sql`
    INSERT sos_companies VALUES ${sql(params)}
    returning *
  `
}