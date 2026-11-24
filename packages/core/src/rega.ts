import { somarDias, paraDia } from './datas';
import { FASES_DE_SEMENTEIRA } from './fases';
import type { DataISO, Especie, FaseEspecie, Faixa, Local, PrevisaoDia } from './tipos';

/** Chuva prevista no dia, em mm, a partir da qual a rega de plantas ao ar livre é adiada. */
export const CHUVA_ADIA_REGA_MM = 5;
export const CALOR_INTENSO_C = 32;
export const FRIO_C = 15;

/**
 * Faixa de intervalo entre regas para a fase.
 * Na sementeira a base pede terra sempre úmida, 1 a 2 regas por dia (R3 p.27);
 * o app lembra uma vez por dia e a instrução da fase diz para regar de novo no fim da tarde.
 */
export function faixaRega(especie: Especie, fase: FaseEspecie): Faixa {
  if (FASES_DE_SEMENTEIRA.has(fase.nome)) return { min: 1, max: 1 };
  return especie.regaAdultaIntervaloDias;
}

export function fatorVaso(local: Local): number {
  if (local.tipo !== 'vaso' && local.tipo !== 'jardineira') return 1;
  let fator = 1;
  const volume = local.volumeLitros;
  if (volume != null) {
    if (volume <= 5) fator = 0.7;
    else if (volume <= 20) fator = 0.85;
  }
  if (local.material === 'barro' || local.material === 'tecido') fator *= 0.9;
  return fator;
}

export function fatorClima(local: Local, previsao: PrevisaoDia | undefined): number {
  if (!previsao || local.interno) return 1;
  if (previsao.tempMaxC > CALOR_INTENSO_C) return 0.8;
  if (previsao.tempMaxC < FRIO_C) return 1.2;
  return 1;
}

export interface IntervaloCalculado {
  dias: number;
  ajustes: string[];
}

/**
 * intervalo = clamp(meio da faixa × fator do vaso × fator do clima × fator do usuário, min, max),
 * arredondado para dias inteiros.
 */
export function intervaloRega(
  faixa: Faixa,
  local: Local,
  previsao?: PrevisaoDia,
  fatorUsuario = 1,
): IntervaloCalculado {
  const base = (faixa.min + faixa.max) / 2;
  const fv = fatorVaso(local);
  const fc = fatorClima(local, previsao);
  const bruto = base * fv * fc * fatorUsuario;
  const dias = Math.max(1, Math.min(faixa.max, Math.max(faixa.min, Math.round(bruto))));

  const ajustes: string[] = [];
  if (fc < 1) ajustes.push('Calor forte previsto: rega antecipada.');
  if (fc > 1) ajustes.push('Dia frio previsto: a terra seca mais devagar.');
  return { dias, ajustes };
}

export interface ProximaRegaEntrada {
  especie: Especie;
  fase: FaseEspecie;
  local: Local;
  dataPlantio: DataISO;
  ultimaRega: DataISO | null;
  hoje: DataISO;
  /** Previsão do local para hoje, quando houver. */
  previsaoHoje?: PrevisaoDia;
  fatorUsuario?: number;
}

export interface ProximaRega {
  devidaEm: DataISO;
  atrasada: boolean;
  ajustes: string[];
}

/** A próxima rega é sempre calculada a partir da última rega real, não de um calendário fixo. */
export function proximaRega(e: ProximaRegaEntrada): ProximaRega {
  const faixa = faixaRega(e.especie, e.fase);
  const { dias, ajustes } = intervaloRega(faixa, e.local, e.previsaoHoje, e.fatorUsuario);
  let devidaEm = e.ultimaRega ? somarDias(e.ultimaRega, dias) : e.dataPlantio;
  const hoje = paraDia(e.hoje);
  const venceAteHoje = paraDia(devidaEm) <= hoje;
  const atrasada = paraDia(devidaEm) < hoje;

  const aoArLivre = !e.local.interno && e.local.tipo !== 'estufa';
  const chuva = e.previsaoHoje?.chuvaMm ?? 0;
  if (venceAteHoje && aoArLivre && chuva >= CHUVA_ADIA_REGA_MM) {
    devidaEm = somarDias(e.hoje, 1);
    ajustes.push(`Chuva prevista de ${formatarMm(chuva)} hoje: rega adiada para amanhã.`);
    return { devidaEm, atrasada: false, ajustes };
  }
  return { devidaEm, atrasada, ajustes };
}

function formatarMm(mm: number): string {
  return `${mm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mm`;
}
