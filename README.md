# Lar Santo António - Sistema de Gestão

Sistema de gestão interno para o Lar de Santo António da Cidade de Santarém.

## 🚀 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **Shadcn UI** - Componentes UI
- **Supabase** - Backend e Base de Dados

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase configurada
- Base de dados criada (ver `bd.txt`)

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite o ficheiro `.env.local` e adicione as credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

3. Execute o script SQL do arquivo `bd.txt` no Supabase para criar as tabelas.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

```
src/
├── app/              # Páginas Next.js (App Router)
├── components/       # Componentes React
│   ├── layout/      # Componentes de layout
│   └── ui/          # Componentes UI do Shadcn
├── lib/             # Utilitários e configurações
├── services/        # Serviços de API
└── types/           # Tipos TypeScript
```

## 🎯 Funcionalidades

- ✅ Dashboard com estatísticas
- ✅ Gestão de Crianças (listar, criar, editar)
- 🔄 Saúde (em desenvolvimento)
- 🔄 Medicação (em desenvolvimento)
- 🔄 Atividades (em desenvolvimento)
- 🔄 Escolas (em desenvolvimento)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## 📄 Licença

Este projeto é privado e de uso interno do Lar Santo António.
