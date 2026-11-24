import { somarDias } from './datas';
import type { DataISO, Especie, Plantio } from './tipos';

export interface Janela {
  inicio: DataISO;
  fim: DataISO;
}

/** Janela em que a semente deve germinar. Só existe para plantios de semente. */
export function janelaGerminacao(plantio: Plantio, especie: Especie): Janela | null {
  if (plantio.origem !== 'semente' || !especie.germinacaoDias) return null;
  return {
    inicio: somarDias(plantio.dataPlantio, especie.germinacaoDias.min),
    fim: somarDias(plantio.dataPlantio, especie.germinacaoDias.max),
  };
}

/**
 * Janela de início da colheita. A base conta os dias a partir da semeadura
 * ou do plantio da muda (data/base-plantas/legenda.csv), então vale para as duas origens.
 */
export function janelaColheita(plantio: Plantio, especie: Especie): Janela | null {
  if (!especie.colheitaInicioDias) return null;
  return {
    inicio: somarDias(plantio.dataPlantio, especie.colheitaInicioDias.min),
    fim: somarDias(plantio.dataPlantio, especie.colheitaInicioDias.max),
  };
}
