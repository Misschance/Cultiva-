import { paraDia } from './datas';
import type { Colheita, UnidadeColheita } from './diario';
import type { DataISO } from './tipos';

/** Soma por tipo de medida: peso (em gramas), maços e unidades. Peso junta o que foi anotado em kg e em g. */
export interface Totais {
  gramas: number;
  macos: number;
  unidades: number;
}

export interface ColhidoPorEspecie {
  especieId: string;
  totais: Totais;
  vezes: number;
  ultima: DataISO;
}

export interface ColhidoNoMes {
  /** AAAA-MM */
  mes: string;
  vezes: number;
  totais: Totais;
}

export interface ResumoColheitas {
  vezes: number;
  totais: Totais;
  /** Espécies com mais colheitas primeiro. */
  porEspecie: ColhidoPorEspecie[];
  /** Os últimos `meses` meses até o de hoje, do mais antigo ao atual, inclusive os vazios. */
  porMes: ColhidoNoMes[];
  ultima: DataISO | null;
}

const zerado = (): Totais => ({ gramas: 0, macos: 0, unidades: 0 });

function somar(t: Totais, quantidade: number, unidade: UnidadeColheita) {
  if (unidade === 'kg') t.gramas += quantidade * 1000;
  else if (unidade === 'g') t.gramas += quantidade;
  else if (unidade === 'macos') t.macos += quantidade;
  else t.unidades += quantidade;
}

function mesAnterior(mes: string, n: number): string {
  const [a, m] = mes.split('-').map(Number) as [number, number];
  const total = a * 12 + (m - 1) - n;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
}

/**
 * Resumo do que a pessoa já colheu, de todas as plantas (inclusive as encerradas).
 * Colheitas com data no futuro ficam de fora.
 */
export function resumirColheitas(
  colheitas: readonly Colheita[],
  especieDoPlantio: ReadonlyMap<string, string>,
  hoje: DataISO,
  meses = 6,
): ResumoColheitas {
  const limite = paraDia(hoje);
  const validas = colheitas.filter((c) => paraDia(c.data) <= limite);
  const totais = zerado();
  const especies = new Map<string, ColhidoPorEspecie>();
  const mesAtual = hoje.slice(0, 7);
  const porMes: ColhidoNoMes[] = Array.from({ length: meses }, (_, i) => ({ mes: mesAnterior(mesAtual, meses - 1 - i), vezes: 0, totais: zerado() }));
  const indiceMes = new Map(porMes.map((m, i) => [m.mes, i]));
  let ultima: DataISO | null = null;

  for (const c of validas) {
    somar(totais, c.quantidade, c.unidade);
    const especieId = especieDoPlantio.get(c.plantioId);
    if (especieId) {
      const e = especies.get(especieId) ?? { especieId, totais: zerado(), vezes: 0, ultima: c.data };
      somar(e.totais, c.quantidade, c.unidade);
      e.vezes += 1;
      if (c.data > e.ultima) e.ultima = c.data;
      especies.set(especieId, e);
    }
    const i = indiceMes.get(c.data.slice(0, 7));
    if (i !== undefined) {
      porMes[i]!.vezes += 1;
      somar(porMes[i]!.totais, c.quantidade, c.unidade);
    }
    if (!ultima || c.data > ultima) ultima = c.data;
  }

  const arredondar = (t: Totais) => {
    t.gramas = Math.round(t.gramas);
    t.macos = Math.round(t.macos * 100) / 100;
    t.unidades = Math.round(t.unidades * 100) / 100;
  };
  arredondar(totais);
  for (const e of especies.values()) arredondar(e.totais);
  for (const m of porMes) arredondar(m.totais);

  return {
    vezes: validas.length,
    totais,
    porEspecie: [...especies.values()].sort((a, b) => b.vezes - a.vezes || b.ultima.localeCompare(a.ultima)),
    porMes,
    ultima,
  };
}

/** "1,25 kg" a partir de 1250 g; abaixo de 1 kg fica em gramas. */
export function formatarPeso(gramas: number): string {
  if (gramas >= 1000) return `${(gramas / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`;
  return `${Math.round(gramas).toLocaleString('pt-BR')} g`;
}

/** Totais em texto curto: "1,2 kg · 3 maços · 12 unidades". */
export function descreverTotais(t: Totais): string {
  const partes: string[] = [];
  const n = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  if (t.gramas > 0) partes.push(formatarPeso(t.gramas));
  if (t.macos > 0) partes.push(`${n(t.macos)} ${t.macos === 1 ? 'maço' : 'maços'}`);
  if (t.unidades > 0) partes.push(`${n(t.unidades)} ${t.unidades === 1 ? 'unidade' : 'unidades'}`);
  return partes.join(' · ');
}
