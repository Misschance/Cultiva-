import type { Especie, Regiao } from './tipos';

export const REGIOES: readonly Regiao[] = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'];

/** Estados por região do IBGE, pelo nome e pela sigla. */
const ESTADOS: Record<Regiao, [string, string][]> = {
  Norte: [['acre', 'ac'], ['amapa', 'ap'], ['amazonas', 'am'], ['para', 'pa'], ['rondonia', 'ro'], ['roraima', 'rr'], ['tocantins', 'to']],
  Nordeste: [
    ['alagoas', 'al'], ['bahia', 'ba'], ['ceara', 'ce'], ['maranhao', 'ma'], ['paraiba', 'pb'],
    ['pernambuco', 'pe'], ['piaui', 'pi'], ['rio grande do norte', 'rn'], ['sergipe', 'se'],
  ],
  'Centro-Oeste': [['distrito federal', 'df'], ['goias', 'go'], ['mato grosso', 'mt'], ['mato grosso do sul', 'ms']],
  Sudeste: [['espirito santo', 'es'], ['minas gerais', 'mg'], ['rio de janeiro', 'rj'], ['sao paulo', 'sp']],
  Sul: [['parana', 'pr'], ['rio grande do sul', 'rs'], ['santa catarina', 'sc']],
};

const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/^estado d[eoa]s?\s+/, '')
    .trim();

/** Região do Brasil a partir do nome ou da sigla do estado; null se não reconhecer. */
export function regiaoDoEstado(estado: string): Regiao | null {
  const n = normalizar(estado);
  if (!n) return null;
  for (const regiao of REGIOES) {
    if (ESTADOS[regiao].some(([nome, sigla]) => nome === n || sigla === n)) return regiao;
  }
  return null;
}

/** Região a partir da cidade salva no perfil ("Campinas - São Paulo"). */
export function regiaoDaCidade(cidade: string | null | undefined): Regiao | null {
  if (!cidade) return null;
  const partes = cidade.split(' - ');
  return partes.length > 1 ? regiaoDoEstado(partes[partes.length - 1]!) : null;
}

/** O mês (1 a 12) está na faixa, que pode atravessar o ano (set a fev). */
export function mesNaFaixa(mes: number, inicio: number, fim: number): boolean {
  return inicio <= fim ? mes >= inicio && mes <= fim : mes >= inicio || mes <= fim;
}

export interface SugestaoPlantio {
  especie: Especie;
  /** Variedades em época agora (vazio quando a espécie não separa por variedade). */
  variedades: string[];
}

export interface ForaDeEpoca {
  especie: Especie;
  /** Próximo mês (1 a 12) em que alguma variedade entra em época. */
  proximoMes: number;
}

export interface OQuePlantar {
  agora: SugestaoPlantio[];
  depois: ForaDeEpoca[];
  /** A fonte desaconselha plantar na região. */
  naoRecomendadas: Especie[];
  /** A base ainda não tem época para a região: o app não chuta. */
  semDado: Especie[];
}

/** O que plantar no mês, na região, segundo as épocas da base (Embrapa). */
export function oQuePlantar(catalogo: readonly Especie[], regiao: Regiao, mes: number): OQuePlantar {
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) throw new RangeError(`Mês inválido: ${mes}`);
  const r: OQuePlantar = { agora: [], depois: [], naoRecomendadas: [], semDado: [] };
  for (const especie of catalogo) {
    const daRegiao = especie.epocas.filter((e) => e.regiao === regiao);
    const comFaixa = daRegiao.filter((e) => e.recomendado !== false && e.mesInicio !== null && e.mesFim !== null);
    if (comFaixa.length === 0) {
      if (daRegiao.length > 0 && daRegiao.every((e) => e.recomendado === false)) r.naoRecomendadas.push(especie);
      else r.semDado.push(especie);
      continue;
    }
    const agora = comFaixa.filter((e) => mesNaFaixa(mes, e.mesInicio!, e.mesFim!));
    if (agora.length > 0) {
      r.agora.push({ especie, variedades: [...new Set(agora.map((e) => e.variedade).filter((v): v is string => !!v))] });
      continue;
    }
    for (let k = 1; k <= 12; k++) {
      const m = ((mes - 1 + k) % 12) + 1;
      if (comFaixa.some((e) => mesNaFaixa(m, e.mesInicio!, e.mesFim!))) {
        r.depois.push({ especie, proximoMes: m });
        break;
      }
    }
  }
  r.depois.sort((a, b) => ((a.proximoMes - mes + 12) % 12) - ((b.proximoMes - mes + 12) % 12));
  return r;
}
