import type { DataISO } from './tipos';

const DIA_MS = 86_400_000;
const FORMATO = /^\d{4}-\d{2}-\d{2}$/;

/** Converte AAAA-MM-DD em número de dias desde 1970-01-01 (UTC), validando a data. */
export function paraDia(data: DataISO): number {
  if (!FORMATO.test(data)) throw new RangeError(`Data inválida: ${data}`);
  const ms = Date.parse(`${data}T00:00:00Z`);
  if (Number.isNaN(ms) || new Date(ms).toISOString().slice(0, 10) !== data) {
    throw new RangeError(`Data inválida: ${data}`);
  }
  return ms / DIA_MS;
}

export function deDia(dia: number): DataISO {
  return new Date(dia * DIA_MS).toISOString().slice(0, 10);
}

/** Dias de `de` até `ate` (negativo se `ate` for antes). */
export function diasEntre(de: DataISO, ate: DataISO): number {
  return paraDia(ate) - paraDia(de);
}

export function somarDias(data: DataISO, dias: number): DataISO {
  return deDia(paraDia(data) + dias);
}

export function maisRecente(datas: DataISO[]): DataISO | null {
  if (datas.length === 0) return null;
  return datas.reduce((a, b) => (paraDia(b) > paraDia(a) ? b : a));
}
