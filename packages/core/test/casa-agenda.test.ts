import { describe, expect, it } from 'vitest';
import {
  PLANTAS_DE_CASA,
  conferenciasDoDia,
  descreverConferencia,
  situacaoDaCasa,
  type MinhaPlantaDeCasa,
  type PlantaDeCasa,
  type RegistroCasa,
} from '../src';

const catalogo = new Map(PLANTAS_DE_CASA.map((p) => [p.id, p]));
const planta = (id: string): PlantaDeCasa => {
  const p = catalogo.get(id);
  if (!p) throw new Error(`sem ${id}`);
  return p;
};
const minha = (id: string, plantaId: string, desde = '2026-11-01', apelido: string | null = null): MinhaPlantaDeCasa => ({
  id,
  plantaId,
  apelido,
  comodo: null,
  desde,
});

describe('agenda das plantas de casa', () => {
  it('conta o intervalo a partir do cadastro e avisa no dia certo', () => {
    // Zamioculca no crescimento (nov): 15 dias, com fonte.
    const z = minha('a', 'zamioculca');
    const antes = situacaoDaCasa(z, planta('zamioculca'), [], '2026-11-15');
    expect(antes.proximaConferencia).toBe('2026-11-16');
    expect(antes.atraso).toBeNull();
    expect(antes.intervaloComFonte).toBe(true);
    const noDia = situacaoDaCasa(z, planta('zamioculca'), [], '2026-11-16');
    expect(noDia.atraso).toBe(0);
    expect(situacaoDaCasa(z, planta('zamioculca'), [], '2026-11-20').atraso).toBe(4);
  });

  it('conferir ou regar zera a contagem; adubar não', () => {
    const z = minha('a', 'zamioculca');
    const registros: RegistroCasa[] = [
      { plantaCasaId: 'a', tipo: 'conferir', data: '2026-11-10' },
      { plantaCasaId: 'a', tipo: 'adubo', data: '2026-11-20' },
    ];
    const s = situacaoDaCasa(z, planta('zamioculca'), registros, '2026-11-20');
    expect(s.ultimoToque).toBe('2026-11-10');
    expect(s.proximaConferencia).toBe('2026-11-25');
    expect(s.ultimoAdubo).toBe('2026-11-20');
    const regada = situacaoDaCasa(z, planta('zamioculca'), [...registros, { plantaCasaId: 'a', tipo: 'rega', data: '2026-11-18' }], '2026-11-20');
    expect(regada.proximaConferencia).toBe('2026-12-03');
  });

  it('ignora registros de outra planta e do futuro', () => {
    const z = minha('a', 'zamioculca');
    const registros: RegistroCasa[] = [
      { plantaCasaId: 'b', tipo: 'conferir', data: '2026-11-15' },
      { plantaCasaId: 'a', tipo: 'conferir', data: '2026-12-30' },
    ];
    expect(situacaoDaCasa(z, planta('zamioculca'), registros, '2026-11-20').ultimoToque).toBe('2026-11-01');
  });

  it('intervalo sem fonte vira só estimativa de lembrete', () => {
    const s = situacaoDaCasa(minha('j', 'jiboia'), planta('jiboia'), [], '2026-11-08');
    expect(s.intervaloDias).toBe(7);
    expect(s.intervaloComFonte).toBe(false);
    expect(s.atraso).toBe(0);
  });

  it('usa o intervalo de repouso no inverno do Sul e de crescimento no Nordeste', () => {
    const e = minha('e', 'espada_sao_jorge', '2026-06-01');
    expect(situacaoDaCasa(e, planta('espada_sao_jorge'), [], '2026-06-10', 'Sul').intervaloDias).toBe(30);
    expect(situacaoDaCasa(e, planta('espada_sao_jorge'), [], '2026-06-10', 'Nordeste').intervaloDias).toBe(14);
  });

  it('recusa planta que não confere com o catálogo', () => {
    expect(() => situacaoDaCasa(minha('a', 'jiboia'), planta('cacto'), [], '2026-11-20')).toThrow();
  });

  it('lista as conferências do dia, as mais atrasadas primeiro, e pula ids fora do catálogo', () => {
    const minhas = [
      minha('z', 'zamioculca', '2026-11-01'),
      minha('l', 'lirio_da_paz', '2026-11-10'),
      minha('o', 'orquidea', '2026-11-19'),
      minha('x', 'planta_que_nao_existe'),
    ];
    const hoje = conferenciasDoDia(minhas, catalogo, [], '2026-11-20');
    expect(hoje.map((s) => s.minha.id)).toEqual(['l', 'z']);
    expect(hoje[0]!.atraso).toBe(7);
  });

  it('o lembrete fala em tocar na terra, nunca em regar', () => {
    const s = situacaoDaCasa(minha('j', 'jiboia', '2026-11-01', 'Jiboia da sala'), planta('jiboia'), [], '2026-11-08');
    const frase = descreverConferencia(s);
    expect(frase).toBe('Toque na terra: Jiboia da sala (jiboia)');
    expect(frase).not.toMatch(/regar|regue/i);
  });
});
