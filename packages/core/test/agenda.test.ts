import { describe, expect, it } from 'vitest';
import {
  CATALOGO,
  diasEntre,
  faseAtual,
  intervaloRega,
  janelaColheita,
  janelaGerminacao,
  lerPrevisao,
  paraDia,
  proximaRega,
  somarDias,
  tarefasDoDia,
  urlPrevisao,
  type Especie,
  type Local,
  type Plantio,
} from '../src';

const especie = (id: string): Especie => {
  const e = CATALOGO.find((x) => x.id === id);
  if (!e) throw new Error(`sem ${id}`);
  return e;
};

const canteiro: Local = { id: 'l1', tipo: 'canteiro', interno: false };
const vasoPequeno: Local = { id: 'l2', tipo: 'vaso', interno: false, volumeLitros: 4, material: 'barro' };
const vasoInterno: Local = { id: 'l3', tipo: 'vaso', interno: true, volumeLitros: 10 };

describe('datas', () => {
  it('soma e conta dias sem depender de fuso', () => {
    expect(somarDias('2026-02-28', 1)).toBe('2026-03-01');
    expect(somarDias('2026-12-31', 1)).toBe('2027-01-01');
    expect(diasEntre('2026-11-24', '2026-12-01')).toBe(7);
  });

  it('rejeita datas inválidas', () => {
    expect(() => paraDia('2026-02-30')).toThrow(RangeError);
    expect(() => paraDia('24/11/2026')).toThrow(RangeError);
  });
});

describe('catálogo', () => {
  it('tem as 13 espécies da base, todas com fases ordenadas', () => {
    expect(CATALOGO).toHaveLength(13);
    for (const e of CATALOGO) {
      expect(e.fases.length).toBeGreaterThan(0);
      const ordens = e.fases.map((f) => f.ordem);
      expect(ordens).toEqual([...ordens].sort((a, b) => a - b));
      expect(e.regaAdultaIntervaloDias.min).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('fase atual', () => {
  const tomate = especie('tomate');
  const semente: Plantio = { id: 'p', especieId: 'tomate', localId: 'l1', origem: 'semente', dataPlantio: '2026-11-01' };

  it('segue o calendário da base a partir da data de plantio', () => {
    expect(faseAtual(semente, tomate, '2026-11-01').nome).toBe('germinação');
    expect(faseAtual(semente, tomate, '2026-11-20').nome).toBe('muda');
    expect(faseAtual(semente, tomate, '2026-12-15').nome).toBe('vegetativo');
  });

  it('muda comprada já começa como planta formada', () => {
    const muda: Plantio = { ...semente, origem: 'muda' };
    expect(faseAtual(muda, tomate, '2026-11-01').nome).toBe('vegetativo');
  });

  it('confirmação do usuário reancora o ciclo', () => {
    // Germinou cedo: no dia 3 já virou muda.
    const confirmado: Plantio = { ...semente, confirmacoes: [{ fase: 'muda', data: '2026-11-04' }] };
    expect(faseAtual(confirmado, tomate, '2026-11-05').nome).toBe('muda');
  });

  it('fase sem dia de início só começa por confirmação', () => {
    const manjericao = especie('manjericao');
    const p: Plantio = { id: 'm', especieId: 'manjericao', localId: 'l1', origem: 'semente', dataPlantio: '2026-01-01' };
    expect(faseAtual(p, manjericao, '2026-11-01').nome).toBe('vegetativo');
    const colhendo: Plantio = { ...p, confirmacoes: [{ fase: 'colheita', data: '2026-10-01' }] };
    expect(faseAtual(colhendo, manjericao, '2026-11-01').nome).toBe('colheita');
  });
});

describe('intervalo de rega', () => {
  const faixa = { min: 2, max: 3 };

  it('usa o meio da faixa em canteiro sem clima', () => {
    expect(intervaloRega(faixa, canteiro).dias).toBe(3); // 2,5 arredonda para 3
  });

  it('vaso pequeno de barro seca mais rápido, sem sair da faixa', () => {
    expect(intervaloRega(faixa, vasoPequeno).dias).toBe(2);
  });

  it('calor forte antecipa e explica o motivo', () => {
    const r = intervaloRega(faixa, canteiro, { data: '2026-11-24', chuvaMm: 0, tempMaxC: 35 });
    expect(r.dias).toBe(2);
    expect(r.ajustes[0]).toMatch(/Calor/);
  });

  it('clima não afeta plantas dentro de casa', () => {
    const r = intervaloRega(faixa, vasoInterno, { data: '2026-11-24', chuvaMm: 0, tempMaxC: 35 });
    expect(r.ajustes).toEqual([]);
  });
});

describe('próxima rega', () => {
  const tomate = especie('tomate');
  const vegetativo = tomate.fases.find((f) => f.nome === 'vegetativo')!;
  const base = { especie: tomate, fase: vegetativo, dataPlantio: '2026-10-01', hoje: '2026-11-24' };

  it('conta a partir da última rega real', () => {
    const r = proximaRega({ ...base, local: canteiro, ultimaRega: '2026-11-23' });
    expect(r.devidaEm).toBe('2026-11-26');
    expect(r.atrasada).toBe(false);
  });

  it('sem nenhuma rega registrada, pede rega desde o plantio e marca atraso', () => {
    const r = proximaRega({ ...base, local: canteiro, ultimaRega: null });
    expect(r.devidaEm).toBe('2026-10-01');
    expect(r.atrasada).toBe(true);
  });

  it('chuva prevista adia a rega de planta ao ar livre para amanhã', () => {
    const r = proximaRega({
      ...base,
      local: canteiro,
      ultimaRega: '2026-11-21',
      previsaoHoje: { data: '2026-11-24', chuvaMm: 12, tempMaxC: 24 },
    });
    expect(r.devidaEm).toBe('2026-11-25');
    expect(r.ajustes.join(' ')).toMatch(/Chuva prevista de 12 mm/);
  });

  it('chuva não adia rega de vaso dentro de casa', () => {
    const r = proximaRega({
      ...base,
      local: vasoInterno,
      ultimaRega: '2026-11-21',
      previsaoHoje: { data: '2026-11-24', chuvaMm: 12, tempMaxC: 24 },
    });
    expect(r.devidaEm).toBe('2026-11-23'); // vaso de 10 L: 2 dias
    expect(r.atrasada).toBe(true);
    expect(r.ajustes).toEqual([]);
  });

  it('na sementeira lembra todo dia', () => {
    const germ = tomate.fases.find((f) => f.nome === 'germinação')!;
    const r = proximaRega({ ...base, fase: germ, local: canteiro, ultimaRega: '2026-11-23' });
    expect(r.devidaEm).toBe('2026-11-24');
  });
});

describe('previsões de germinação e colheita', () => {
  const alface = especie('alface');
  const p: Plantio = { id: 'a', especieId: 'alface', localId: 'l1', origem: 'semente', dataPlantio: '2026-11-01' };

  it('calcula as janelas a partir da data de plantio', () => {
    expect(janelaGerminacao(p, alface)).toEqual({ inicio: '2026-11-05', fim: '2026-11-08' });
    expect(janelaColheita(p, alface)).toEqual({ inicio: '2026-12-31', fim: '2027-01-30' });
  });

  it('muda não tem janela de germinação', () => {
    expect(janelaGerminacao({ ...p, origem: 'muda' }, alface)).toBeNull();
  });
});

describe('tarefas do dia', () => {
  const especies = new Map(CATALOGO.map((e) => [e.id, e]));
  const locais = new Map([canteiro, vasoPequeno].map((l) => [l.id, l]));

  it('junta rega, verificação de germinação e aviso de colheita', () => {
    const plantios: Plantio[] = [
      { id: 'rabanete', especieId: 'rabanete', localId: 'l2', origem: 'semente', dataPlantio: '2026-11-20' },
      { id: 'alface', especieId: 'alface', localId: 'l1', origem: 'muda', dataPlantio: '2026-09-30' },
    ];
    const tarefas = tarefasDoDia({
      plantios,
      especies,
      locais,
      registros: [
        { plantioId: 'rabanete', tipo: 'rega', data: '2026-11-23' },
        { plantioId: 'alface', tipo: 'rega', data: '2026-11-24' },
      ],
      hoje: '2026-11-24',
    });
    const resumo = tarefas.map((t) => `${t.plantioId}:${t.tipo}`);
    expect(resumo).toContain('rabanete:rega');
    expect(resumo).toContain('rabanete:verificar-germinacao');
    expect(resumo).toContain('alface:colheita-proxima');
    expect(resumo).not.toContain('alface:rega');
  });

  it('tira o aviso de colheita depois que a pessoa registra que colheu', () => {
    const alface: Plantio = { id: 'alface', especieId: 'alface', localId: 'l1', origem: 'muda', dataPlantio: '2026-09-30' };
    const colheitas = (registros: { plantioId: string; tipo: 'rega' | 'colheita'; data: string }[]) =>
      tarefasDoDia({ plantios: [alface], especies, locais, registros, hoje: '2026-12-01' })
        .filter((t) => t.tipo === 'colheita' || t.tipo === 'colheita-proxima')
        .map((t) => t.tipo);
    const regada = { plantioId: 'alface', tipo: 'rega' as const, data: '2026-12-01' };
    expect(colheitas([regada])).toEqual(['colheita']);
    expect(colheitas([regada, { plantioId: 'alface', tipo: 'colheita', data: '2026-12-01' }])).toEqual([]);
    // Colheita registrada muito antes da janela não conta.
    expect(colheitas([regada, { plantioId: 'alface', tipo: 'colheita', data: '2026-10-15' }])).toEqual(['colheita']);
  });

  it('avisa germinação atrasada e não promete colheita de semente que não nasceu', () => {
    const tarefas = tarefasDoDia({
      plantios: [{ id: 'r', especieId: 'rabanete', localId: 'l1', origem: 'semente', dataPlantio: '2026-11-01' }],
      especies,
      locais,
      registros: [{ plantioId: 'r', tipo: 'rega', data: '2026-11-24' }],
      hoje: '2026-11-24',
    });
    expect(tarefas.map((t) => t.tipo)).toEqual(['germinacao-atrasada']);
  });

  it('ignora plantios com data no futuro', () => {
    const tarefas = tarefasDoDia({
      plantios: [{ id: 'f', especieId: 'alface', localId: 'l1', origem: 'semente', dataPlantio: '2026-12-01' }],
      especies,
      locais,
      registros: [],
      hoje: '2026-11-24',
    });
    expect(tarefas).toEqual([]);
  });
});

describe('clima (Open-Meteo)', () => {
  it('arredonda coordenadas antes de enviar', () => {
    const url = new URL(urlPrevisao(-23.55052, -46.633308));
    expect(url.searchParams.get('latitude')).toBe('-23.55');
    expect(url.searchParams.get('longitude')).toBe('-46.63');
  });

  it('rejeita coordenadas fora do intervalo', () => {
    expect(() => urlPrevisao(100, 0)).toThrow(RangeError);
  });

  it('valida a resposta e descarta dias sem dado', () => {
    const previsao = lerPrevisao({
      daily: {
        time: ['2026-11-24', '2026-11-25'],
        precipitation_sum: [3.2, null],
        temperature_2m_max: [29.1, 30],
      },
    });
    expect(previsao).toEqual([{ data: '2026-11-24', chuvaMm: 3.2, tempMaxC: 29.1 }]);
  });

  it('recusa resposta malformada', () => {
    expect(() => lerPrevisao({ daily: { time: ['ontem'] } })).toThrow();
  });
});
