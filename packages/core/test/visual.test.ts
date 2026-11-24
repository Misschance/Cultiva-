import { describe, expect, it } from 'vitest';
import { CATALOGO, ceuDoMomento, estaComSede, estadoVisual, plantadaNoChao, progressoAteColheita, type Especie, type Plantio, type Tarefa } from '../src';

const especie = (id: string): Especie => {
  const e = CATALOGO.find((x) => x.id === id);
  if (!e) throw new Error(`sem ${id}`);
  return e;
};
const alface = especie('alface'); // germinação 0-7, muda 7-35, vegetativo 35-60, colheita a partir de 60

const plantio = (extra: Partial<Plantio> = {}): Plantio => ({
  id: 'p1',
  especieId: 'alface',
  localId: 'l1',
  origem: 'semente',
  dataPlantio: '2026-01-01',
  ...extra,
});

describe('planta animada', () => {
  it('acompanha as fases da ficha', () => {
    expect(estadoVisual(plantio(), alface, '2026-01-03').estagio).toBe('broto');
    const germinou = plantio({ confirmacoes: [{ fase: 'muda', data: '2026-01-06' }] });
    expect(estadoVisual(germinou, alface, '2026-01-15').estagio).toBe('folhas');
    expect(estadoVisual(germinou, alface, '2026-02-15').estagio).toBe('crescendo');
    expect(estadoVisual(germinou, alface, '2026-03-05').estagio).toBe('colheita');
  });

  it('mostra a muda pequena no começo, mesmo sem a fase de sementeira', () => {
    expect(estadoVisual(plantio({ origem: 'muda' }), alface, '2026-01-02').estagio).toBe('folhas');
  });

  it('conta o progresso até o início da colheita', () => {
    const muda = plantio({ origem: 'muda' });
    expect(progressoAteColheita(muda, alface, '2026-01-01')).toBe(0);
    expect(progressoAteColheita(muda, alface, '2026-01-31')).toBe(0.5);
    expect(progressoAteColheita(muda, alface, '2026-06-01')).toBe(1);
    expect(estadoVisual(plantio(), alface, '2026-01-31').dia).toBe(30);
  });

  it('não inventa progresso quando a germinação não foi confirmada a tempo', () => {
    expect(progressoAteColheita(plantio(), alface, '2026-01-20')).toBeNull();
    expect(estadoVisual(plantio(), alface, '2026-01-20').estagio).toBe('broto');
  });

  it('só fica com sede com rega atrasada', () => {
    const t = (tipo: Tarefa['tipo'], atrasada: boolean): Tarefa => ({ plantioId: 'p1', tipo, devidaEm: '2026-01-01', atrasada, ajustes: [] });
    expect(estaComSede([t('rega', true)], 'p1')).toBe(true);
    expect(estaComSede([t('rega', false)], 'p1')).toBe(false);
    expect(estaComSede([t('colheita', true)], 'p1')).toBe(false);
    expect(estaComSede([t('rega', true)], 'p2')).toBe(false);
  });

  it('separa locais de chão e de vaso', () => {
    expect(plantadaNoChao('canteiro')).toBe(true);
    expect(plantadaNoChao('quintal')).toBe(true);
    expect(plantadaNoChao('vaso')).toBe(false);
    expect(plantadaNoChao('jardineira')).toBe(false);
  });
});

describe('céu da cena', () => {
  const h = (hora: number, min = 0) => hora * 60 + min;

  it('mostra o sol de dia, nascendo à esquerda e se pondo à direita', () => {
    expect(ceuDoMomento(h(6))).toEqual({ astro: 'sol', momento: 'amanhecer', progresso: 0 });
    expect(ceuDoMomento(h(12))).toEqual({ astro: 'sol', momento: 'dia', progresso: 0.5 });
    expect(ceuDoMomento(h(17, 30)).momento).toBe('entardecer');
  });

  it('mostra a lua à noite, atravessando a madrugada', () => {
    expect(ceuDoMomento(h(18))).toEqual({ astro: 'lua', momento: 'noite', progresso: 0 });
    expect(ceuDoMomento(h(0)).progresso).toBe(0.5);
    expect(ceuDoMomento(h(5, 59)).astro).toBe('lua');
  });

  it('aceita minutos fora do intervalo de um dia', () => {
    expect(ceuDoMomento(h(36))).toEqual(ceuDoMomento(h(12)));
    expect(ceuDoMomento(-60)).toEqual(ceuDoMomento(h(23)));
  });
});
