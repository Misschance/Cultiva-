/**
 * Gera o catálogo de plantas a partir dos CSV validados em data/base-plantas/.
 * Saídas: packages/core/src/catalogo.gerado.ts (usado pelo app e pelo motor de agenda, inclusive offline)
 * e supabase/seed.sql (carga do banco).
 *
 *   pnpm catalogo:gerar      escreve os arquivos
 *   pnpm catalogo:verificar  falha se os arquivos estiverem desatualizados (usado no CI)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';

const RAIZ = join(import.meta.dirname, '..');
const DADOS = join(RAIZ, 'data/base-plantas');
const SAIDA_TS = join(RAIZ, 'packages/core/src/catalogo.gerado.ts');
const SAIDA_SQL = join(RAIZ, 'supabase/seed.sql');

type Linha = Record<string, string>;

function ler(arquivo: string): Linha[] {
  return parse(readFileSync(join(DADOS, arquivo), 'utf8'), { columns: true, skip_empty_lines: true, trim: true });
}

function inteiro(valor: string | undefined, campo: string): number | null {
  if (!valor) return null;
  if (!/^\d+$/.test(valor)) throw new Error(`${campo}: esperado número inteiro, veio "${valor}"`);
  return Number(valor);
}

function numero(valor: string | undefined, campo: string): number | null {
  if (!valor) return null;
  const n = Number(valor.replace(',', '.'));
  if (!Number.isFinite(n)) throw new Error(`${campo}: esperado número, veio "${valor}"`);
  return n;
}

/** "2-3" vira { min: 2, max: 3 }; "1" vira { min: 1, max: 1 }. */
function faixa(valor: string, campo: string): { min: number; max: number } {
  const m = /^(\d+)(?:-(\d+))?$/.exec(valor);
  if (!m) throw new Error(`${campo}: faixa inválida "${valor}"`);
  const min = Number(m[1]);
  const max = m[2] ? Number(m[2]) : min;
  if (max < min) throw new Error(`${campo}: máximo menor que mínimo em "${valor}"`);
  return { min, max };
}

function faixaOpcional(min: string | undefined, max: string | undefined, campo: string) {
  const a = inteiro(min, `${campo}_min`);
  const b = inteiro(max, `${campo}_max`) ?? a;
  if (a === null || b === null) return null;
  return { min: a, max: b };
}

function confianca(valor: string | undefined): 'A' | 'B' | 'C' | null {
  const letra = valor?.trim().charAt(0);
  return letra === 'A' || letra === 'B' || letra === 'C' ? letra : null;
}

/** Sinal de ponto de colheita (RF-4.4). Vazio na base vira null; com texto, exige fonte e confiança. */
function pontoColheita(p: Record<string, string | undefined>, id: string) {
  const t = p.ponto_colheita?.trim();
  if (!t) return null;
  const nivel = confianca(p.ponto_colheita_confianca);
  const fonte = p.ponto_colheita_fonte?.trim();
  if (!nivel || !fonte) throw new Error(`${id}.ponto_colheita sem fonte ou confiança`);
  return { texto: t, fonte, confianca: nivel };
}

function texto(valor: string | undefined): string {
  return valor ?? '';
}

// --- leitura e validação -----------------------------------------------------

const plantas = ler('plantas.csv');
const fases = ler('fases.csv');
const epocas = ler('epocas_por_regiao.csv');
const referencias = ler('referencias.csv');

const ids = new Set<string>();
for (const p of plantas) {
  if (!/^[a-z0-9_]{1,40}$/.test(p.id ?? '')) throw new Error(`id de planta inválido: "${p.id}"`);
  if (ids.has(p.id!)) throw new Error(`id de planta repetido: ${p.id}`);
  ids.add(p.id!);
}
for (const f of [...fases, ...epocas]) {
  if (!ids.has(f.planta_id ?? '')) throw new Error(`planta_id sem planta cadastrada: "${f.planta_id}"`);
}

const catalogo = plantas.map((p) => {
  const id = p.id!;
  const fasesDaPlanta = fases
    .filter((f) => f.planta_id === id)
    .map((f) => ({
      ordem: inteiro(f.ordem, `${id}.ordem`)!,
      nome: texto(f.fase),
      diaInicio: inteiro(f.dia_inicio, `${id}.dia_inicio`),
      diaFim: inteiro(f.dia_fim, `${id}.dia_fim`),
      rega: texto(f.rega),
      adubacao: texto(f.adubacao),
      intervencoes: texto(f.intervencoes),
      fonte: texto(f.fonte),
      confianca: confianca(f.confianca) ?? 'C',
    }))
    .sort((a, b) => a.ordem - b.ordem);
  if (fasesDaPlanta.length === 0) throw new Error(`planta sem fases: ${id}`);
  let inicioAnterior = -1;
  for (const f of fasesDaPlanta) {
    if (f.diaInicio !== null && f.diaFim !== null && f.diaFim < f.diaInicio) {
      throw new Error(`${id}.${f.nome}: dia_fim (${f.diaFim}) antes de dia_inicio (${f.diaInicio})`);
    }
    if (f.diaInicio !== null) {
      if (f.diaInicio < inicioAnterior) throw new Error(`${id}.${f.nome}: fase começa antes da fase anterior`);
      inicioAnterior = f.diaInicio;
    }
  }

  return {
    id,
    nomePopular: texto(p.nome_popular),
    nomeCientifico: texto(p.nome_cientifico),
    grupo: texto(p.grupo),
    propagacao: texto(p.propagacao),
    germinacaoDias: faixaOpcional(p.germinacao_dias_min, p.germinacao_dias_max, `${id}.germinacao_dias`),
    colheitaInicioDias: faixaOpcional(p.colheita_inicio_dias_min, p.colheita_inicio_dias_max, `${id}.colheita_inicio_dias`),
    regaAdultaIntervaloDias: faixa(texto(p.rega_adulta_intervalo_dias), `${id}.rega_adulta_intervalo_dias`),
    luzHorasMin: numero(p.luz_horas_min, `${id}.luz_horas_min`),
    localIdeal: texto(p.local_ideal),
    dicaAcessivel: texto(p.dica_acessivel),
    pontoColheita: pontoColheita(p, id),
    fases: fasesDaPlanta,
  };
});

// --- TypeScript --------------------------------------------------------------

const ts = `// Arquivo gerado por scripts/gerar-catalogo.ts a partir de data/base-plantas/. Não edite à mão.
import type { Especie } from './tipos';

export const CATALOGO: readonly Especie[] = ${JSON.stringify(catalogo, null, 2)};

export const REFERENCIAS: readonly { id: string; citacao: string; url: string }[] = ${JSON.stringify(
  referencias.map((r) => ({ id: texto(r.ref_id), citacao: texto(r.citacao), url: texto(r.url) })),
  null,
  2,
)};
`;

// --- SQL ---------------------------------------------------------------------

function sql(valor: string | number | boolean | null | undefined): string {
  if (valor === null || valor === undefined || valor === '') return 'null';
  if (typeof valor === 'number') return String(valor);
  if (typeof valor === 'boolean') return valor ? 'true' : 'false';
  return `'${valor.replaceAll("'", "''")}'`;
}

// Nunca truncar especies: plantios de usuários apontam para ela. Espécies e referências são atualizadas
// no lugar (upsert); fases e épocas não têm dados de usuário apontando para elas e são recriadas.
const linhasSql: string[] = [
  '-- Arquivo gerado por scripts/gerar-catalogo.ts a partir de data/base-plantas/. Não edite à mão.',
  '-- Seguro para rodar de novo: não apaga plantios de usuários.',
  'begin;',
  'delete from public.epocas_plantio;',
  'delete from public.fases;',
];

function upsert(tabela: string, valores: Record<string, string | number | boolean | null | undefined>): string {
  const colunas = Object.keys(valores);
  const atualizar = colunas.filter((c) => c !== 'id').map((c) => `${c} = excluded.${c}`).join(', ');
  return `insert into public.${tabela} (${colunas.join(', ')}) values (${Object.values(valores).map((v) => sql(v)).join(', ')}) on conflict (id) do update set ${atualizar};`;
}

for (const r of referencias) {
  linhasSql.push(upsert('referencias', { id: r.ref_id, citacao: r.citacao, url: r.url, como_foi_lida: r.como_foi_lida }));
}

for (const p of plantas) {
  const id = p.id!;
  const rega = faixa(texto(p.rega_adulta_intervalo_dias), id);
  const germ = faixaOpcional(p.germinacao_dias_min, p.germinacao_dias_max, id);
  const colh = faixaOpcional(p.colheita_inicio_dias_min, p.colheita_inicio_dias_max, id);
  const valores = {
    id,
    nome_popular: p.nome_popular,
    nome_cientifico: p.nome_cientifico,
    grupo: p.grupo,
    parte_colhida: p.parte_colhida,
    propagacao: p.propagacao,
    profundidade_semeadura_cm: p.profundidade_semeadura_cm,
    germinacao_dias_min: germ?.min ?? null,
    germinacao_dias_max: germ?.max ?? null,
    germinacao_confianca: confianca(p.germinacao_confianca),
    transplante_dias_apos_semeadura: p.transplante_dias_apos_semeadura,
    espacamento_cm: p.espacamento_cm,
    luz_horas_min: numero(p.luz_horas_min, id),
    local_ideal: p.local_ideal,
    luz_confianca: confianca(p.luz_confianca),
    agua_como_regar: p.agua_como_regar,
    agua_confianca: confianca(p.agua_confianca),
    rega_intervalo_dias_min: rega.min,
    rega_intervalo_dias_max: rega.max,
    solo: p.solo,
    adubo_plantio: p.adubo_plantio,
    adubo_cobertura: p.adubo_cobertura,
    adubo_confianca: confianca(p.adubo_confianca),
    colheita_inicio_dias_min: colh?.min ?? null,
    colheita_inicio_dias_max: colh?.max ?? null,
    colheita_fonte: p.colheita_fonte,
    colheita_confianca: confianca(p.colheita_confianca),
    clima_temperatura: p.clima_temperatura,
    dica_acessivel: p.dica_acessivel,
    pendencias: p.pendencias,
  };
  linhasSql.push(upsert('especies', valores));
}

for (const f of fases) {
  const id = f.planta_id!;
  const valores = [
    id,
    inteiro(f.ordem, id),
    f.fase,
    inteiro(f.dia_inicio, id),
    inteiro(f.dia_fim, id),
    f.rega,
    f.adubacao,
    f.intervencoes,
    f.fonte,
    confianca(f.confianca),
  ];
  linhasSql.push(
    `insert into public.fases (especie_id, ordem, nome, dia_inicio, dia_fim, rega, adubacao, intervencoes, fonte, confianca) values (${valores.map((v) => sql(v)).join(', ')});`,
  );
}

for (const e of epocas) {
  const id = e.planta_id!;
  const recomendado = e.recomendado === 'sim' ? true : e.recomendado === 'não' ? false : null;
  const valores = [
    id,
    e.variedade,
    e.regiao,
    inteiro(e.mes_inicio, id),
    inteiro(e.mes_fim, id),
    recomendado,
    e.texto,
    e.fonte,
    confianca(e.confianca),
    e.observacao,
  ];
  linhasSql.push(
    `insert into public.epocas_plantio (especie_id, variedade, regiao, mes_inicio, mes_fim, recomendado, texto, fonte, confianca, observacao) values (${valores.map((v) => sql(v)).join(', ')});`,
  );
}
linhasSql.push('commit;', '');
const seed = linhasSql.join('\n');

// --- escrita ou verificação ----------------------------------------------------

if (process.argv.includes('--verificar')) {
  const desatualizados = [
    [SAIDA_TS, ts],
    [SAIDA_SQL, seed],
  ].filter(([arquivo, conteudo]) => {
    try {
      return readFileSync(arquivo!, 'utf8') !== conteudo;
    } catch {
      return true;
    }
  });
  if (desatualizados.length > 0) {
    console.error('Catálogo desatualizado. Rode "pnpm catalogo:gerar" e faça commit:');
    for (const [arquivo] of desatualizados) console.error(`  ${arquivo}`);
    process.exit(1);
  }
  console.log(`Catálogo em dia: ${catalogo.length} espécies.`);
} else {
  writeFileSync(SAIDA_TS, ts);
  writeFileSync(SAIDA_SQL, seed);
  console.log(`Catálogo gerado: ${catalogo.length} espécies, ${fases.length} fases, ${epocas.length} épocas.`);
}
