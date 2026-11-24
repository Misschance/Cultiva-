/** Nível de confiança de um dado da base (ver data/base-plantas/legenda.csv). */
export type Confianca = 'A' | 'B' | 'C';

/** Intervalo fechado de valores, sempre em dias quando não indicado. */
export interface Faixa {
  min: number;
  max: number;
}

/** Data de calendário no formato AAAA-MM-DD, sem hora nem fuso. */
export type DataISO = string;

export interface FaseEspecie {
  ordem: number;
  nome: string;
  /**
   * Dia do ciclo em que a fase começa, contado da semeadura ou do plantio da muda.
   * null quando a base não define: a fase só começa por confirmação do usuário.
   */
  diaInicio: number | null;
  /** Dia em que a fase termina; null quando a fase não tem fim definido. */
  diaFim: number | null;
  rega: string;
  adubacao: string;
  intervencoes: string;
  fonte: string;
  confianca: Confianca;
}

export interface Especie {
  id: string;
  nomePopular: string;
  nomeCientifico: string;
  grupo: string;
  propagacao: string;
  germinacaoDias: Faixa | null;
  colheitaInicioDias: Faixa | null;
  /** Intervalo entre regas da planta já estabelecida. */
  regaAdultaIntervaloDias: Faixa;
  luzHorasMin: number | null;
  localIdeal: string;
  dicaAcessivel: string;
  /** Como saber que está no ponto de colher (RF-4.4); null quando a literatura lida não diz. */
  pontoColheita: { texto: string; fonte: string; confianca: Confianca } | null;
  fases: FaseEspecie[];
}

export type TipoLocal = 'vaso' | 'canteiro' | 'quintal' | 'jardineira' | 'estufa';
export type MaterialVaso = 'plastico' | 'barro' | 'tecido';

export interface Local {
  id: string;
  tipo: TipoLocal;
  interno: boolean;
  volumeLitros?: number | null;
  material?: MaterialVaso | null;
  horasSol?: number | null;
}

export type Origem = 'semente' | 'muda' | 'estaca';

/** O usuário confirmou que a planta entrou numa fase (ex.: "germinou"). */
export interface ConfirmacaoFase {
  fase: string;
  data: DataISO;
}

export interface Plantio {
  id: string;
  especieId: string;
  localId: string;
  origem: Origem;
  dataPlantio: DataISO;
  confirmacoes?: ConfirmacaoFase[];
}

export type TipoAcao = 'rega' | 'adubacao' | 'poda' | 'desbaste' | 'tutoramento' | 'transplante' | 'colheita';

export interface RegistroAcao {
  plantioId: string;
  tipo: TipoAcao;
  data: DataISO;
}

/** Previsão diária de clima para um local. */
export interface PrevisaoDia {
  data: DataISO;
  chuvaMm: number;
  tempMaxC: number;
}

export type TipoTarefa =
  | 'rega'
  | 'verificar-germinacao'
  | 'germinacao-atrasada'
  | 'colheita-proxima'
  | 'colheita';

export interface Tarefa {
  plantioId: string;
  tipo: TipoTarefa;
  devidaEm: DataISO;
  atrasada: boolean;
  /** Frases curtas que explicam ao usuário por que a data mudou. */
  ajustes: string[];
}
