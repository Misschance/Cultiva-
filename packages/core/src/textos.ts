import type { Especie, Tarefa, TipoTarefa } from './tipos';

const TITULOS: Record<TipoTarefa, string> = {
  rega: 'Regar',
  'verificar-germinacao': 'Já germinou?',
  'germinacao-atrasada': 'Germinação atrasada',
  'colheita-proxima': 'Colheita chegando',
  colheita: 'Hora de colher',
};

export function tituloTarefa(tipo: TipoTarefa): string {
  return TITULOS[tipo];
}

/** Frase curta para a tela Hoje e para a notificação. */
export function descreverTarefa(tarefa: Tarefa, especie: Especie, apelido?: string | null): string {
  const nome = apelido?.trim() || especie.nomePopular;
  switch (tarefa.tipo) {
    case 'rega':
      return tarefa.atrasada ? `Regar ${nome} (atrasada)` : `Regar ${nome}`;
    case 'verificar-germinacao':
      return `Confira se ${nome} já germinou`;
    case 'germinacao-atrasada':
      return `${nome} ainda não germinou: confira as causas prováveis`;
    case 'colheita-proxima':
      return `${nome}: colheita em até 7 dias`;
    case 'colheita':
      return `${nome} está no ponto de colher`;
  }
}

/** Causas comuns de falha na germinação, para a tarefa "germinação atrasada". */
export const CAUSAS_GERMINACAO = [
  'Semente velha ou guardada no calor ou na umidade.',
  'Terra seca demais, ou encharcada, nos primeiros dias.',
  'Semente enterrada fundo demais.',
  'Temperatura fora da faixa da espécie.',
];
