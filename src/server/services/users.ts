import { User, UserCreate } from "@/types/users";
import sql from "../db/supabase";
import { unstable_cache } from "next/cache";
import { LoginReq } from "@/types/auth";

// create user
const create = async (userCreateData: UserCreate): Promise<User> => {
  const { email, ...userData } = userCreateData;

  return await sql.begin(async (tx) => {
    // 1. Insere na tabela de usuários
    const [createdUser] = await tx<[{ id: number; name: string }]>`
      INSERT INTO sos_users ${tx(userData)}
      RETURNING id, name
    `;

    // 2. Insere na tabela de e-mails usando is_primary
    const [createdEmail] = await tx<[{ email: string; is_primary: boolean }]>`
      INSERT INTO sos_user_emails ${tx({
      user_id: createdUser.id, // ajuste o nome da FK se for diferente no seu banco
      email: email,
      is_primary: true
    })}
      RETURNING email, is_primary
    `;

    // 3. Monta o retorno garantindo a compatibilidade com a type User (primary)
    return {
      id: createdUser.id,
      name: createdUser.name,
      emails: [
        {
          email: createdEmail.email,
          primary: createdEmail.is_primary // Mapeia is_primary (banco) para primary (tipo TS)
        }
      ]
    };
  });
};

const findAll = unstable_cache(
  async () => {

  },
  ['order-findAll'],
  { tags: ['order', 'users'] }
)

// get password by email
async function getPasswordByEmail(email: string) {
  const [row] = await sql<LoginReq[]>`
    SELECT 
      u.id id,
      e.email email,
      u.password password
    FROM sos_users u
    INNER JOIN sos_user_emails e
      on u.id = e.user_id
    WHERE e.email = ${email}
    LIMIT 1
  `
  return row || null
}

async function tokenCreate({id, token}: {id: number, token: string}) {
  const [row] = await sql<[{token: string}]>`
    INSERT INTO sos_user_tokens ${sql({user_id: id, token})}
    returning token
  `
  return row.token
}

const userService = {
  create,
  getPasswordByEmail,
  tokenCreate
};

export default userService;