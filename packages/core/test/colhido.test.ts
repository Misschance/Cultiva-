import { describe, expect, it } from 'vitest';
import { descreverTotais, formatarPeso, resumirColheitas, type Colheita } from '../src';

const c = (id: string, plantioId: string, data: string, quantidade: number, unidade: Colheita['unidade']): Colheita => ({ id, plantioId, data, quantidade, unidade });
const especie = new Map([
  ['p1', 'tomate'],
  ['p2', 'alface'],
  ['p3', 'tomate'],
]);

describe('resumo de colheitas', () => {
  const lista = [
    c('1', 'p1', '2026-11-20', 1.2, 'kg'),
    c('2', 'p3', '2026-11-22', 300, 'g'),
    c('3', 'p2', '2026-10-05', 2, 'macos'),
    c('4', 'p1', '2026-06-01', 5, 'unidades'), // fora dos 6 meses do gráfico, mas conta no total
    c('5', 'p2', '2026-12-01', 1, 'macos'), // futuro: fica de fora
  ];
  const r = resumirColheitas(lista, especie, '2026-11-24');

  it('soma kg e g juntos como peso, e maços e unidades à parte', () => {
    expect(r.vezes).toBe(4);
    expect(r.totais).toEqual({ gramas: 1500, macos: 2, unidades: 5 });
    expect(r.ultima).toBe('2026-11-22');
  });

  it('agrupa por espécie, juntando plantios da mesma planta', () => {
    expect(r.porEspecie.map((e) => e.especieId)).toEqual(['tomate', 'alface']);
    expect(r.porEspecie[0]).toMatchObject({ vezes: 3, totais: { gramas: 1500, macos: 0, unidades: 5 }, ultima: '2026-11-22' });
  });

  it('monta os últimos meses, inclusive os vazios', () => {
    expect(r.porMes.map((m) => m.mes)).toEqual(['2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11']);
    expect(r.porMes.map((m) => m.vezes)).toEqual([1, 0, 0, 0, 1, 2]);
    expect(resumirColheitas([], especie, '2026-02-10', 3).porMes.map((m) => m.mes)).toEqual(['2025-12', '2026-01', '2026-02']);
  });

  it('escreve os totais em português', () => {
    expect(formatarPeso(1500)).toBe('1,5 kg');
    expect(formatarPeso(350)).toBe('350 g');
    expect(descreverTotais({ gramas: 1500, macos: 1, unidades: 12 })).toBe('1,5 kg · 1 maço · 12 unidades');
    expect(descreverTotais({ gramas: 0, macos: 0, unidades: 0 })).toBe('');
  });
});
