import {
  diasEntre,
  estaComSede,
  estadoVisual,
  faseAtual,
  janelaColheita,
  plantadaNoChao,
  type DataISO,
  type Especie,
  type EstadoVisual,
  type Tarefa,
} from '@cultivae/core';
import type { LocalComNome, PlantioCompleto } from './dados';

export interface ResumoPlanta {
  nome: string;
  visual: EstadoVisual;
  fase: string;
  sede: boolean;
  chao: boolean;
  selo: { texto: string; alerta: boolean };
  rega: string;
  sol: string;
  colheita: string;
}

/** Junta o que a tela precisa para mostrar uma planta viva e seus status básicos. */
export function resumirPlanta(
  plantio: PlantioCompleto,
  especie: Especie,
  local: LocalComNome | undefined,
  tarefas: readonly Tarefa[],
  hoje: DataISO,
): ResumoPlanta {
  const visual = estadoVisual(plantio, especie, hoje);
  const fase = faseAtual(plantio, especie, hoje).nome;
  const sede = estaComSede(tarefas, plantio.id);
  const regaHoje = tarefas.some((t) => t.plantioId === plantio.id && t.tipo === 'rega');
  const janela = janelaColheita(plantio, especie);

  let colheita = '—';
  if (janela && visual.progresso !== null) {
    const faltam = diasEntre(hoje, janela.inicio);
    colheita = faltam <= 0 ? 'Agora' : faltam === 1 ? 'Amanhã' : `${faltam} dias`;
  }

  const selo = sede
    ? { texto: 'Com sede', alerta: true }
    : visual.estagio === 'colheita'
      ? { texto: 'Pronta para colher', alerta: false }
      : visual.estagio === 'broto'
        ? { texto: 'Germinando', alerta: false }
        : { texto: visual.estagio === 'folhas' ? 'Primeiras folhas' : 'Crescendo', alerta: false };

  return {
    nome: plantio.apelido || especie.nomePopular,
    visual,
    fase,
    sede,
    chao: local ? plantadaNoChao(local.tipo) : false,
    selo,
    rega: sede ? 'Atrasada' : regaHoje ? 'Hoje' : 'Em dia',
    sol: local?.horasSol != null ? `${String(local.horasSol).replace('.', ',')} h` : '—',
    colheita,
  };
}
