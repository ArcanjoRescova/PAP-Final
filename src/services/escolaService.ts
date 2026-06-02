import { supabase } from "@/lib/supabase"
import type { Escola, EscolaMatricula, EscolaAssiduidade, EscolaAvaliacao } from "@/types/database"

// =====================
// ESCOLAS
// =====================

export async function listarEscolas(): Promise<Escola[]> {
  const { data, error } = await supabase
    .from("escola")
    .select("*")
    .order("nome", { ascending: true })

  if (error) throw error
  return data || []
}

export async function obterEscola(id: string): Promise<Escola | null> {
  const { data, error } = await supabase
    .from("escola")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function criarEscola(
  escola: Omit<Escola, "id" | "created_at">
): Promise<Escola> {
  const { data, error } = await supabase
    .from("escola")
    .insert([escola])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarEscola(
  id: string,
  escola: Partial<Omit<Escola, "id" | "created_at">>
): Promise<Escola> {
  const { data, error } = await supabase
    .from("escola")
    .update(escola)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerEscola(id: string): Promise<void> {
  const { error } = await supabase.from("escola").delete().eq("id", id)
  if (error) throw error
}

export async function contarEscolas(): Promise<number> {
  const { count, error } = await supabase
    .from("escola")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

// =====================
// MATRÍCULAS
// =====================

export interface MatriculaComRelacoes extends EscolaMatricula {
  crianca?: { id: string; nome_completo: string }
  escola?: { id: string; nome: string }
}

export async function listarMatriculas(): Promise<MatriculaComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_matricula")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      escola:escola_id(id, nome)
    `)
    .order("ano_letivo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarMatriculasPorCrianca(
  criancaId: string
): Promise<MatriculaComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_matricula")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      escola:escola_id(id, nome)
    `)
    .eq("crianca_id", criancaId)
    .order("ano_letivo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarMatriculasPorEscola(
  escolaId: string
): Promise<MatriculaComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_matricula")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      escola:escola_id(id, nome)
    `)
    .eq("escola_id", escolaId)
    .order("ano_letivo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarMatricula(
  matricula: Omit<EscolaMatricula, "id" | "created_at">
): Promise<EscolaMatricula> {
  const { data, error } = await supabase
    .from("escola_matricula")
    .insert([matricula])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarMatricula(
  id: string,
  matricula: Partial<Omit<EscolaMatricula, "id" | "created_at">>
): Promise<EscolaMatricula> {
  const { data, error } = await supabase
    .from("escola_matricula")
    .update(matricula)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerMatricula(id: string): Promise<void> {
  const { error } = await supabase.from("escola_matricula").delete().eq("id", id)
  if (error) throw error
}

export async function contarMatriculas(): Promise<number> {
  const { count, error } = await supabase
    .from("escola_matricula")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

// =====================
// ASSIDUIDADE
// =====================

export interface AssiduidadeComRelacoes extends EscolaAssiduidade {
  crianca?: { id: string; nome_completo: string }
}

export async function listarAssiduidade(): Promise<AssiduidadeComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_assiduidade")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo)
    `)
    .order("data", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarAssiduidadePorCrianca(
  criancaId: string
): Promise<AssiduidadeComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_assiduidade")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo)
    `)
    .eq("crianca_id", criancaId)
    .order("data", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarAssiduidade(
  assiduidade: Omit<EscolaAssiduidade, "id" | "created_at">
): Promise<EscolaAssiduidade> {
  const { data, error } = await supabase
    .from("escola_assiduidade")
    .insert([assiduidade])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarAssiduidade(
  id: string,
  assiduidade: Partial<Omit<EscolaAssiduidade, "id" | "created_at">>
): Promise<EscolaAssiduidade> {
  const { data, error } = await supabase
    .from("escola_assiduidade")
    .update(assiduidade)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerAssiduidade(id: string): Promise<void> {
  const { error } = await supabase.from("escola_assiduidade").delete().eq("id", id)
  if (error) throw error
}

// =====================
// AVALIAÇÕES
// =====================

export interface AvaliacaoComRelacoes extends EscolaAvaliacao {
  crianca?: { id: string; nome_completo: string }
}

export async function listarAvaliacoes(): Promise<AvaliacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_avaliacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo)
    `)
    .order("ano_letivo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarAvaliacoesPorCrianca(
  criancaId: string
): Promise<AvaliacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("escola_avaliacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo)
    `)
    .eq("crianca_id", criancaId)
    .order("ano_letivo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarAvaliacao(
  avaliacao: Omit<EscolaAvaliacao, "id" | "created_at">
): Promise<EscolaAvaliacao> {
  const { data, error } = await supabase
    .from("escola_avaliacao")
    .insert([avaliacao])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerAvaliacao(id: string): Promise<void> {
  const { error } = await supabase.from("escola_avaliacao").delete().eq("id", id)
  if (error) throw error
}

export async function contarAvaliacoes(): Promise<number> {
  const { count, error } = await supabase
    .from("escola_avaliacao")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}
