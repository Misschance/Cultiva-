import { deDia, paraDia } from './datas';
import { colheitaIncerta, janelaColheita } from './previsao';
import type { DataISO, Especie, Plantio } from './tipos';

/** Segunda-feira da semana de `data`. 1970-01-01 (dia 0) foi uma quinta. */
export function inicioDaSemana(data: DataISO): DataISO {
  const dia = paraDia(data);
  return deDia(dia - ((dia + 3) % 7));
}

export interface ItemPlanejamento {
  plantio: Plantio;
  especie: Especie;
  /** Quantidade de pés do plantio. */
  quantidade: number;
}

export interface ColheitaNaSemana {
  plantioId: string;
  especieId: string;
  quantidade: number;
  /** A janela de início da colheita abre nesta semana (e não numa anterior). */
  abreNestaSemana: boolean;
}

export interface SemanaColheita {
  inicio: DataISO;
  fim: DataISO;
  colheitas: ColheitaNaSemana[];
  /** Soma de pés por espécie, para planejar a produção (RF-4.5). */
  porEspecie: { especieId: string; quantidade: number }[];
}

/**
 * Calendário de colheitas por semana (RF-4.5), a partir da semana de `hoje`.
 * Um plantio aparece em toda semana que cruza a sua janela de início da colheita.
 * Plantios cuja germinação passou do prazo sem confirmação ficam de fora.
 */
export function calendarioColheitas(itens: ItemPlanejamento[], hoje: DataISO, semanas = 12): SemanaColheita[] {
  const primeira = paraDia(inicioDaSemana(hoje));
  const janelas = itens.flatMap((item) => {
    if (colheitaIncerta(item.plantio, item.especie, hoje)) return [];
    const j = janelaColheita(item.plantio, item.especie);
    return j ? [{ item, inicio: paraDia(j.inicio), fim: paraDia(j.fim) }] : [];
  });

  const resultado: SemanaColheita[] = [];
  for (let s = 0; s < semanas; s++) {
    const ini = primeira + s * 7;
    const fim = ini + 6;
    const colheitas = janelas
      .filter((j) => j.inicio <= fim && j.fim >= ini)
      .sort((a, b) => a.inicio - b.inicio || a.item.especie.nomePopular.localeCompare(b.item.especie.nomePopular, 'pt-BR'))
      .map((j) => ({
        plantioId: j.item.plantio.id,
        especieId: j.item.especie.id,
        quantidade: j.item.quantidade,
        abreNestaSemana: j.inicio >= ini,
      }));
    const soma = new Map<string, number>();
    for (const c of colheitas) soma.set(c.especieId, (soma.get(c.especieId) ?? 0) + c.quantidade);
    resultado.push({
      inicio: deDia(ini),
      fim: deDia(fim),
      colheitas,
      porEspecie: [...soma].map(([especieId, quantidade]) => ({ especieId, quantidade })),
    });
  }
  return resultado;
}
