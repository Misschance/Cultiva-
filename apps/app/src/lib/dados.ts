import type { ConfirmacaoFase, DataISO, Local, MaterialVaso, Origem, Plantio, RegistroAcao, TipoAcao, TipoLocal } from '@cultivae/core';
import { z } from 'zod';
import { supabase } from './supabase';

/** Acesso aos dados do usuário. O RLS do banco garante que cada um só vê o que é seu. */

export interface Perfil {
  id: string;
  nome: string | null;
  cidade: string | null;
  lat: number | null;
  lon: number | null;
  fuso: string;
  horarioLembrete: string;
}

export interface LocalComNome extends Local {
  nome: string;
}

export interface PlantioCompleto extends Plantio {
  apelido: string | null;
  quantidade: number;
  status: 'ativo' | 'colhido' | 'perdido' | 'arquivado';
}

export interface DadosHorta {
  perfil: Perfil;
  locais: LocalComNome[];
  plantios: PlantioCompleto[];
  registros: RegistroAcao[];
}

function falhar(contexto: string, _erro?: unknown): never {
  // A mensagem do banco não vai para a tela nem para logs: pode conter dados pessoais (SEG-17).
  throw new Error(contexto);
}

export async function carregarHorta(usuarioId: string): Promise<DadosHorta> {
  const [perfil, locais, plantios, confirmacoes, registros] = await Promise.all([
    supabase.from('perfis').select('id, nome, cidade, lat, lon, fuso, horario_lembrete').maybeSingle(),
    supabase.from('locais').select('id, nome, tipo, interno, horas_sol, volume_litros, material').order('criado_em'),
    supabase
      .from('plantios')
      .select('id, especie_id, local_id, origem, data_plantio, apelido, quantidade, status')
      .eq('status', 'ativo')
      .order('data_plantio'),
    supabase.from('confirmacoes_fase').select('plantio_id, fase, data'),
    supabase.from('registros_acao').select('plantio_id, tipo, feito_em').order('feito_em', { ascending: false }).limit(2000),
  ]);
  for (const r of [perfil, locais, plantios, confirmacoes, registros]) {
    if (r.error) falhar('Não foi possível carregar sua horta.', r.error);
  }

  let p = perfil.data;
  if (!p) p = await criarPerfil(usuarioId);

  const confirmacoesPorPlantio = new Map<string, ConfirmacaoFase[]>();
  for (const c of confirmacoes.data ?? []) {
    const lista = confirmacoesPorPlantio.get(c.plantio_id) ?? [];
    lista.push({ fase: c.fase, data: c.data });
    confirmacoesPorPlantio.set(c.plantio_id, lista);
  }

  return {
    perfil: {
      id: p.id,
      nome: p.nome,
      cidade: p.cidade,
      lat: p.lat === null ? null : Number(p.lat),
      lon: p.lon === null ? null : Number(p.lon),
      fuso: p.fuso,
      horarioLembrete: String(p.horario_lembrete).slice(0, 5),
    },
    locais: (locais.data ?? []).map((l) => ({
      id: l.id,
      nome: l.nome,
      tipo: l.tipo as TipoLocal,
      interno: l.interno,
      horasSol: l.horas_sol === null ? null : Number(l.horas_sol),
      volumeLitros: l.volume_litros === null ? null : Number(l.volume_litros),
      material: l.material as MaterialVaso | null,
    })),
    plantios: (plantios.data ?? []).map((pl) => ({
      id: pl.id,
      especieId: pl.especie_id,
      localId: pl.local_id,
      origem: pl.origem as Origem,
      dataPlantio: pl.data_plantio,
      apelido: pl.apelido,
      quantidade: pl.quantidade,
      status: pl.status as PlantioCompleto['status'],
      confirmacoes: confirmacoesPorPlantio.get(pl.id) ?? [],
    })),
    registros: (registros.data ?? []).map((r) => ({ plantioId: r.plantio_id, tipo: r.tipo as TipoAcao, data: r.feito_em })),
  };
}

async function criarPerfil(usuarioId: string) {
  const fuso = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
  const { data, error } = await supabase
    .from('perfis')
    .insert({ id: usuarioId, fuso: fuso.slice(0, 64) })
    .select('id, nome, cidade, lat, lon, fuso, horario_lembrete')
    .single();
  if (error || !data) falhar('Não foi possível criar seu perfil.', error);
  return data;
}

// --- Validação de entrada (SEG-8): o banco também tem restrições, isto dá mensagens claras ---

export const novoLocal = z.object({
  nome: z.string().trim().min(1, 'Dê um nome ao local.').max(60, 'Use até 60 caracteres.'),
  tipo: z.enum(['vaso', 'canteiro', 'quintal', 'jardineira', 'estufa']),
  interno: z.boolean(),
  horasSol: z.number().min(0).max(24).nullable(),
  volumeLitros: z.number().gt(0, 'O volume precisa ser maior que zero.').max(5000).nullable(),
  material: z.enum(['plastico', 'barro', 'tecido']).nullable(),
});
export type NovoLocal = z.infer<typeof novoLocal>;

export async function criarLocal(dados: NovoLocal): Promise<string> {
  const v = novoLocal.parse(dados);
  const { data, error } = await supabase
    .from('locais')
    .insert({
      nome: v.nome,
      tipo: v.tipo,
      interno: v.interno,
      horas_sol: v.horasSol,
      volume_litros: v.tipo === 'vaso' || v.tipo === 'jardineira' ? v.volumeLitros : null,
      material: v.tipo === 'vaso' || v.tipo === 'jardineira' ? v.material : null,
    })
    .select('id')
    .single();
  if (error || !data) falhar('Não foi possível salvar o local.', error);
  return data.id;
}

export const edicaoLocal = z.object({
  nome: novoLocal.shape.nome,
  horasSol: novoLocal.shape.horasSol,
});
export type EdicaoLocal = z.infer<typeof edicaoLocal>;

/** Muda nome e horas de sol de um local. O RLS só deixa alterar locais do próprio usuário. */
export async function atualizarLocal(localId: string, dados: EdicaoLocal): Promise<void> {
  const v = edicaoLocal.parse(dados);
  if (!z.string().uuid().safeParse(localId).success) throw new Error('Local inválido.');
  const { error } = await supabase.from('locais').update({ nome: v.nome, horas_sol: v.horasSol }).eq('id', localId);
  if (error) falhar('Não foi possível salvar o local.', error);
}

export const novoPlantio = z.object({
  especieId: z.string().regex(/^[a-z0-9_]{1,40}$/),
  especieVersao: z.number().int().positive(),
  localId: z.string().uuid('Escolha um local.'),
  origem: z.enum(['semente', 'muda', 'estaca']),
  dataPlantio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.'),
  quantidade: z.number().int().min(1, 'Quantidade mínima é 1.').max(10000),
  apelido: z.string().trim().max(60, 'Use até 60 caracteres.').nullable(),
});
export type NovoPlantio = z.infer<typeof novoPlantio>;

export async function criarPlantio(dados: NovoPlantio): Promise<string> {
  const v = novoPlantio.parse(dados);
  const { data, error } = await supabase
    .from('plantios')
    .insert({
      especie_id: v.especieId,
      especie_versao: v.especieVersao,
      local_id: v.localId,
      origem: v.origem,
      data_plantio: v.dataPlantio,
      quantidade: v.quantidade,
      apelido: v.apelido || null,
    })
    .select('id')
    .single();
  if (error || !data) falhar('Não foi possível salvar o plantio.', error);
  return data.id;
}

export async function registrarAcao(plantioId: string, tipo: TipoAcao, data: DataISO): Promise<void> {
  const { error } = await supabase.from('registros_acao').insert({ plantio_id: plantioId, tipo, feito_em: data });
  if (error) falhar('Não foi possível registrar.', error);
}

/** Registra a mesma ação em vários plantios de uma vez (ex.: "reguei a varanda toda"). */
export async function registrarAcoes(plantioIds: string[], tipo: TipoAcao, data: DataISO): Promise<void> {
  if (plantioIds.length === 0) return;
  const { error } = await supabase
    .from('registros_acao')
    .insert(plantioIds.map((id) => ({ plantio_id: id, tipo, feito_em: data })));
  if (error) falhar('Não foi possível registrar.', error);
}

export async function confirmarFase(plantioId: string, fase: string, data: DataISO): Promise<void> {
  const { error } = await supabase.from('confirmacoes_fase').insert({ plantio_id: plantioId, fase, data });
  if (error) falhar('Não foi possível confirmar a fase.', error);
}

export async function encerrarPlantio(plantioId: string, status: 'colhido' | 'perdido' | 'arquivado'): Promise<void> {
  const { error } = await supabase.from('plantios').update({ status }).eq('id', plantioId);
  if (error) falhar('Não foi possível atualizar o plantio.', error);
}

export async function salvarLocalizacao(perfilId: string, cidade: string, lat: number, lon: number): Promise<void> {
  const { error } = await supabase
    .from('perfis')
    .update({ cidade: cidade.slice(0, 80), lat, lon, consentimento_localizacao_em: new Date().toISOString() })
    .eq('id', perfilId);
  if (error) falhar('Não foi possível salvar a cidade.', error);
}

export async function removerLocalizacao(perfilId: string): Promise<void> {
  const { error } = await supabase
    .from('perfis')
    .update({ cidade: null, lat: null, lon: null, consentimento_localizacao_em: null })
    .eq('id', perfilId);
  if (error) falhar('Não foi possível remover a cidade.', error);
}

export async function salvarHorarioLembrete(perfilId: string, horario: string): Promise<void> {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(horario)) throw new Error('Horário inválido.');
  const { error } = await supabase.from('perfis').update({ horario_lembrete: horario }).eq('id', perfilId);
  if (error) falhar('Não foi possível salvar o horário.', error);
}

// --- Ficha completa da planta (wiki, P3). Vem do banco: tem fonte e confiança de cada dado. ---

export interface Ficha {
  especie: Record<string, string | number | null>;
  epocas: {
    regiao: string;
    variedade: string | null;
    texto: string | null;
    recomendado: boolean | null;
    fonte: string | null;
    confianca: string | null;
  }[];
  referencias: { id: string; citacao: string; url: string | null }[];
}

export async function carregarFicha(especieId: string): Promise<Ficha> {
  const [especie, epocas, referencias] = await Promise.all([
    supabase.from('especies').select('*').eq('id', especieId).single(),
    supabase
      .from('epocas_plantio')
      .select('regiao, variedade, texto, recomendado, fonte, confianca')
      .eq('especie_id', especieId)
      .order('regiao'),
    supabase.from('referencias').select('id, citacao, url').order('id'),
  ]);
  if (especie.error || !especie.data) falhar('Não foi possível abrir a ficha.', especie.error);
  if (epocas.error || referencias.error) falhar('Não foi possível abrir a ficha.');
  return { especie: especie.data, epocas: epocas.data ?? [], referencias: referencias.data ?? [] };
}
