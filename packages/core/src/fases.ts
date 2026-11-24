import { diasEntre, paraDia } from './datas';
import type { DataISO, Especie, FaseEspecie, Plantio } from './tipos';

/** Fases que só existem para quem começa de semente. */
export const FASES_DE_SEMENTEIRA = new Set(['germinação', 'muda', 'desbaste']);

/**
 * Dia do ciclo do plantio em `hoje`, contado a partir da data de plantio.
 * Se o usuário confirmou a entrada numa fase, essa confirmação manda:
 * o ciclo é reancorado no início daquela fase.
 */
export function diaDoCiclo(plantio: Plantio, especie: Especie, hoje: DataISO): number {
  const confirmacao = ultimaConfirmacaoValida(plantio, especie);
  if (confirmacao && confirmacao.fase.diaInicio != null) {
    return confirmacao.fase.diaInicio + diasEntre(confirmacao.data, hoje);
  }
  return diasEntre(plantio.dataPlantio, hoje);
}

export function faseAtual(plantio: Plantio, especie: Especie, hoje: DataISO): FaseEspecie {
  const fases = [...especie.fases].sort((a, b) => a.ordem - b.ordem);
  if (fases.length === 0) throw new Error(`Espécie sem fases: ${especie.id}`);
  const dia = diaDoCiclo(plantio, especie, hoje);

  let atual = fases[0]!;
  for (const fase of fases) {
    if (fase.diaInicio != null && fase.diaInicio <= dia) atual = fase;
  }

  // Uma fase confirmada pelo usuário vale mesmo que o calendário ainda não tenha chegado nela.
  const confirmada = ultimaConfirmacaoValida(plantio, especie);
  if (confirmada && confirmada.fase.ordem > atual.ordem) atual = confirmada.fase;

  // Muda ou estaca já passou da sementeira: começa na primeira fase de planta formada.
  if (plantio.origem !== 'semente' && FASES_DE_SEMENTEIRA.has(atual.nome)) {
    const primeiraFormada = fases.find((f) => !FASES_DE_SEMENTEIRA.has(f.nome));
    if (primeiraFormada) atual = primeiraFormada;
  }
  return atual;
}

/** True se o usuário já confirmou alguma fase posterior à germinação. */
export function germinacaoConfirmada(plantio: Plantio, especie: Especie): boolean {
  const germinacao = especie.fases.find((f) => f.nome === 'germinação');
  if (!germinacao) return true;
  return (plantio.confirmacoes ?? []).some((c) => {
    const fase = especie.fases.find((f) => f.nome === c.fase);
    return fase !== undefined && fase.ordem > germinacao.ordem;
  });
}

function ultimaConfirmacaoValida(plantio: Plantio, especie: Especie) {
  let melhor: { fase: FaseEspecie; data: DataISO } | null = null;
  for (const c of plantio.confirmacoes ?? []) {
    const fase = especie.fases.find((f) => f.nome === c.fase);
    if (!fase) continue;
    if (!melhor || paraDia(c.data) > paraDia(melhor.data)) melhor = { fase, data: c.data };
  }
  return melhor;
}

/** Fase em que a planta entra quando o usuário confirma que germinou. */
export function faseAposGerminacao(especie: Especie): FaseEspecie | null {
  const fases = [...especie.fases].sort((a, b) => a.ordem - b.ordem);
  const i = fases.findIndex((f) => f.nome === 'germinação');
  if (i < 0) return null;
  return fases[i + 1] ?? null;
}
