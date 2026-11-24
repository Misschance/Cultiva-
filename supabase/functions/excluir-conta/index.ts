// Edge Function "excluir-conta": apaga a conta de quem está logado (LGPD, art. 18, VI).
//
// - Só age sobre o próprio usuário: o id vem do token validado, nunca do corpo da requisição.
// - Pede a confirmação "EXCLUIR" no corpo, para um clique acidental não apagar nada.
// - Apaga as fotos do diário no Storage e depois o usuário no Auth. Perfil, locais, plantios,
//   registros, diário e colheitas saem juntos pelo ON DELETE CASCADE das tabelas.
// - A chave de serviço só existe aqui dentro, como variável que o próprio Supabase injeta.
//   Ela nunca vai para o app nem para o repositório (SECURITY.md).
import { createClient } from 'npm:@supabase/supabase-js@2.119.2';

const ORIGENS = new Set(['https://misschance.github.io', 'http://localhost:8081']);
const BUCKET = 'fotos';
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

function cabecalhos(req: Request): HeadersInit {
  const origem = req.headers.get('Origin') ?? '';
  return {
    ...(ORIGENS.has(origem) ? { 'Access-Control-Allow-Origin': origem, Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  };
}

function resposta(req: Request, status: number, corpo?: Record<string, string>): Response {
  return new Response(corpo ? JSON.stringify(corpo) : null, { status, headers: cabecalhos(req) });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return resposta(req, 204);
  if (req.method !== 'POST') return resposta(req, 405, { erro: 'Método não permitido.' });

  const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) return resposta(req, 401, { erro: 'Entre na sua conta de novo.' });

  let confirmacao: unknown;
  try {
    confirmacao = (await req.json())?.confirmacao;
  } catch {
    confirmacao = null;
  }
  if (confirmacao !== 'EXCLUIR') return resposta(req, 400, { erro: 'Confirmação ausente.' });

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: quem, error: erroToken } = await admin.auth.getUser(token);
  const id = quem?.user?.id;
  if (erroToken || !id || !UUID.test(id)) return resposta(req, 401, { erro: 'Entre na sua conta de novo.' });

  // Fotos ficam em fotos/<id do usuário>/<arquivo>. Apaga em lotes até a pasta esvaziar.
  for (let volta = 0; volta < 100; volta++) {
    const { data: arquivos, error } = await admin.storage.from(BUCKET).list(id, { limit: 1000 });
    if (error) return resposta(req, 500, { erro: 'Não foi possível apagar as fotos. Tente de novo.' });
    if (!arquivos || arquivos.length === 0) break;
    const { error: erroRemover } = await admin.storage.from(BUCKET).remove(arquivos.map((a) => `${id}/${a.name}`));
    if (erroRemover) return resposta(req, 500, { erro: 'Não foi possível apagar as fotos. Tente de novo.' });
  }

  const { error: erroExcluir } = await admin.auth.admin.deleteUser(id);
  // A mensagem do Auth não volta para o app: pode conter dados pessoais (SEG-17).
  if (erroExcluir) return resposta(req, 500, { erro: 'Não foi possível excluir a conta. Tente de novo.' });

  return resposta(req, 200, { ok: 'Conta excluída.' });
});
