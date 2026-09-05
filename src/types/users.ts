export type User = {
  id: number
  name: string
  emails: {
    email: string
    primary: boolean
  }[]
}

export type UserCreate = {
  name: string
  email: string
  password: string
}

export type UserToken = {
  id: number,
  token: string
}

export type UserFind = Pick<User, 'id' | 'name'>

export type UserUpdate = Pick<User, 'id'> & Partial<Omit<User, 'id'>>