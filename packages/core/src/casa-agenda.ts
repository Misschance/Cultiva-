import { estacaoDaCasa } from './casa';
import { diasEntre, maisRecente, paraDia, somarDias } from './datas';
import type { DataISO, EstacaoCasa, PlantaDeCasa, Regiao } from './tipos';

/**
 * Plantas de casa do usuário (fase 2 das plantas de casa). O app lembra de CONFERIR a terra,
 * nunca de regar: quem decide a rega é o toque na terra, seguindo a regra da ficha.
 */

export type CuidadoCasa = 'conferir' | 'rega' | 'adubo';

export const NOME_CUIDADO_CASA: Record<CuidadoCasa, string> = {
  conferir: 'Conferi a terra',
  rega: 'Reguei',
  adubo: 'Adubei',
};

export interface MinhaPlantaDeCasa {
  id: string;
  plantaId: string;
  apelido: string | null;
  comodo: string | null;
  desde: DataISO;
}

export interface RegistroCasa {
  plantaCasaId: string;
  tipo: CuidadoCasa;
  data: DataISO;
}

export interface SituacaoCasa {
  minha: MinhaPlantaDeCasa;
  planta: PlantaDeCasa;
  estacao: EstacaoCasa;
  /** Dias entre conferências. Null quando a base não traz nenhum número. */
  intervaloDias: number | null;
  /** True só com fonte lida (confiança A). Sem isso o intervalo é uma estimativa para o lembrete. */
  intervaloComFonte: boolean;
  /** Última vez que a terra foi conferida ou a planta regada (ou o dia do cadastro). */
  ultimoToque: DataISO;
  proximaConferencia: DataISO | null;
  /** Dias de atraso da conferência (0 = é hoje). Null se ainda não chegou ou não há intervalo. */
  atraso: number | null;
  ultimoAdubo: DataISO | null;
}

/**
 * Situação de uma planta de casa num dia. Conferir a terra ou regar zera a contagem.
 * Registros posteriores a `hoje` são ignorados, e nada conta antes do cadastro.
 */
export function situacaoDaCasa(
  minha: MinhaPlantaDeCasa,
  planta: PlantaDeCasa,
  registros: RegistroCasa[],
  hoje: DataISO,
  regiao?: Regiao | null,
): SituacaoCasa {
  if (minha.plantaId !== planta.id) throw new Error('Planta de casa não confere com o catálogo.');
  const ate = paraDia(hoje);
  const meus = registros.filter((r) => r.plantaCasaId === minha.id && paraDia(r.data) <= ate);
  const toques = meus.filter((r) => r.tipo !== 'adubo').map((r) => r.data);
  const ultimoToque = maisRecente([minha.desde, ...toques])!;
  const ultimoAdubo = maisRecente(meus.filter((r) => r.tipo === 'adubo').map((r) => r.data));

  const estacao = estacaoDaCasa(planta, hoje, regiao);
  const intervaloDias = estacao.verificarTerraDias;
  const proximaConferencia = intervaloDias ? somarDias(ultimoToque, intervaloDias) : null;
  const falta = proximaConferencia ? diasEntre(hoje, proximaConferencia) : null;

  return {
    minha,
    planta,
    estacao,
    intervaloDias,
    intervaloComFonte: intervaloDias !== null && estacao.verificarConfianca === 'A',
    ultimoToque,
    proximaConferencia,
    atraso: falta !== null && falta <= 0 ? Math.abs(falta) : null,
    ultimoAdubo,
  };
}

/** Plantas de casa com conferência de terra para hoje (ou atrasada), as mais atrasadas primeiro. */
export function conferenciasDoDia(
  minhas: MinhaPlantaDeCasa[],
  catalogo: ReadonlyMap<string, PlantaDeCasa>,
  registros: RegistroCasa[],
  hoje: DataISO,
  regiao?: Regiao | null,
): SituacaoCasa[] {
  return minhas
    .flatMap((m) => {
      const planta = catalogo.get(m.plantaId);
      return planta ? [situacaoDaCasa(m, planta, registros, hoje, regiao)] : [];
    })
    .filter((s) => s.atraso !== null)
    .sort((a, b) => b.atraso! - a.atraso! || a.planta.nomePopular.localeCompare(b.planta.nomePopular, 'pt-BR'));
}

/** Frase do lembrete. Fala em tocar na terra, nunca em "hora de regar". */
export function descreverConferencia(s: SituacaoCasa): string {
  const nome = s.minha.apelido ? `${s.minha.apelido} (${s.planta.nomePopular.toLowerCase()})` : s.planta.nomePopular;
  return `Toque na terra: ${nome}`;
}
