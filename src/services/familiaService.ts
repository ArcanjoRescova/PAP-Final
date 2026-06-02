import { supabase } from "@/lib/supabase"
import type { Familia, CriancaFamilia, FamiliaVisita } from "@/types/database"

// =====================
// FAMÍLIAS
// =====================

export async function listarFamilias(): Promise<Familia[]> {
  const { data, error } = await supabase
    .from("familia")
    .select("*")
    .order("nome_responsavel", { ascending: true })

  if (error) throw error
  return data || []
}

export async function obterFamilia(id: string): Promise<Familia | null> {
  const { data, error } = await supabase
    .from("familia")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function criarFamilia(
  familia: Omit<Familia, "id" | "created_at">
): Promise<Familia> {
  const { data, error } = await supabase
    .from("familia")
    .insert([familia])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarFamilia(
  id: string,
  familia: Partial<Omit<Familia, "id" | "created_at">>
): Promise<Familia> {
  const { data, error } = await supabase
    .from("familia")
    .update(familia)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerFamilia(id: string): Promise<void> {
  const { error } = await supabase.from("familia").delete().eq("id", id)
  if (error) throw error
}

export async function contarFamilias(): Promise<number> {
  const { count, error } = await supabase
    .from("familia")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

// =====================
// VÍNCULOS CRIANÇA-FAMÍLIA
// =====================

export interface VinculoComRelacoes extends CriancaFamilia {
  crianca?: { id: string; nome_completo: string }
  familia?: { id: string; nome_responsavel: string }
}

export async function listarVinculos(): Promise<VinculoComRelacoes[]> {
  const { data, error } = await supabase
    .from("crianca_familia")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      familia:familia_id(id, nome_responsavel)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarVinculosPorCrianca(
  criancaId: string
): Promise<VinculoComRelacoes[]> {
  const { data, error } = await supabase
    .from("crianca_familia")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      familia:familia_id(id, nome_responsavel)
    `)
    .eq("crianca_id", criancaId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarVinculosPorFamilia(
  familiaId: string
): Promise<VinculoComRelacoes[]> {
  const { data, error } = await supabase
    .from("crianca_familia")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      familia:familia_id(id, nome_responsavel)
    `)
    .eq("familia_id", familiaId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarVinculo(
  vinculo: Omit<CriancaFamilia, "id" | "created_at">
): Promise<CriancaFamilia> {
  const { data, error } = await supabase
    .from("crianca_familia")
    .insert([vinculo])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function criarVinculos(
  vinculos: Omit<CriancaFamilia, "id" | "created_at">[]
): Promise<CriancaFamilia[]> {
  if (vinculos.length === 0) return []
  const { data, error } = await supabase
    .from("crianca_familia")
    .insert(vinculos)
    .select()

  if (error) throw error
  return data || []
}

export async function removerVinculo(id: string): Promise<void> {
  const { error } = await supabase.from("crianca_familia").delete().eq("id", id)
  if (error) throw error
}

export async function contarVinculos(): Promise<number> {
  const { count, error } = await supabase
    .from("crianca_familia")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

// =====================
// VISITAS
// =====================

export interface VisitaComRelacoes extends FamiliaVisita {
  crianca?: { id: string; nome_completo: string }
  familia?: { id: string; nome_responsavel: string }
}

export async function listarVisitas(): Promise<VisitaComRelacoes[]> {
  const { data, error } = await supabase
    .from("familia_visita")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      familia:familia_id(id, nome_responsavel)
    `)
    .order("data_prevista", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarVisitasPorCrianca(
  criancaId: string
): Promise<VisitaComRelacoes[]> {
  const { data, error } = await supabase
    .from("familia_visita")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      familia:familia_id(id, nome_responsavel)
    `)
    .eq("crianca_id", criancaId)
    .order("data_prevista", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarVisitasAgendadas(): Promise<VisitaComRelacoes[]> {
  const { data, error } = await supabase
    .from("familia_visita")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      familia:familia_id(id, nome_responsavel)
    `)
    .is("data_realizada", null)
    .gte("data_prevista", new Date().toISOString())
    .order("data_prevista", { ascending: true })

  if (error) throw error
  return data || []
}

export async function criarVisita(
  visita: Omit<FamiliaVisita, "id" | "created_at">
): Promise<FamiliaVisita> {
  const { data, error } = await supabase
    .from("familia_visita")
    .insert([visita])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarVisita(
  id: string,
  visita: Partial<Omit<FamiliaVisita, "id" | "created_at">>
): Promise<FamiliaVisita> {
  const { data, error } = await supabase
    .from("familia_visita")
    .update(visita)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerVisita(id: string): Promise<void> {
  const { error } = await supabase.from("familia_visita").delete().eq("id", id)
  if (error) throw error
}

export async function contarVisitas(): Promise<number> {
  const { count, error } = await supabase
    .from("familia_visita")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

export async function contarVisitasAgendadas(): Promise<number> {
  const { count, error } = await supabase
    .from("familia_visita")
    .select("*", { count: "exact", head: true })
    .is("data_realizada", null)
    .gte("data_prevista", new Date().toISOString())

  if (error) throw error
  return count || 0
}
