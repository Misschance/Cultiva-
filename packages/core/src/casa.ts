import { paraDia } from './datas';
import type { DataISO, EstacaoCasa, LuzCasa, PlantaDeCasa, Regiao } from './tipos';

export const NOME_LUZ_CASA: Record<LuzCasa, string> = {
  sol_direto: 'Sol direto',
  indireta_forte: 'Luz clara, sem sol direto',
  meia_sombra: 'Meia-sombra',
  pouca_luz: 'Aguenta pouca luz',
};

/**
 * Estação de cuidado no Brasil: crescimento de setembro a março, repouso de abril a agosto.
 * No Norte e no Nordeste, sem inverno marcado, vale o crescimento o ano todo (legenda da base v2).
 */
export function estacaoDaCasa(planta: PlantaDeCasa, data: DataISO, regiao?: Regiao | null): EstacaoCasa {
  paraDia(data);
  const mes = Number(data.slice(5, 7));
  const crescimento = regiao === 'Norte' || regiao === 'Nordeste' || mes >= 9 || mes <= 3;
  const alvo = crescimento ? 'crescimento' : 'repouso';
  const e = planta.estacoes.find((x) => x.estacao === alvo);
  if (!e) throw new Error(`${planta.id} sem estação ${alvo}`);
  return e;
}

export type SituacaoPet = 'toxica' | 'segura' | 'sem-dado';

export interface ResumoPets {
  situacao: SituacaoPet;
  texto: string;
}

/**
 * Resumo para quem tem cão ou gato. Sem dado na fonte nunca vira "não tóxica":
 * fica "sem informação". Se for tóxica para um dos dois, a planta conta como tóxica.
 */
export function resumoPets(planta: PlantaDeCasa): ResumoPets {
  const { caes, gatos } = planta.toxicidade;
  if (caes?.toxica || gatos?.toxica) {
    const quem = caes?.toxica && gatos?.toxica ? 'cães e gatos' : caes?.toxica ? 'cães' : 'gatos';
    return { situacao: 'toxica', texto: `Tóxica para ${quem}` };
  }
  if (caes && gatos) {
    const nota = [caes.nota, gatos.nota].find(Boolean);
    return { situacao: 'segura', texto: `Não tóxica para cães e gatos${nota ? ` (${nota})` : ''}` };
  }
  return { situacao: 'sem-dado', texto: 'Sem informação sobre pets' };
}

/** Toxicidade alta para pessoas pede destaque na ficha (ex.: comigo-ninguém-pode). */
export function toxicidadeAlta(planta: PlantaDeCasa): boolean {
  return /\balta\b/i.test(planta.toxicidade.gravidadeHumanos ?? '');
}

/** Dias de conferir a terra que podem aparecer como recomendação: só com fonte lida (A). */
export function conferirTerraComFonte(e: EstacaoCasa): number | null {
  return e.verificarConfianca === 'A' ? e.verificarTerraDias : null;
}
