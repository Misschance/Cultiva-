import { maisRecente, paraDia, somarDias } from './datas';
import { faseAtual, germinacaoConfirmada } from './fases';
import { colheitaIncerta, janelaColheita, janelaGerminacao } from './previsao';
import { proximaRega } from './rega';
import type { DataISO, Especie, Local, Plantio, PrevisaoDia, RegistroAcao, Tarefa } from './tipos';

/** Dias de antecedência do aviso de colheita próxima (RF-4.4). */
export const AVISO_COLHEITA_DIAS = 7;

export interface EntradaAgenda {
  plantios: Plantio[];
  especies: Map<string, Especie>;
  locais: Map<string, Local>;
  registros: RegistroAcao[];
  /** Previsão por local para hoje. */
  previsaoHoje?: Map<string, PrevisaoDia>;
  hoje: DataISO;
}

/** Tarefas de hoje (e atrasadas) de todos os plantios: a tela "Hoje" (RF-0.3). */
export function tarefasDoDia(e: EntradaAgenda): Tarefa[] {
  const hoje = paraDia(e.hoje);
  const tarefas: Tarefa[] = [];

  for (const plantio of e.plantios) {
    const especie = e.especies.get(plantio.especieId);
    const local = e.locais.get(plantio.localId);
    if (!especie || !local) continue;
    if (paraDia(plantio.dataPlantio) > hoje) continue;

    const fase = faseAtual(plantio, especie, e.hoje);
    const regas = e.registros
      .filter((r) => r.plantioId === plantio.id && r.tipo === 'rega' && paraDia(r.data) <= hoje)
      .map((r) => r.data);
    const rega = proximaRega({
      especie,
      fase,
      local,
      dataPlantio: plantio.dataPlantio,
      ultimaRega: maisRecente(regas),
      hoje: e.hoje,
      previsaoHoje: e.previsaoHoje?.get(local.id),
    });
    if (paraDia(rega.devidaEm) <= hoje) {
      tarefas.push({ plantioId: plantio.id, tipo: 'rega', devidaEm: rega.devidaEm, atrasada: rega.atrasada, ajustes: rega.ajustes });
    }

    const germ = janelaGerminacao(plantio, especie);
    const aguardandoGerminacao = germ !== null && !germinacaoConfirmada(plantio, especie);
    if (germ && aguardandoGerminacao) {
      if (hoje > paraDia(germ.fim)) {
        tarefas.push({ plantioId: plantio.id, tipo: 'germinacao-atrasada', devidaEm: germ.fim, atrasada: true, ajustes: [] });
      } else if (hoje >= paraDia(germ.inicio)) {
        tarefas.push({ plantioId: plantio.id, tipo: 'verificar-germinacao', devidaEm: germ.inicio, atrasada: false, ajustes: [] });
      }
    }

    // Se a janela de germinação passou sem confirmação, não há colheita a anunciar.
    const colheita = colheitaIncerta(plantio, especie, e.hoje) ? null : janelaColheita(plantio, especie);
    if (colheita) {
      const inicio = paraDia(colheita.inicio);
      if (hoje >= inicio && hoje <= paraDia(colheita.fim)) {
        tarefas.push({ plantioId: plantio.id, tipo: 'colheita', devidaEm: colheita.inicio, atrasada: false, ajustes: [] });
      } else if (hoje < inicio && hoje >= inicio - AVISO_COLHEITA_DIAS) {
        tarefas.push({
          plantioId: plantio.id,
          tipo: 'colheita-proxima',
          devidaEm: somarDias(colheita.inicio, -AVISO_COLHEITA_DIAS),
          atrasada: false,
          ajustes: [],
        });
      }
    }
  }

  return tarefas.sort((a, b) => paraDia(a.devidaEm) - paraDia(b.devidaEm));
}
