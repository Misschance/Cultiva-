# Cultivaê

Guia de cultivo para hortas caseiras e familiares, na web e no Android. O app diz, planta por planta,
o que fazer hoje: regar, adubar, conferir se germinou ou colher. Gratuito e em português.

Especificação do produto: https://claude.ai/artifact/QeXQdMnn7QFCcEjd4dCNG3

## O que tem aqui

| Pasta | Conteúdo |
| --- | --- |
| `apps/app` | App Expo (React Native) que gera o Android e a versão web, com login pelo Supabase |
| `packages/core` | Motor de agenda em TypeScript puro: fases, rega com ajuste por vaso e clima, germinação e colheita. Roda no app (inclusive offline) e no servidor |
| `data/base-plantas` | Base de plantas validada (CSV), com fonte e nível de confiança de cada dado |
| `scripts/gerar-catalogo.ts` | Gera `packages/core/src/catalogo.gerado.ts` e `supabase/seed.sql` a partir dos CSV |
| `supabase/migrations` | Tabelas, restrições e Row Level Security |
| `supabase/tests` | Testes de segurança do banco (cada usuário só vê os próprios dados) |

## Como rodar

Requisitos: Node 22 e pnpm 10 (`corepack enable`).

```bash
pnpm install
pnpm test              # testes do motor de agenda
pnpm typecheck         # tipos de todo o projeto
pnpm catalogo:gerar    # depois de mudar algo em data/base-plantas
```

App:

```bash
cp apps/app/.env.example apps/app/.env   # preencha com URL e chave anon do Supabase
pnpm --filter @cultivae/app web          # navegador
pnpm --filter @cultivae/app android      # Android (Expo Go ou emulador)
```

Banco (precisa de um Postgres 16 descartável):

```bash
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres pnpm db:testar
```

Para um projeto Supabase de verdade, aplique `supabase/migrations/*.sql` e depois `supabase/seed.sql`
(CLI do Supabase: `supabase db push` e `supabase db reset` em ambiente local).

## Atualizar a base de plantas

1. Copie os CSV novos para `data/base-plantas/`.
2. Rode `pnpm catalogo:gerar`. O gerador recusa dados inconsistentes (fase que termina antes de começar,
   fases fora de ordem, faixas invertidas).
3. Faça commit dos CSV e dos dois arquivos gerados. O CI confere se estão em dia.

A carga (`seed.sql`) pode ser rodada de novo em produção: atualiza espécies no lugar e não apaga plantios de usuários.

## Segurança

Veja [SECURITY.md](SECURITY.md).
