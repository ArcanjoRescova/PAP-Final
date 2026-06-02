// ======================
// CRIANÇA
// ======================
export interface Crianca {
  id: string
  nome_completo: string
  data_nascimento: string
  sexo: string | null
  numero_processo: string | null
  nif: string | null
  data_entrada: string | null
  data_saida: string | null
  estado: string
  foto_url: string | null
  observacoes: string | null
  created_at: string
}

// ======================
// SAÚDE
// ======================
export interface Medico {
  id: string
  nome: string
  especialidade: string | null
  telefone: string | null
  email: string | null
  credenciais: string | null
  observacoes: string | null
  created_at: string
}

export interface SaudeRegisto {
  id: string
  crianca_id: string
  data_registo: string
  tipo_registo: string | null
  descricao: string | null
  peso_kg: number | null
  altura_cm: number | null
  pressao_arterial: string | null
  medico_id: string | null
  observacoes: string | null
  created_at: string
}

export interface SaudeAgendamento {
  id: string
  crianca_id: string
  tipo: string
  descricao: string | null
  data_hora: string
  local: string | null
  medico_id: string | null
  estado: string
  observacoes: string | null
  created_at: string
}

export interface CriancaMedicacao {
  id: string
  crianca_id: string
  nome_medicacao: string
  dosagem: string | null
  frequencia: string | null
  via_administracao: string | null
  data_inicio: string | null
  data_fim: string | null
  prescrito_por_medico_id: string | null
  observacoes: string | null
  created_at: string
}

// ======================
// ATIVIDADES
// ======================
export interface Atividade {
  id: string
  nome: string
  descricao: string | null
  created_at: string
}

export interface AtividadeParticipacao {
  id: string
  crianca_id: string
  atividade_id: string
  ano_letivo: string | null
  local: string | null
  data_inicio: string | null
  data_fim: string | null
  motivo: string | null
  professor_responsavel: string | null
  observacoes: string | null
  created_at: string
}

// ======================
// ESCOLA
// ======================
export interface Escola {
  id: string
  nome: string
  morada: string | null
  telefone: string | null
  email: string | null
  observacoes: string | null
  created_at: string
}

export interface EscolaMatricula {
  id: string
  crianca_id: string
  escola_id: string
  ano_letivo: string
  turma: string | null
  nivel: string | null
  horario_descricao: string | null
  data_inicio: string | null
  data_fim: string | null
  observacoes: string | null
  created_at: string
}

export interface EscolaAssiduidade {
  id: string
  crianca_id: string
  data: string
  periodo: string | null
  estado: string
  justificacao: string | null
  created_at: string
}

export interface EscolaAvaliacao {
  id: string
  crianca_id: string
  ano_letivo: string
  disciplina: string
  periodo: string | null
  nota: string | null
  observacoes: string | null
  created_at: string
}

// ======================
// FAMÍLIA
// ======================
export interface Familia {
  id: string
  nome_responsavel: string
  telefone: string | null
  email: string | null
  morada: string | null
  localizacao: string | null
  observacoes: string | null
  created_at: string
}

export interface CriancaFamilia {
  id: string
  crianca_id: string
  familia_id: string
  parentesco: string | null
  e_tutor_legal: boolean
  observacoes: string | null
  created_at: string
}

export interface FamiliaVisita {
  id: string
  crianca_id: string
  familia_id: string
  data_prevista: string | null
  data_realizada: string | null
  local: string | null
  tipo: string | null
  observacoes: string | null
  created_at: string
}
