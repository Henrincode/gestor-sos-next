'use server'

import { ApiResponse } from "@/types/APIResponse";
import { User, UserCreate } from "@/types/users";

function userFindAll() {}

function userFindByEmail(email: string) {}

export async function userCreate(user: UserCreate): ApiResponse<User> {

  if(!user) {
    return {
      success: false,
      message: 'Dados não foram enviados'
    }

    
  }
}