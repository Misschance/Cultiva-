import { deDia, maisRecente, paraDia } from './datas';
import { faseAtual, germinacaoConfirmada } from './fases';
import { colheitaIncerta, janelaColheita, janelaGerminacao } from './previsao';
import { proximaRega } from './rega';
import type { DataISO, Especie, Local, Plantio, RegistroAcao, TipoAcao } from './tipos';

/** Mês no formato AAAA-MM. */
export type Mes = string;

export type TipoEvento =
  /** Dia em que a planta foi plantada. */
  | 'plantio'
  /** Ação que o usuário registrou (rega, adubação, colheita...). */
  | 'feito'
  /** Rega que o app prevê, a partir da última rega real e do intervalo da fase. */
  | 'rega-prevista'
  /** Primeiro dia em que a semente pode germinar (ainda não confirmada). */
  | 'germinacao'
  /** Primeiro dia da janela de início da colheita. */
  | 'colheita-prevista'
  /** A planta entra numa nova fase do ciclo. */
  | 'fase';

export interface EventoCalendario {
  data: DataISO;
  plantioId: string;
  tipo: TipoEvento;
  /** Para 'feito': qual ação foi registrada. */
  acao?: TipoAcao;
  /** Para 'fase': nome da fase que começa. */
  fase?: string;
}

export interface DiaCalendario {
  data: DataISO;
  eventos: EventoCalendario[];
}

export interface EntradaCalendario {
  plantios: Plantio[];
  especies: ReadonlyMap<string, Especie>;
  locais: ReadonlyMap<string, Local>;
  registros: RegistroAcao[];
  hoje: DataISO;
  mes: Mes;
}

/** Regas previstas só até este horizonte: além disso o clima e o uso real mudam demais a conta. */
export const HORIZONTE_REGAS_DIAS = 60;

const FORMATO_MES = /^\d{4}-(0[1-9]|1[0-2])$/;

export function mesDe(data: DataISO): Mes {
  paraDia(data);
  return data.slice(0, 7);
}

export function somarMeses(mes: Mes, n: number): Mes {
  if (!FORMATO_MES.test(mes)) throw new RangeError(`Mês inválido: ${mes}`);
  const [a, m] = mes.split('-').map(Number) as [number, number];
  const total = a * 12 + (m - 1) + n;
  return `${String(Math.floor(total / 12)).padStart(4, '0')}-${String((total % 12) + 1).padStart(2, '0')}`;
}

/** Datas do mês, do dia 1 ao último. */
export function diasDoMes(mes: Mes): DataISO[] {
  if (!FORMATO_MES.test(mes)) throw new RangeError(`Mês inválido: ${mes}`);
  const inicio = paraDia(`${mes}-01`);
  const fim = paraDia(`${somarMeses(mes, 1)}-01`);
  return Array.from({ length: fim - inicio }, (_, i) => deDia(inicio + i));
}

/** Dia da semana, 0 = domingo. 1970-01-01 (dia 0) foi uma quinta. */
export function diaDaSemana(data: DataISO): number {
  return (paraDia(data) + 4) % 7;
}

/** Grade do mês em semanas de domingo a sábado; null nas casas fora do mês. */
export function gradeDoMes(mes: Mes): (DataISO | null)[][] {
  const dias = diasDoMes(mes);
  const casas: (DataISO | null)[] = [...Array<null>(diaDaSemana(dias[0]!)).fill(null), ...dias];
  while (casas.length % 7) casas.push(null);
  return Array.from({ length: casas.length / 7 }, (_, i) => casas.slice(i * 7, i * 7 + 7));
}

const ORDEM: Record<TipoEvento, number> = { 'colheita-prevista': 0, 'rega-prevista': 1, germinacao: 2, fase: 3, plantio: 4, feito: 5 };

/**
 * Eventos de cada dia do mês: o que aconteceu (plantios e ações registradas)
 * e o que vem pela frente (regas previstas, germinação, colheita e troca de fase).
 * Nada aqui é dado novo de cultivo: tudo sai da ficha da espécie e da agenda de rega.
 */
export function calendarioDoMes(e: EntradaCalendario): DiaCalendario[] {
  const dias = diasDoMes(e.mes);
  const primeiro = paraDia(dias[0]!);
  const ultimo = paraDia(dias[dias.length - 1]!);
  const hoje = paraDia(e.hoje);
  const porDia = new Map<DataISO, EventoCalendario[]>(dias.map((d) => [d, []]));
  const add = (ev: EventoCalendario) => porDia.get(ev.data)?.push(ev);

  for (const r of e.registros) add({ data: r.data, plantioId: r.plantioId, tipo: 'feito', acao: r.tipo });

  for (const plantio of e.plantios) {
    const especie = e.especies.get(plantio.especieId);
    const local = e.locais.get(plantio.localId);
    if (!especie || !local) continue;
    const plantado = paraDia(plantio.dataPlantio);
    add({ data: plantio.dataPlantio, plantioId: plantio.id, tipo: 'plantio' });

    const germ = janelaGerminacao(plantio, especie);
    if (germ && !germinacaoConfirmada(plantio, especie)) add({ data: germ.inicio, plantioId: plantio.id, tipo: 'germinacao' });

    const colheita = colheitaIncerta(plantio, especie, e.hoje) ? null : janelaColheita(plantio, especie);
    if (colheita) add({ data: colheita.inicio, plantioId: plantio.id, tipo: 'colheita-prevista' });

    // Troca de fase: o dia em que a fase calculada muda em relação à véspera.
    for (let d = Math.max(primeiro, plantado + 1); d <= ultimo; d++) {
      const antes = faseAtual(plantio, especie, deDia(d - 1));
      const agora = faseAtual(plantio, especie, deDia(d));
      if (agora.ordem !== antes.ordem && agora.nome !== 'colheita') add({ data: deDia(d), plantioId: plantio.id, tipo: 'fase', fase: agora.nome });
    }

    // Regas previstas: simula a agenda dia a dia a partir de hoje, como se cada rega fosse feita no dia devido.
    const fimPrevisao = Math.min(ultimo, hoje + HORIZONTE_REGAS_DIAS);
    if (fimPrevisao < Math.max(hoje, primeiro)) continue;
    let ultima = maisRecente(
      e.registros.filter((r) => r.plantioId === plantio.id && r.tipo === 'rega' && paraDia(r.data) <= hoje).map((r) => r.data),
    );
    for (let d = Math.max(hoje, plantado); d <= fimPrevisao; d++) {
      const data = deDia(d);
      const rega = proximaRega({ especie, fase: faseAtual(plantio, especie, data), local, dataPlantio: plantio.dataPlantio, ultimaRega: ultima, hoje: data });
      if (paraDia(rega.devidaEm) <= d) {
        if (d >= primeiro) add({ data, plantioId: plantio.id, tipo: 'rega-prevista' });
        ultima = data;
      }
    }
  }

  return dias.map((data) => ({ data, eventos: porDia.get(data)!.sort((a, b) => ORDEM[a.tipo] - ORDEM[b.tipo]) }));
}
