'use server'

import { ApiResponse } from "@/types/apiResponse";
import { User, UserCreate } from "@/types/users";
import bcrypt from 'bcrypt';
import { updateTag } from 'next/cache';
import userService from '../services/users';

export async function userCreate(user: UserCreate): ApiResponse<User> {
  if (!user) {
    return {
      success: false,
      message: 'Dados não foram enviados'
    };
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const data = await userService.create({ ...user, password: hashedPassword });

    // Funciona perfeitamente AQUI quando for chamado por formulários React
    updateTag('users');

    return { success: true, data };
  } catch (error) {
    console.error('ERROR ACTION userCreate', error);
    return { success: false, message: 'Erro interno do servidor' };
  }
}