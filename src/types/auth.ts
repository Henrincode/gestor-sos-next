export type LoginReq = {
  id: number
  email: string
  password: string
}

export type LoginRes = {
  token: string
}