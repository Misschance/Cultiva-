import type { Especie, Local } from './tipos';

/**
 * Orientação de luz solar (P5). Só usa o que a ficha diz: as horas mínimas de sol
 * (luzHorasMin) e se ela aceita meia-sombra (localIdeal). Não há limite inventado
 * para "sombra": se a ficha não diz, o app não diz.
 */
export type SituacaoLuz = 'adequada' | 'aceita-meia-sombra' | 'pouco-sol' | 'sem-dado';

export interface AvaliacaoLuz {
  situacao: SituacaoLuz;
  horasMin: number | null;
  horasLocal: number | null;
}

export function aceitaMeiaSombra(especie: Especie): boolean {
  return especie.localIdeal.toLowerCase().includes('meia-sombra');
}

export function avaliarLuz(especie: Especie, local: Pick<Local, 'horasSol'>): AvaliacaoLuz {
  const horasMin = especie.luzHorasMin;
  const horasLocal = local.horasSol ?? null;
  if (horasMin == null || horasLocal == null) return { situacao: 'sem-dado', horasMin, horasLocal };
  if (horasLocal >= horasMin) return { situacao: 'adequada', horasMin, horasLocal };
  return { situacao: aceitaMeiaSombra(especie) ? 'aceita-meia-sombra' : 'pouco-sol', horasMin, horasLocal };
}

/** Frase para o usuário; null quando não há o que avisar. */
export function mensagemLuz(especie: Especie, nomeLocal: string, a: AvaliacaoLuz): string | null {
  switch (a.situacao) {
    case 'adequada':
    case 'sem-dado':
      return null;
    case 'aceita-meia-sombra':
      return `${especie.nomePopular} aceita meia-sombra. ${nomeLocal} recebe ${a.horasLocal} h de sol, menos que as ${a.horasMin} h do sol pleno.`;
    case 'pouco-sol':
      return `${especie.nomePopular} pede ${especie.localIdeal} (pelo menos ${a.horasMin} h de sol direto) e ${nomeLocal} recebe ${a.horasLocal} h. Ela pode crescer pouco.`;
  }
}

/** Ordem de preferência: adequada, depois meia-sombra, depois sem dado, por último pouco sol. */
const PESO: Record<SituacaoLuz, number> = { adequada: 0, 'aceita-meia-sombra': 1, 'sem-dado': 2, 'pouco-sol': 3 };

/** Locais onde a planta tem sol suficiente, do mais ensolarado para o menos (RF-5.3). */
export function locaisComSol<L extends Pick<Local, 'id' | 'horasSol'>>(especie: Especie, locais: L[]): L[] {
  return locais
    .filter((l) => avaliarLuz(especie, l).situacao === 'adequada')
    .sort((a, b) => (b.horasSol ?? 0) - (a.horasSol ?? 0));
}

/** "O que posso plantar neste local" (RF-5.4): espécies ordenadas pela situação de luz. */
export function especiesParaLocal(
  especies: readonly Especie[],
  local: Pick<Local, 'horasSol'>,
): { especie: Especie; avaliacao: AvaliacaoLuz }[] {
  return especies
    .map((especie) => ({ especie, avaliacao: avaliarLuz(especie, local) }))
    .sort(
      (a, b) =>
        PESO[a.avaliacao.situacao] - PESO[b.avaliacao.situacao] ||
        a.especie.nomePopular.localeCompare(b.especie.nomePopular, 'pt-BR'),
    );
}

const HORA = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function minutos(hhmm: string): number | null {
  const m = HORA.exec(hhmm.trim());
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

/**
 * Questionário de luz (RF-5.2): "o sol direto bate das 9:00 às 13:00" vira 4 h,
 * arredondado para meia hora. Devolve null se os horários forem inválidos ou invertidos.
 */
export function horasDeSol(de: string, ate: string): number | null {
  const a = minutos(de);
  const b = minutos(ate);
  if (a == null || b == null || b <= a) return null;
  return Math.round((b - a) / 30) / 2;
}

export type PeriodoSol = 'manha' | 'tarde' | 'manha-e-tarde';

/** Em que parte do dia o sol bate, com o meio-dia como divisa. */
export function periodoDoSol(de: string, ate: string): PeriodoSol | null {
  const a = minutos(de);
  const b = minutos(ate);
  if (a == null || b == null || b <= a) return null;
  if (b <= 12 * 60) return 'manha';
  if (a >= 12 * 60) return 'tarde';
  return 'manha-e-tarde';
}
