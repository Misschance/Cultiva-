import { describe, expect, it } from 'vitest';
import { CATALOGO, mesNaFaixa, oQuePlantar, regiaoDaCidade, regiaoDoEstado, type Especie } from '../src';

const ids = (lista: { especie: Especie }[] | Especie[]) => lista.map((x) => ('especie' in x ? x.especie.id : x.id));

describe('região pelo estado', () => {
  it('reconhece nome com ou sem acento e sigla', () => {
    expect(regiaoDoEstado('São Paulo')).toBe('Sudeste');
    expect(regiaoDoEstado('sao paulo')).toBe('Sudeste');
    expect(regiaoDoEstado('RS')).toBe('Sul');
    expect(regiaoDoEstado('Distrito Federal')).toBe('Centro-Oeste');
    expect(regiaoDoEstado('Mato Grosso do Sul')).toBe('Centro-Oeste');
    expect(regiaoDoEstado('Estado do Pará')).toBe('Norte');
    expect(regiaoDoEstado('Ontario')).toBeNull();
  });

  it('lê a cidade salva no perfil', () => {
    expect(regiaoDaCidade('Campinas - São Paulo')).toBe('Sudeste');
    expect(regiaoDaCidade('Recife - Pernambuco')).toBe('Nordeste');
    expect(regiaoDaCidade('Campinas')).toBeNull();
    expect(regiaoDaCidade(null)).toBeNull();
  });
});

describe('o que plantar', () => {
  it('trata época que atravessa o ano', () => {
    expect(mesNaFaixa(12, 9, 2)).toBe(true);
    expect(mesNaFaixa(1, 9, 2)).toBe(true);
    expect(mesNaFaixa(5, 9, 2)).toBe(false);
    expect(mesNaFaixa(5, 3, 8)).toBe(true);
  });

  it('separa o que está em época, o que vem depois e o que não tem dado (Sudeste, novembro)', () => {
    const r = oQuePlantar(CATALOGO, 'Sudeste', 11);
    expect(ids(r.agora)).toEqual(expect.arrayContaining(['alface', 'tomate', 'pimenta', 'cenoura', 'coentro']));
    expect(r.agora.find((s) => s.especie.id === 'cenoura')!.variedades).toEqual(['verão']);
    expect(ids(r.depois)).toEqual(expect.arrayContaining(['rucula', 'couve', 'morango']));
    expect(r.depois.find((d) => d.especie.id === 'rucula')!.proximoMes).toBe(3);
    // Sem época na base: fica sem dado, nunca inventada.
    expect(ids(r.semDado)).toEqual(expect.arrayContaining(['manjericao', 'hortela']));
  });

  it('aponta o que a fonte desaconselha na região', () => {
    const r = oQuePlantar(CATALOGO, 'Norte', 5);
    expect(ids(r.naoRecomendadas)).toEqual(expect.arrayContaining(['rucula', 'salsa', 'morango']));
    expect(ids(r.agora)).not.toContain('rucula');
  });

  it('recusa mês inválido', () => {
    expect(() => oQuePlantar(CATALOGO, 'Sul', 13)).toThrow();
  });
});
