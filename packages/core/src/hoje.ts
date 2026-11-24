import { somarDias } from './datas';
import type { DataISO } from './tipos';

/** Data de hoje no fuso do usuário (ex.: "America/Sao_Paulo"), sem depender do fuso do aparelho. */
export function hojeNoFuso(agora: Date, fuso: string): DataISO {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: fuso,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(agora);
  const valor = (tipo: string) => partes.find((p) => p.type === tipo)?.value ?? '';
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}

/** Lista de datas a partir de `inicio`, inclusive. */
export function proximosDias(inicio: DataISO, quantidade: number): DataISO[] {
  return Array.from({ length: quantidade }, (_, i) => somarDias(inicio, i));
}
