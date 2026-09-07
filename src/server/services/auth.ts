import { LoginReq } from "@/types/auth";
import sql from "../db/supabase";
import bcrypt from 'bcrypt'



const authService = {}

export default authService