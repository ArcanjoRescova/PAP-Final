-- ============================================
-- SCHEMA COMPLETO - LAR SANTO ANTÓNIO
-- Executa este script no SQL Editor do Supabase
-- ============================================

-- Ativar extensão para UUID aleatório
create extension if not exists "pgcrypto";

-- ======================
-- TABELA PRINCIPAL: CRIANÇA
-- ======================
create table if not exists crianca (
    id uuid primary key default gen_random_uuid(),
    nome_completo text not null,
    data_nascimento date not null,
    sexo text,
    numero_processo text,
    nif text,
    data_entrada date,
    data_saida date,
    estado text default 'Ativa',
    foto_url text,
    observacoes text,
    created_at timestamptz default now()
);

-- Adicionar coluna foto_url se a tabela já existir
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'crianca' and column_name = 'foto_url') then
        alter table crianca add column foto_url text;
    end if;
end $$;

-- ======================
-- SAÚDE
-- ======================
create table if not exists medico (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    especialidade text,
    telefone text,
    email text,
    credenciais text,
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists saude_registo (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    data_registo timestamptz not null default now(),
    tipo_registo text,
    descricao text,
    peso_kg numeric(5,2),
    altura_cm numeric(5,2),
    pressao_arterial text,
    medico_id uuid references medico(id),
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists saude_agendamento (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    tipo text not null,
    descricao text,
    data_hora timestamptz not null,
    local text,
    medico_id uuid references medico(id),
    estado text default 'Agendado',
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists crianca_medicacao (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    nome_medicacao text not null,
    dosagem text,
    frequencia text,
    via_administracao text,
    data_inicio date,
    data_fim date,
    prescrito_por_medico_id uuid references medico(id),
    observacoes text,
    created_at timestamptz default now()
);

-- ======================
-- ATIVIDADES EXTRACURRICULARES
-- ======================
create table if not exists atividade (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    descricao text,
    created_at timestamptz default now()
);

create table if not exists atividade_participacao (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    atividade_id uuid not null references atividade(id) on delete cascade,
    ano_letivo text,
    local text,
    data_inicio date,
    data_fim date,
    motivo text,
    professor_responsavel text,
    observacoes text,
    created_at timestamptz default now()
);

-- ======================
-- ESCOLA
-- ======================
create table if not exists escola (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    morada text,
    telefone text,
    email text,
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists escola_matricula (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    escola_id uuid not null references escola(id) on delete cascade,
    ano_letivo text not null,
    turma text,
    nivel text,
    horario_descricao text,
    data_inicio date,
    data_fim date,
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists escola_assiduidade (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    data date not null,
    periodo text,
    estado text not null,
    justificacao text,
    created_at timestamptz default now()
);

create table if not exists escola_avaliacao (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    ano_letivo text not null,
    disciplina text not null,
    periodo text,
    nota text,
    observacoes text,
    created_at timestamptz default now()
);

-- ======================
-- FAMÍLIA
-- ======================
create table if not exists familia (
    id uuid primary key default gen_random_uuid(),
    nome_responsavel text not null,
    telefone text,
    email text,
    morada text,
    localizacao text,
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists crianca_familia (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    familia_id uuid not null references familia(id) on delete cascade,
    parentesco text,
    e_tutor_legal boolean default false,
    observacoes text,
    created_at timestamptz default now()
);

create table if not exists familia_visita (
    id uuid primary key default gen_random_uuid(),
    crianca_id uuid not null references crianca(id) on delete cascade,
    familia_id uuid not null references familia(id) on delete cascade,
    data_prevista timestamptz,
    data_realizada timestamptz,
    local text,
    tipo text,
    observacoes text,
    created_at timestamptz default now()
);

-- ============================================
-- ATIVAR RLS (Row Level Security)
-- ============================================

alter table crianca enable row level security;
alter table medico enable row level security;
alter table saude_registo enable row level security;
alter table saude_agendamento enable row level security;
alter table crianca_medicacao enable row level security;
alter table atividade enable row level security;
alter table atividade_participacao enable row level security;
alter table escola enable row level security;
alter table escola_matricula enable row level security;
alter table escola_assiduidade enable row level security;
alter table escola_avaliacao enable row level security;
alter table familia enable row level security;
alter table crianca_familia enable row level security;
alter table familia_visita enable row level security;

-- ============================================
-- POLÍTICAS DE ACESSO PÚBLICO
-- Permite leitura e escrita para todos
-- ============================================

-- Remover políticas existentes (se existirem)
drop policy if exists "Permitir tudo em crianca" on crianca;
drop policy if exists "Permitir tudo em medico" on medico;
drop policy if exists "Permitir tudo em saude_registo" on saude_registo;
drop policy if exists "Permitir tudo em saude_agendamento" on saude_agendamento;
drop policy if exists "Permitir tudo em crianca_medicacao" on crianca_medicacao;
drop policy if exists "Permitir tudo em atividade" on atividade;
drop policy if exists "Permitir tudo em atividade_participacao" on atividade_participacao;
drop policy if exists "Permitir tudo em escola" on escola;
drop policy if exists "Permitir tudo em escola_matricula" on escola_matricula;
drop policy if exists "Permitir tudo em escola_assiduidade" on escola_assiduidade;
drop policy if exists "Permitir tudo em escola_avaliacao" on escola_avaliacao;
drop policy if exists "Permitir tudo em familia" on familia;
drop policy if exists "Permitir tudo em crianca_familia" on crianca_familia;
drop policy if exists "Permitir tudo em familia_visita" on familia_visita;

-- Criar políticas
create policy "Permitir tudo em crianca" on crianca for all using (true) with check (true);
create policy "Permitir tudo em medico" on medico for all using (true) with check (true);
create policy "Permitir tudo em saude_registo" on saude_registo for all using (true) with check (true);
create policy "Permitir tudo em saude_agendamento" on saude_agendamento for all using (true) with check (true);
create policy "Permitir tudo em crianca_medicacao" on crianca_medicacao for all using (true) with check (true);
create policy "Permitir tudo em atividade" on atividade for all using (true) with check (true);
create policy "Permitir tudo em atividade_participacao" on atividade_participacao for all using (true) with check (true);
create policy "Permitir tudo em escola" on escola for all using (true) with check (true);
create policy "Permitir tudo em escola_matricula" on escola_matricula for all using (true) with check (true);
create policy "Permitir tudo em escola_assiduidade" on escola_assiduidade for all using (true) with check (true);
create policy "Permitir tudo em escola_avaliacao" on escola_avaliacao for all using (true) with check (true);
create policy "Permitir tudo em familia" on familia for all using (true) with check (true);
create policy "Permitir tudo em crianca_familia" on crianca_familia for all using (true) with check (true);
create policy "Permitir tudo em familia_visita" on familia_visita for all using (true) with check (true);

-- ============================================
-- STORAGE - FOTOS DAS CRIANÇAS
-- ============================================

-- Criar bucket para fotos (executar no SQL Editor)
insert into storage.buckets (id, name, public)
values ('fotos-criancas', 'fotos-criancas', true)
on conflict (id) do nothing;

-- Política para permitir upload público
create policy "Permitir upload de fotos" on storage.objects
for insert with check (bucket_id = 'fotos-criancas');

-- Política para permitir leitura pública
create policy "Permitir leitura de fotos" on storage.objects
for select using (bucket_id = 'fotos-criancas');

-- Política para permitir atualização
create policy "Permitir atualizar fotos" on storage.objects
for update using (bucket_id = 'fotos-criancas');

-- Política para permitir eliminar
create policy "Permitir eliminar fotos" on storage.objects
for delete using (bucket_id = 'fotos-criancas');

-- ============================================
-- AUTENTICAÇÃO - CRIAR UTILIZADOR ADMIN
-- ============================================
-- 
-- Para criar um utilizador administrador, vai ao Supabase Dashboard:
-- 1. Authentication > Users > Add User
-- 2. Email: admin@larsantoantonio.pt
-- 3. Password: (escolhe uma password segura)
-- 4. Clica "Create User"
--
-- Ou usa a função SQL (requer service_role key):
-- SELECT auth.create_user(
--   'admin@larsantoantonio.pt',
--   'password123',
--   '{"role": "admin"}'
-- );

-- ============================================
-- FIM DO SCRIPT
-- ============================================
