import { supabase } from "@/lib/supabase"

export interface User {
  id: string
  email: string
  nome?: string
}

export async function login(email: string, password: string) {
  // Faz autenticação por email/palavra-passe no Supabase Auth.
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function logout() {
  // Termina a sessão atual do utilizador.
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  // Devolve a sessão ativa (token e user), se existir.
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw error
  return data.user
}

export async function registarUtilizador(email: string, password: string) {
  // Cria um novo utilizador na autenticação do Supabase.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error
  return data
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback)
}
