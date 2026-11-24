import { paraDia } from './datas';
import type { DataISO, RegistroAcao, TipoAcao } from './tipos';

/** Diário da horta (P6): anotações com foto, ações e colheitas numa linha do tempo só. */

export type UnidadeColheita = 'kg' | 'g' | 'macos' | 'unidades';

export const NOME_UNIDADE: Record<UnidadeColheita, string> = {
  kg: 'kg',
  g: 'g',
  macos: 'maços',
  unidades: 'unidades',
};

export interface EntradaDiario {
  id: string;
  plantioId: string;
  data: DataISO;
  texto: string | null;
  fotoCaminho: string | null;
}

export interface Colheita {
  id: string;
  plantioId: string;
  data: DataISO;
  quantidade: number;
  unidade: UnidadeColheita;
}

export type ItemLinhaDoTempo =
  | { tipo: 'anotacao'; data: DataISO; entrada: EntradaDiario }
  | { tipo: 'colheita'; data: DataISO; colheita: Colheita }
  | { tipo: 'acao'; data: DataISO; acao: TipoAcao };

/**
 * Junta anotações, colheitas e ações de um plantio, da mais recente para a mais antiga (RF-6.1).
 * No mesmo dia, anotação vem primeiro, depois colheita, depois ações. A ação "colheita" some
 * quando há uma colheita com quantidade no mesmo dia, para não aparecer duas vezes.
 */
export function linhaDoTempo(
  entradas: EntradaDiario[],
  colheitas: Colheita[],
  registros: RegistroAcao[],
): ItemLinhaDoTempo[] {
  const diasComColheita = new Set(colheitas.map((c) => c.data));
  const itens: ItemLinhaDoTempo[] = [
    ...entradas.map((entrada) => ({ tipo: 'anotacao' as const, data: entrada.data, entrada })),
    ...colheitas.map((colheita) => ({ tipo: 'colheita' as const, data: colheita.data, colheita })),
    ...registros
      .filter((r) => !(r.tipo === 'colheita' && diasComColheita.has(r.data)))
      .map((r) => ({ tipo: 'acao' as const, data: r.data, acao: r.tipo })),
  ];
  const ordem = { anotacao: 0, colheita: 1, acao: 2 };
  return itens.sort((a, b) => paraDia(b.data) - paraDia(a.data) || ordem[a.tipo] - ordem[b.tipo]);
}

/** Total colhido por unidade, para o resumo do plantio. */
export function totalColhido(colheitas: Colheita[]): { unidade: UnidadeColheita; quantidade: number }[] {
  const soma = new Map<UnidadeColheita, number>();
  for (const c of colheitas) soma.set(c.unidade, (soma.get(c.unidade) ?? 0) + c.quantidade);
  return [...soma].map(([unidade, quantidade]) => ({ unidade, quantidade: Math.round(quantidade * 100) / 100 }));
}

/** Confere pela assinatura dos bytes que o arquivo é mesmo JPEG (SEG-12), sem confiar na extensão. */
export function ehJpeg(bytes: Uint8Array): boolean {
  return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

/** Caminho da foto no bucket: pasta do usuário e nome aleatório, no formato que o banco aceita. */
export function caminhoDaFoto(usuarioId: string, arquivoId: string): string {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (!uuid.test(usuarioId) || !uuid.test(arquivoId)) throw new Error('Identificador inválido para a foto.');
  return `${usuarioId}/${arquivoId}.jpg`;
}

/** UUID v4 a partir de 16 bytes aleatórios (a fonte de aleatoriedade é injetada). */
export function uuidV4(aleatorios: Uint8Array): string {
  if (aleatorios.length < 16) throw new Error('São precisos 16 bytes.');
  const b = Array.from(aleatorios.slice(0, 16));
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  const h = b.map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
