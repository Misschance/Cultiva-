import { paraDia, somarDias } from './datas';
import { germinacaoConfirmada } from './fases';
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

/** Data em que o usuário confirmou que a semente germinou (a primeira fase depois da germinação). */
export function dataDaGerminacao(plantio: Plantio, especie: Especie): DataISO | null {
  const germinacao = especie.fases.find((f) => f.nome === 'germinação');
  if (!germinacao) return null;
  const datas = (plantio.confirmacoes ?? [])
    .filter((c) => {
      const fase = especie.fases.find((f) => f.nome === c.fase);
      return fase !== undefined && fase.ordem > germinacao.ordem;
    })
    .map((c) => c.data)
    .sort((a, b) => paraDia(a) - paraDia(b));
  return datas[0] ?? null;
}

/**
 * Janela de início da colheita. A base conta os dias a partir da semeadura
 * ou do plantio da muda (data/base-plantas/legenda.csv), então vale para as duas origens.
 *
 * Se a germinação foi confirmada fora da janela esperada, a colheita anda junto (RF-4.2):
 * germinou 3 dias depois do prazo, a colheita vem 3 dias depois. Dentro da janela, nada muda,
 * porque a faixa da base já cobre essa variação.
 */
export function janelaColheita(plantio: Plantio, especie: Especie): Janela | null {
  if (!especie.colheitaInicioDias) return null;
  let desvio = 0;
  const germ = janelaGerminacao(plantio, especie);
  const germinou = germ ? dataDaGerminacao(plantio, especie) : null;
  if (germ && germinou) {
    const d = paraDia(germinou);
    if (d > paraDia(germ.fim)) desvio = d - paraDia(germ.fim);
    else if (d < paraDia(germ.inicio)) desvio = d - paraDia(germ.inicio);
  }
  return {
    inicio: somarDias(plantio.dataPlantio, especie.colheitaInicioDias.min + desvio),
    fim: somarDias(plantio.dataPlantio, especie.colheitaInicioDias.max + desvio),
  };
}

/** A janela de germinação passou e o usuário não confirmou: não dá para prever colheita. */
export function colheitaIncerta(plantio: Plantio, especie: Especie, hoje: DataISO): boolean {
  const germ = janelaGerminacao(plantio, especie);
  if (!germ || germinacaoConfirmada(plantio, especie)) return false;
  return paraDia(hoje) > paraDia(germ.fim);
}
