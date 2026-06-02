import { supabase } from "@/lib/supabase"
import type { Atividade, AtividadeParticipacao } from "@/types/database"

// =====================
// ATIVIDADES
// =====================

export async function listarAtividades(): Promise<Atividade[]> {
  const { data, error } = await supabase
    .from("atividade")
    .select("*")
    .order("nome", { ascending: true })

  if (error) throw error
  return data || []
}

export async function obterAtividade(id: string): Promise<Atividade | null> {
  const { data, error } = await supabase
    .from("atividade")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function criarAtividade(
  atividade: Omit<Atividade, "id" | "created_at">
): Promise<Atividade> {
  const { data, error } = await supabase
    .from("atividade")
    .insert([atividade])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarAtividade(
  id: string,
  atividade: Partial<Omit<Atividade, "id" | "created_at">>
): Promise<Atividade> {
  const { data, error } = await supabase
    .from("atividade")
    .update(atividade)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerAtividade(id: string): Promise<void> {
  const { error } = await supabase.from("atividade").delete().eq("id", id)
  if (error) throw error
}

export async function contarAtividades(): Promise<number> {
  const { count, error } = await supabase
    .from("atividade")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

// =====================
// PARTICIPAÇÕES
// =====================

export interface ParticipacaoComRelacoes extends AtividadeParticipacao {
  crianca?: { id: string; nome_completo: string }
  atividade?: { id: string; nome: string }
}

export async function listarParticipacoes(): Promise<ParticipacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("atividade_participacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      atividade:atividade_id(id, nome)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarParticipacoesPorCrianca(
  criancaId: string
): Promise<ParticipacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("atividade_participacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      atividade:atividade_id(id, nome)
    `)
    .eq("crianca_id", criancaId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarParticipacoesPorAtividade(
  atividadeId: string
): Promise<ParticipacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("atividade_participacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      atividade:atividade_id(id, nome)
    `)
    .eq("atividade_id", atividadeId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarParticipacao(
  participacao: Omit<AtividadeParticipacao, "id" | "created_at">
): Promise<AtividadeParticipacao> {
  const { data, error } = await supabase
    .from("atividade_participacao")
    .insert([participacao])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarParticipacao(
  id: string,
  participacao: Partial<Omit<AtividadeParticipacao, "id" | "created_at">>
): Promise<AtividadeParticipacao> {
  const { data, error } = await supabase
    .from("atividade_participacao")
    .update(participacao)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerParticipacao(id: string): Promise<void> {
  const { error } = await supabase.from("atividade_participacao").delete().eq("id", id)
  if (error) throw error
}

export async function contarParticipacoes(): Promise<number> {
  const { count, error } = await supabase
    .from("atividade_participacao")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}
