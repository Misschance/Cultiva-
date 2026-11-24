import { describe, expect, it } from 'vitest';
import {
  CATALOGO,
  calendarioDoMes,
  diaDaSemana,
  diasDoMes,
  gradeDoMes,
  mesDe,
  somarMeses,
  type Especie,
  type Local,
  type Plantio,
  type RegistroAcao,
} from '../src';

const especies = new Map<string, Especie>(CATALOGO.map((e) => [e.id, e]));
const alface = especies.get('alface')!;
const canteiro: Local = { id: 'l1', tipo: 'canteiro', interno: false };
const locais = new Map([[canteiro.id, canteiro]]);
const plantio: Plantio = { id: 'p1', especieId: 'alface', localId: 'l1', origem: 'semente', dataPlantio: '2026-11-03' };

const dia = (cal: ReturnType<typeof calendarioDoMes>, data: string) => cal.find((d) => d.data === data)!.eventos;

describe('meses e grade', () => {
  it('soma meses atravessando o ano', () => {
    expect(somarMeses('2026-11', 2)).toBe('2027-01');
    expect(somarMeses('2026-01', -1)).toBe('2025-12');
    expect(mesDe('2026-11-24')).toBe('2026-11');
  });

  it('conhece o tamanho de cada mês, inclusive fevereiro bissexto', () => {
    expect(diasDoMes('2026-11')).toHaveLength(30);
    expect(diasDoMes('2028-02')).toHaveLength(29);
    expect(() => diasDoMes('2026-13')).toThrow();
  });

  it('monta a grade de domingo a sábado', () => {
    expect(diaDaSemana('2026-11-01')).toBe(0); // domingo
    const grade = gradeDoMes('2026-11');
    expect(grade[0]![0]).toBe('2026-11-01');
    expect(grade.every((s) => s.length === 7)).toBe(true);
    const dezembro = gradeDoMes('2026-12');
    expect(dezembro[0]!.slice(0, 2)).toEqual([null, null]); // 01/12/2026 é terça
  });
});

describe('calendário do mês', () => {
  const base = { plantios: [plantio], especies, locais, registros: [] as RegistroAcao[], hoje: '2026-11-24' };

  it('mostra o plantio, a germinação esperada e as ações registradas', () => {
    const registros: RegistroAcao[] = [{ plantioId: 'p1', tipo: 'adubacao', data: '2026-11-10' }];
    const cal = calendarioDoMes({ ...base, registros, mes: '2026-11' });
    expect(dia(cal, '2026-11-03').map((e) => e.tipo)).toContain('plantio');
    expect(dia(cal, `2026-11-${String(3 + alface.germinacaoDias!.min).padStart(2, '0')}`).map((e) => e.tipo)).toContain('germinacao');
    expect(dia(cal, '2026-11-10')).toContainEqual({ data: '2026-11-10', plantioId: 'p1', tipo: 'feito', acao: 'adubacao' });
  });

  it('prevê regas só de hoje em diante, a partir da última rega real', () => {
    const registros: RegistroAcao[] = [{ plantioId: 'p1', tipo: 'rega', data: '2026-11-24' }];
    const cal = calendarioDoMes({ ...base, registros, mes: '2026-11' });
    const previstas = cal.flatMap((d) => d.eventos).filter((e) => e.tipo === 'rega-prevista');
    expect(previstas.length).toBeGreaterThan(0);
    expect(previstas.every((e) => e.data > '2026-11-24')).toBe(true);
    expect(dia(cal, '2026-11-20').some((e) => e.tipo === 'rega-prevista')).toBe(false);
  });

  it('marca o início da janela de colheita e não prevê regas além do horizonte', () => {
    const inicio = alface.colheitaInicioDias!.min;
    const data = new Date(Date.parse('2026-11-03T00:00:00Z') + inicio * 86_400_000).toISOString().slice(0, 10);
    const muda: Plantio = { ...plantio, origem: 'muda' };
    const cal = calendarioDoMes({ ...base, plantios: [muda], mes: mesDe(data) });
    expect(dia(cal, data).some((e) => e.tipo === 'colheita-prevista')).toBe(true);
    // Semente que passou da janela sem germinar: a colheita fica incerta e não vai para o calendário.
    const incerto = calendarioDoMes({ ...base, mes: mesDe(data) });
    expect(dia(incerto, data).some((e) => e.tipo === 'colheita-prevista')).toBe(false);
    const longe = calendarioDoMes({ ...base, mes: '2027-06' });
    expect(longe.flatMap((d) => d.eventos).some((e) => e.tipo === 'rega-prevista')).toBe(false);
  });

  it('avisa quando a planta muda de fase', () => {
    const cal = calendarioDoMes({ ...base, mes: '2026-11' });
    const fases = cal.flatMap((d) => d.eventos).filter((e) => e.tipo === 'fase');
    expect(fases.length).toBeGreaterThan(0);
    expect(fases.every((e) => e.fase && e.fase !== 'colheita')).toBe(true);
  });
});
