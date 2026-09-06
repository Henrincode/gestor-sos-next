import { ApiResponse } from "@/types/APIResponse";
import { User, UserCreate } from "@/types/users";
import sql from "../db/supabase";

const create = async (user: UserCreate): Promise<User> => {
  const [row] = await sql<User[]>`
    INSERT INTO sos_users ${sql(user)}
    RETURNING *
  `
  return row
}