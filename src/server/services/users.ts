import { User, UserCreate, UserToken } from "@/types/users"

async function create(user: UserCreate): Promise<UserToken> {
  return {id: 1, token: 'token'}
}

const userService = {}

export default userService