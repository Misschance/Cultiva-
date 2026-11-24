# Segurança

## Como relatar uma vulnerabilidade

Não abra issue pública. Use "Report a vulnerability" na aba Security deste repositório
(GitHub Private Vulnerability Reporting). Respondemos em até 7 dias.

## Regras para quem escreve código aqui

Os requisitos completos (SEG-1 a SEG-23) estão na especificação do produto. Os que mais aparecem no dia a dia:

- **Dados de usuário só com RLS.** Toda tabela nova com dados de usuário tem `usuario_id`, RLS ligado,
  política "só o dono" e um caso em `supabase/tests/10_rls.sql` provando que outro usuário não lê nem altera.
- **Catálogo é somente leitura** para `anon` e `authenticated`. Alterações entram por migração ou pelo `seed.sql`
  gerado a partir de `data/base-plantas/`.
- **Nunca** coloque a chave `service_role`, senhas ou tokens no repositório ou em variáveis `EXPO_PUBLIC_*`
  (essas vão para dentro do app e são públicas). O CI roda gitleaks em todo push.
- **Validar toda entrada externa**: formulários com zod no app, restrições `check` no banco, respostas de APIs
  externas (ex.: Open-Meteo) com zod antes de usar.
- **Sessão no celular** só em `expo-secure-store` (Keychain/Keystore). Nunca em AsyncStorage.
- **Erros de login** com mensagem genérica, sem revelar se o e-mail existe.
- **Localização** só com consentimento, arredondada a ~1 km, e enviada a terceiros só arredondada.
- **Logs** sem dados pessoais (e-mail, coordenadas, texto do diário).
- **Funções `security definer`** sempre com `set search_path = ''` e `execute` revogado de `public`, `anon` e `authenticated`.
