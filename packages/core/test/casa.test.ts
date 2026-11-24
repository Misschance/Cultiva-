import { describe, expect, it } from 'vitest';
import { PLANTAS_DE_CASA, conferirTerraComFonte, estacaoDaCasa, resumoPets, toxicidadeAlta, type PlantaDeCasa } from '../src';

const planta = (id: string): PlantaDeCasa => {
  const p = PLANTAS_DE_CASA.find((x) => x.id === id);
  if (!p) throw new Error(`sem ${id}`);
  return p;
};

describe('plantas de casa', () => {
  it('carrega a base v2 com as duas estações de cada planta', () => {
    expect(PLANTAS_DE_CASA.length).toBeGreaterThanOrEqual(13);
    for (const p of PLANTAS_DE_CASA) expect(p.estacoes.map((e) => e.estacao).sort()).toEqual(['crescimento', 'repouso']);
  });

  it('usa crescimento de setembro a março e repouso de abril a agosto', () => {
    const j = planta('jiboia');
    expect(estacaoDaCasa(j, '2026-11-24').estacao).toBe('crescimento');
    expect(estacaoDaCasa(j, '2026-03-31').estacao).toBe('crescimento');
    expect(estacaoDaCasa(j, '2026-06-15').estacao).toBe('repouso');
    // Norte e Nordeste sem inverno marcado: crescimento o ano todo.
    expect(estacaoDaCasa(j, '2026-06-15', 'Nordeste').estacao).toBe('crescimento');
  });

  it('nunca diz que é segura para pets quando falta dado', () => {
    expect(resumoPets(planta('cacto')).situacao).toBe('sem-dado');
    expect(resumoPets(planta('jiboia'))).toEqual({ situacao: 'toxica', texto: 'Tóxica para cães e gatos' });
    expect(resumoPets(planta('clorofito')).situacao).toBe('segura');
    expect(resumoPets(planta('suculentas')).texto).toContain('echevéria');
  });

  it('destaca toxicidade alta e só recomenda dias de conferir com fonte', () => {
    expect(toxicidadeAlta(planta('comigo_ninguem_pode'))).toBe(true);
    expect(toxicidadeAlta(planta('clorofito'))).toBe(false);
    const jiboia = estacaoDaCasa(planta('jiboia'), '2026-11-24');
    expect(jiboia.verificarConfianca).toBe('C');
    expect(conferirTerraComFonte(jiboia)).toBeNull();
  });
});
