import { supabase } from "@/lib/supabase"
import type { CriancaMedicacao } from "@/types/database"

export interface MedicacaoComRelacoes extends CriancaMedicacao {
  crianca?: { id: string; nome_completo: string }
  medico?: { id: string; nome: string } | null
}

export async function listarMedicacoes(): Promise<MedicacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("crianca_medicacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:prescrito_por_medico_id(id, nome)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarMedicacoesPorCrianca(
  criancaId: string
): Promise<MedicacaoComRelacoes[]> {
  const { data, error } = await supabase
    .from("crianca_medicacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:prescrito_por_medico_id(id, nome)
    `)
    .eq("crianca_id", criancaId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarMedicacoesAtivas(): Promise<MedicacaoComRelacoes[]> {
  const hoje = new Date().toISOString().split("T")[0]
  const { data, error } = await supabase
    .from("crianca_medicacao")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:prescrito_por_medico_id(id, nome)
    `)
    .or(`data_fim.is.null,data_fim.gte.${hoje}`)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarMedicacao(
  medicacao: Omit<CriancaMedicacao, "id" | "created_at">
): Promise<CriancaMedicacao> {
  const { data, error } = await supabase
    .from("crianca_medicacao")
    .insert([medicacao])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarMedicacao(
  id: string,
  medicacao: Partial<Omit<CriancaMedicacao, "id" | "created_at">>
): Promise<CriancaMedicacao> {
  const { data, error } = await supabase
    .from("crianca_medicacao")
    .update(medicacao)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerMedicacao(id: string): Promise<void> {
  const { error } = await supabase.from("crianca_medicacao").delete().eq("id", id)
  if (error) throw error
}

export async function contarMedicacoes(): Promise<number> {
  const { count, error } = await supabase
    .from("crianca_medicacao")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

export async function contarMedicacoesAtivas(): Promise<number> {
  const hoje = new Date().toISOString().split("T")[0]
  const { count, error } = await supabase
    .from("crianca_medicacao")
    .select("*", { count: "exact", head: true })
    .or(`data_fim.is.null,data_fim.gte.${hoje}`)

  if (error) throw error
  return count || 0
}
