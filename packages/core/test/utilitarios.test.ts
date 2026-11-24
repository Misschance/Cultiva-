import { describe, expect, it } from 'vitest';
import {
  CATALOGO,
  confirmaExclusao,
  descreverTarefa,
  faseAposGerminacao,
  formatarData,
  lerDataBr,
  hojeNoFuso,
  lerBuscaCidade,
  proximosDias,
  tituloTarefa,
  urlBuscaCidade,
} from '../src';

describe('hoje no fuso do usuário', () => {
  it('usa o fuso informado, não o do aparelho', () => {
    // 01:30 UTC do dia 25 ainda é dia 24 em São Paulo (UTC-3).
    const agora = new Date('2026-11-25T01:30:00Z');
    expect(hojeNoFuso(agora, 'America/Sao_Paulo')).toBe('2026-11-24');
    expect(hojeNoFuso(agora, 'UTC')).toBe('2026-11-25');
  });

  it('lista os próximos dias', () => {
    expect(proximosDias('2026-12-30', 3)).toEqual(['2026-12-30', '2026-12-31', '2027-01-01']);
  });
});

describe('busca de cidade', () => {
  it('monta a busca restrita ao Brasil', () => {
    const url = new URL(urlBuscaCidade(' Campinas '));
    expect(url.searchParams.get('name')).toBe('Campinas');
    expect(url.searchParams.get('countryCode')).toBe('BR');
  });

  it('recusa termo vazio ou longo demais', () => {
    expect(() => urlBuscaCidade('a')).toThrow(RangeError);
    expect(() => urlBuscaCidade('x'.repeat(81))).toThrow(RangeError);
  });

  it('valida a resposta e arredonda as coordenadas', () => {
    const cidades = lerBuscaCidade({
      results: [{ name: 'Campinas', admin1: 'São Paulo', latitude: -22.90556, longitude: -47.06083 }],
    });
    expect(cidades).toEqual([{ nome: 'Campinas', estado: 'São Paulo', lat: -22.91, lon: -47.06 }]);
  });

  it('sem resultados devolve lista vazia', () => {
    expect(lerBuscaCidade({})).toEqual([]);
  });
});

describe('textos das tarefas', () => {
  const alface = CATALOGO.find((e) => e.id === 'alface')!;

  it('usa o apelido quando houver', () => {
    const t = { plantioId: 'p', tipo: 'rega' as const, devidaEm: '2026-11-24', atrasada: false, ajustes: [] };
    expect(descreverTarefa(t, alface, 'Alface da varanda')).toBe('Regar Alface da varanda');
    expect(descreverTarefa({ ...t, atrasada: true }, alface)).toBe('Regar Alface (atrasada)');
    expect(tituloTarefa('verificar-germinacao')).toBe('Já germinou?');
  });
});

describe('datas no formato brasileiro', () => {
  it('formata e lê de volta', () => {
    expect(formatarData('2026-11-24')).toBe('24/11/2026');
    expect(lerDataBr('24/11/2026')).toBe('2026-11-24');
    expect(lerDataBr('1/2/2026')).toBe('2026-02-01');
  });

  it('rejeita datas que não existem', () => {
    expect(lerDataBr('31/02/2026')).toBeNull();
    expect(lerDataBr('2026-11-24')).toBeNull();
  });
});

describe('confirmação de germinação', () => {
  it('leva para a fase seguinte à germinação', () => {
    const tomate = CATALOGO.find((e) => e.id === 'tomate')!;
    expect(faseAposGerminacao(tomate)?.nome).toBe('muda');
    const hortela = CATALOGO.find((e) => e.id === 'hortela')!;
    expect(faseAposGerminacao(hortela)).toBeNull();
  });
});

describe('confirmação da exclusão de conta', () => {
  it('só aceita a palavra EXCLUIR', () => {
    expect(confirmaExclusao('EXCLUIR')).toBe(true);
    expect(confirmaExclusao(' excluir ')).toBe(true);
    expect(confirmaExclusao('excluir conta')).toBe(false);
    expect(confirmaExclusao('')).toBe(false);
  });
});
