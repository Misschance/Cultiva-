# Cultivaê: instruções para quem programa aqui

- Idioma: código de domínio, comentários, commits e textos do app em português do Brasil.
- Monorepo pnpm (`node-linker=hoisted` por causa do React Native). Use `pnpm`, nunca npm ou yarn.
  Para dependências do app, escolha versões compatíveis com o SDK do Expo (`node_modules/expo/bundledNativeModules.json`).
- Regras de negócio ficam em `packages/core` (TypeScript puro, sem React, sem I/O além de `fetch` injetável),
  sempre com teste em `packages/core/test`. O app só chama o core.
- Datas de calendário são strings `AAAA-MM-DD`; use `packages/core/src/datas.ts`, nunca `Date` com fuso.
- Não edite `catalogo.gerado.ts` nem `supabase/seed.sql` à mão: mude `data/base-plantas/` e rode `pnpm catalogo:gerar`.
- Segurança é requisito de aceite, não etapa final. Siga [SECURITY.md](SECURITY.md); toda tabela nova com dados
  de usuário precisa de RLS e de teste em `supabase/tests/10_rls.sql`.
- Antes de abrir PR: `pnpm typecheck`, `pnpm test`, `pnpm catalogo:verificar` e, se mexeu no banco, `pnpm db:testar`.
- O dono do produto (Murilo) valida os dados de cultivo. Não invente valores agronômicos: se faltar dado, deixe vazio e avise.
