import { describe, expect, it } from 'vitest';
import {
  CATALOGO,
  avaliarLuz,
  calendarioColheitas,
  colheitaIncerta,
  especiesParaLocal,
  faseAposGerminacao,
  horasDeSol,
  inicioDaSemana,
  janelaColheita,
  locaisComSol,
  mensagemLuz,
  periodoDoSol,
  tarefasDoDia,
  type Especie,
  type Plantio,
} from '../src';

const especie = (id: string): Especie => {
  const e = CATALOGO.find((x) => x.id === id);
  if (!e) throw new Error(`sem ${id}`);
  return e;
};
const alface = especie('alface'); // aceita meia-sombra, 5 h; germina 4-7 dias; colheita 60-90
const tomate = especie('tomate'); // sol pleno, 5 h

describe('luz solar', () => {
  it('compara as horas do local com o mínimo da ficha', () => {
    expect(avaliarLuz(tomate, { horasSol: 6 }).situacao).toBe('adequada');
    expect(avaliarLuz(tomate, { horasSol: 5 }).situacao).toBe('adequada');
    expect(avaliarLuz(tomate, { horasSol: 3 }).situacao).toBe('pouco-sol');
    expect(avaliarLuz(alface, { horasSol: 3 }).situacao).toBe('aceita-meia-sombra');
    expect(avaliarLuz(tomate, { horasSol: null }).situacao).toBe('sem-dado');
  });

  it('só avisa quando falta sol', () => {
    expect(mensagemLuz(tomate, 'Varanda', avaliarLuz(tomate, { horasSol: 6 }))).toBeNull();
    expect(mensagemLuz(tomate, 'Varanda', avaliarLuz(tomate, { horasSol: 3 }))).toContain('Varanda recebe 3 h');
    expect(mensagemLuz(alface, 'Varanda', avaliarLuz(alface, { horasSol: 3 }))).toContain('aceita meia-sombra');
  });

  it('sugere locais com sol suficiente, do mais ensolarado para o menos', () => {
    const locais = [
      { id: 'a', horasSol: 3 },
      { id: 'b', horasSol: 5 },
      { id: 'c', horasSol: 8 },
      { id: 'd', horasSol: null },
    ];
    expect(locaisComSol(tomate, locais).map((l) => l.id)).toEqual(['c', 'b']);
  });

  it('lista o que plantar num local, adequadas primeiro', () => {
    const lista = especiesParaLocal(CATALOGO, { horasSol: 3 });
    const situacoes = lista.map((x) => x.avaliacao.situacao);
    expect(situacoes.indexOf('pouco-sol')).toBeGreaterThan(situacoes.lastIndexOf('aceita-meia-sombra'));
    expect(lista.find((x) => x.especie.id === 'alface')?.avaliacao.situacao).toBe('aceita-meia-sombra');
  });

  it('converte o questionário de horários em horas de sol', () => {
    expect(horasDeSol('9:00', '13:00')).toBe(4);
    expect(horasDeSol('08:20', '11:00')).toBe(2.5);
    expect(horasDeSol('13:00', '9:00')).toBeNull();
    expect(horasDeSol('25:00', '26:00')).toBeNull();
    expect(periodoDoSol('7:00', '11:00')).toBe('manha');
    expect(periodoDoSol('13:00', '17:00')).toBe('tarde');
    expect(periodoDoSol('10:00', '15:00')).toBe('manha-e-tarde');
  });
});

describe('colheita ajustada pela germinação', () => {
  const base: Plantio = { id: 'p1', especieId: 'alface', localId: 'l1', origem: 'semente', dataPlantio: '2026-11-01' };
  const fase = faseAposGerminacao(alface)!.nome;

  it('sem confirmação, conta da semeadura', () => {
    expect(janelaColheita(base, alface)).toEqual({ inicio: '2026-12-31', fim: '2027-01-30' });
  });

  it('germinou dentro da janela: nada muda', () => {
    const p = { ...base, confirmacoes: [{ fase, data: '2026-11-06' }] };
    expect(janelaColheita(p, alface)).toEqual({ inicio: '2026-12-31', fim: '2027-01-30' });
  });

  it('germinou 3 dias depois do prazo: a colheita atrasa 3 dias', () => {
    const p = { ...base, confirmacoes: [{ fase, data: '2026-11-11' }] };
    expect(janelaColheita(p, alface)).toEqual({ inicio: '2027-01-03', fim: '2027-02-02' });
  });

  it('germinou antes da janela: a colheita adianta', () => {
    const p = { ...base, confirmacoes: [{ fase, data: '2026-11-03' }] };
    expect(janelaColheita(p, alface)).toEqual({ inicio: '2026-12-29', fim: '2027-01-28' });
  });

  it('janela de germinação vencida sem confirmação deixa a colheita incerta', () => {
    expect(colheitaIncerta(base, alface, '2026-11-08')).toBe(false);
    expect(colheitaIncerta(base, alface, '2026-11-09')).toBe(true);
    expect(colheitaIncerta({ ...base, confirmacoes: [{ fase, data: '2026-11-10' }] }, alface, '2026-11-20')).toBe(false);
    expect(colheitaIncerta({ ...base, origem: 'muda' }, alface, '2026-12-20')).toBe(false);
  });

  it('a agenda usa a colheita ajustada', () => {
    const p = { ...base, confirmacoes: [{ fase, data: '2026-11-11' }] };
    const tarefas = tarefasDoDia({
      plantios: [p],
      especies: new Map([['alface', alface]]),
      locais: new Map([['l1', { id: 'l1', tipo: 'canteiro', interno: false }]]),
      registros: [{ plantioId: 'p1', tipo: 'rega', data: '2026-12-27' }],
      hoje: '2026-12-27',
    });
    expect(tarefas.map((t) => t.tipo)).toContain('colheita-proxima');
    const antes = tarefasDoDia({
      plantios: [p],
      especies: new Map([['alface', alface]]),
      locais: new Map([['l1', { id: 'l1', tipo: 'canteiro', interno: false }]]),
      registros: [{ plantioId: 'p1', tipo: 'rega', data: '2026-12-26' }],
      hoje: '2026-12-26',
    });
    expect(antes.map((t) => t.tipo)).not.toContain('colheita-proxima');
  });
});

describe('calendário de colheitas', () => {
  it('a semana começa na segunda-feira', () => {
    expect(inicioDaSemana('2026-11-24')).toBe('2026-11-23'); // terça
    expect(inicioDaSemana('2026-11-23')).toBe('2026-11-23'); // segunda
    expect(inicioDaSemana('2026-11-29')).toBe('2026-11-23'); // domingo
  });

  it('agrupa por semana e soma os pés por espécie', () => {
    const rabanete = especie('rabanete'); // colheita 30-35 dias
    const p = (id: string, data: string, origem: Plantio['origem'] = 'muda'): Plantio => ({
      id,
      especieId: 'rabanete',
      localId: 'l1',
      origem,
      dataPlantio: data,
    });
    const cal = calendarioColheitas(
      [
        { plantio: p('a', '2026-11-01'), especie: rabanete, quantidade: 10 }, // 01/12 a 06/12
        { plantio: p('b', '2026-11-02'), especie: rabanete, quantidade: 5 }, // 02/12 a 07/12
        { plantio: p('c', '2026-10-01', 'semente'), especie: rabanete, quantidade: 8 }, // germinação vencida
      ],
      '2026-11-24',
      4,
    );
    expect(cal.map((s) => s.inicio)).toEqual(['2026-11-23', '2026-11-30', '2026-12-07', '2026-12-14']);
    expect(cal[0]!.colheitas).toEqual([]);
    expect(cal[1]!.porEspecie).toEqual([{ especieId: 'rabanete', quantidade: 15 }]);
    expect(cal[1]!.colheitas.every((c) => c.abreNestaSemana)).toBe(true);
    // A janela do plantio b vai até 07/12, segunda da semana seguinte.
    expect(cal[2]!.colheitas).toEqual([{ plantioId: 'b', especieId: 'rabanete', quantidade: 5, abreNestaSemana: false }]);
    expect(cal[3]!.colheitas).toEqual([]);
  });
});
