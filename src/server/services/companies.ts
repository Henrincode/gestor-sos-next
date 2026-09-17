import sql from "../db/supabase";

// ----------
// COMPANIE FIND ALL BY USER ID
// ----------
async function findAllByUserId(user_id: number) {
  const row = await sql`
    SELECT c.id, c.name
    FROM sos_company_users cu
    inner join sos_companies c
      ON c.id = cu.company_id
    WHERE cu.user_id = ${user_id}
  `
  return row
}

// ----------
// COMPANIE CREATE
// ----------
async function create(params: { user_id: number; name: string }) {
  const { user_id, name } = params

  return await sql.begin(async (tx) => {
    // cria a empresa
    const [company] = await tx`
      INSERT INTO sos_companies ${tx({ name })}
      RETURNING *
    `

    // vincula o usuário
    await tx`
      INSERT INTO sos_company_users ${tx({
      user_id,
      company_id: company.id,
      company_permission_id: 1,
      order_permission_id: 1,
    })}
    `

    // busca o registro montado com os joins
    const [company_user] = await tx`
      SELECT 
        cu.company_id,
        cu.user_id,
        c.name AS company_name,
        u.name AS user_name,
        cup.name AS company_permission,
        cop.name AS order_permission
      FROM sos_company_users cu
      JOIN sos_companies c ON c.id = cu.company_id
      JOIN sos_users u ON u.id = cu.user_id
      JOIN sos_company_user_permissions cup ON cup.id = cu.company_permission_id
      JOIN sos_company_order_permissions cop ON cop.id = cu.order_permission_id
      WHERE cu.company_id = ${company.id} AND cu.user_id = ${user_id}
    `
    return company_user
  })
}

const companyService = {
  findAllByUserId,
  create
}

export default companyService