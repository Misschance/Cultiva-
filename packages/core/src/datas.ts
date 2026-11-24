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

/** "2026-11-24" vira "24/11/2026". */
export function formatarData(data: DataISO): string {
  paraDia(data);
  const [a, m, d] = data.split('-');
  return `${d}/${m}/${a}`;
}

/** "24/11/2026" vira "2026-11-24"; devolve null se a data não existir. */
export function lerDataBr(texto: string): DataISO | null {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const iso = `${m[3]}-${m[2]!.padStart(2, '0')}-${m[1]!.padStart(2, '0')}`;
  try {
    paraDia(iso);
    return iso;
  } catch {
    return null;
  }
}
