import { supabase } from "@/lib/supabase"
import type { Medico, SaudeRegisto, SaudeAgendamento } from "@/types/database"

// =====================
// MÉDICOS
// =====================

export async function listarMedicos(): Promise<Medico[]> {
  const { data, error } = await supabase
    .from("medico")
    .select("*")
    .order("nome", { ascending: true })

  if (error) throw error
  return data || []
}

export async function obterMedico(id: string): Promise<Medico | null> {
  const { data, error } = await supabase
    .from("medico")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function criarMedico(
  medico: Omit<Medico, "id" | "created_at">
): Promise<Medico> {
  const { data, error } = await supabase
    .from("medico")
    .insert([medico])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarMedico(
  id: string,
  medico: Partial<Omit<Medico, "id" | "created_at">>
): Promise<Medico> {
  const { data, error } = await supabase
    .from("medico")
    .update(medico)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerMedico(id: string): Promise<void> {
  const { error } = await supabase.from("medico").delete().eq("id", id)
  if (error) throw error
}

// =====================
// REGISTOS DE SAÚDE
// =====================

export interface SaudeRegistoComRelacoes extends SaudeRegisto {
  crianca?: { id: string; nome_completo: string }
  medico?: { id: string; nome: string } | null
}

export async function listarRegistosSaude(): Promise<SaudeRegistoComRelacoes[]> {
  const { data, error } = await supabase
    .from("saude_registo")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:medico_id(id, nome)
    `)
    .order("data_registo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function listarRegistosSaudePorCrianca(
  criancaId: string
): Promise<SaudeRegistoComRelacoes[]> {
  const { data, error } = await supabase
    .from("saude_registo")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:medico_id(id, nome)
    `)
    .eq("crianca_id", criancaId)
    .order("data_registo", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarRegistoSaude(
  registo: Omit<SaudeRegisto, "id" | "created_at">
): Promise<SaudeRegisto> {
  const { data, error } = await supabase
    .from("saude_registo")
    .insert([registo])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarRegistoSaude(
  id: string,
  registo: Partial<Omit<SaudeRegisto, "id" | "created_at">>
): Promise<SaudeRegisto> {
  const { data, error } = await supabase
    .from("saude_registo")
    .update(registo)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerRegistoSaude(id: string): Promise<void> {
  const { error } = await supabase.from("saude_registo").delete().eq("id", id)
  if (error) throw error
}

// =====================
// AGENDAMENTOS DE SAÚDE
// =====================

export interface SaudeAgendamentoComRelacoes extends SaudeAgendamento {
  crianca?: { id: string; nome_completo: string }
  medico?: { id: string; nome: string } | null
}

export async function listarAgendamentosSaude(): Promise<SaudeAgendamentoComRelacoes[]> {
  const { data, error } = await supabase
    .from("saude_agendamento")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:medico_id(id, nome)
    `)
    .order("data_hora", { ascending: true })

  if (error) throw error
  return data || []
}

export async function listarAgendamentosFuturos(): Promise<SaudeAgendamentoComRelacoes[]> {
  const { data, error } = await supabase
    .from("saude_agendamento")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:medico_id(id, nome)
    `)
    .gte("data_hora", new Date().toISOString())
    .eq("estado", "Agendado")
    .order("data_hora", { ascending: true })

  if (error) throw error
  return data || []
}

export async function listarAgendamentosPorCrianca(
  criancaId: string
): Promise<SaudeAgendamentoComRelacoes[]> {
  const { data, error } = await supabase
    .from("saude_agendamento")
    .select(`
      *,
      crianca:crianca_id(id, nome_completo),
      medico:medico_id(id, nome)
    `)
    .eq("crianca_id", criancaId)
    .order("data_hora", { ascending: false })

  if (error) throw error
  return data || []
}

export async function criarAgendamentoSaude(
  agendamento: Omit<SaudeAgendamento, "id" | "created_at">
): Promise<SaudeAgendamento> {
  const { data, error } = await supabase
    .from("saude_agendamento")
    .insert([agendamento])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarAgendamentoSaude(
  id: string,
  agendamento: Partial<Omit<SaudeAgendamento, "id" | "created_at">>
): Promise<SaudeAgendamento> {
  const { data, error } = await supabase
    .from("saude_agendamento")
    .update(agendamento)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removerAgendamentoSaude(id: string): Promise<void> {
  const { error } = await supabase.from("saude_agendamento").delete().eq("id", id)
  if (error) throw error
}

// =====================
// ESTATÍSTICAS
// =====================

export async function contarRegistosSaude(): Promise<number> {
  const { count, error } = await supabase
    .from("saude_registo")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}

export async function contarAgendamentosPendentes(): Promise<number> {
  const { count, error } = await supabase
    .from("saude_agendamento")
    .select("*", { count: "exact", head: true })
    .gte("data_hora", new Date().toISOString())
    .eq("estado", "Agendado")

  if (error) throw error
  return count || 0
}

export async function contarMedicos(): Promise<number> {
  const { count, error } = await supabase
    .from("medico")
    .select("*", { count: "exact", head: true })

  if (error) throw error
  return count || 0
}
