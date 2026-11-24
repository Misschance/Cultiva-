import { diasEntre } from './datas';
import { faseAtual } from './fases';
import { colheitaIncerta, janelaColheita } from './previsao';
import type { DataISO, Especie, Plantio, Tarefa, TipoLocal } from './tipos';

/** Como a planta animada aparece: do broto até o ponto de colheita. */
export type EstagioVisual = 'broto' | 'folhas' | 'crescendo' | 'colheita';

export interface EstadoVisual {
  estagio: EstagioVisual;
  /** Dia do plantio, contado a partir da data de plantio. */
  dia: number;
  /** Caminho até o início da colheita, de 0 a 1; null quando não dá para prever. */
  progresso: number | null;
}

/** Abaixo disso, a planta em fase vegetativa ainda aparece pequena. */
const LIMITE_FOLHAS = 0.4;

/** Progresso do plantio até o início da janela de colheita. */
export function progressoAteColheita(plantio: Plantio, especie: Especie, hoje: DataISO): number | null {
  const janela = janelaColheita(plantio, especie);
  if (!janela || colheitaIncerta(plantio, especie, hoje)) return null;
  const total = diasEntre(plantio.dataPlantio, janela.inicio);
  if (total <= 0) return 1;
  const feito = diasEntre(plantio.dataPlantio, hoje);
  return Math.min(1, Math.max(0, feito / total));
}

export function estadoVisual(plantio: Plantio, especie: Especie, hoje: DataISO): EstadoVisual {
  const fase = faseAtual(plantio, especie, hoje);
  const progresso = progressoAteColheita(plantio, especie, hoje);
  const dia = Math.max(0, diasEntre(plantio.dataPlantio, hoje));

  let estagio: EstagioVisual;
  // Germinação não confirmada depois da janela: ainda não sabemos se nasceu, então fica no broto.
  if (fase.nome === 'germinação' || colheitaIncerta(plantio, especie, hoje)) estagio = 'broto';
  else if (fase.nome === 'muda') estagio = 'folhas';
  else if (fase.nome === 'colheita' || progresso === 1) estagio = 'colheita';
  else estagio = progresso !== null && progresso < LIMITE_FOLHAS ? 'folhas' : 'crescendo';

  return { estagio, dia, progresso };
}

/** A planta tem rega atrasada hoje. */
export function estaComSede(tarefas: readonly Tarefa[], plantioId: string): boolean {
  return tarefas.some((t) => t.plantioId === plantioId && t.tipo === 'rega' && t.atrasada);
}

/** Locais de chão mostram a planta na terra; os demais, num vaso. */
export function plantadaNoChao(tipo: TipoLocal): boolean {
  return tipo === 'canteiro' || tipo === 'quintal' || tipo === 'estufa';
}
