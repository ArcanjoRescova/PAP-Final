import { supabase } from "@/lib/supabase"
import type { Crianca } from "@/types/database"

export async function listarCriancas(): Promise<Crianca[]> {
  const { data, error } = await supabase
    .from("crianca")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function contarCriancas(): Promise<number> {
  const { count, error } = await supabase
    .from("crianca")
    .select("*", { count: "exact", head: true })
    .eq("estado", "Ativa")

  if (error) throw error
  return count || 0
}

export async function obterCrianca(id: string): Promise<Crianca | null> {
  const { data, error } = await supabase.from("crianca").select("*").eq("id", id).single()
  if (error) throw error
  return data
}

export async function criarCrianca(
  crianca: Omit<Crianca, "id" | "created_at">
): Promise<Crianca> {
  const { data, error } = await supabase.from("crianca").insert([crianca]).select().single()
  if (error) throw error
  return data
}

export async function atualizarCrianca(
  id: string,
  crianca: Partial<Omit<Crianca, "id" | "created_at">>
): Promise<Crianca> {
  const { data, error } = await supabase.from("crianca").update(crianca).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function removerCrianca(id: string): Promise<void> {
  const { error } = await supabase.from("crianca").delete().eq("id", id)
  if (error) throw error
}

