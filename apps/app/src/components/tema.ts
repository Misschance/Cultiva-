import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

/**
 * Três estilos visuais em teste (ramo de design). Todos têm versão clara e escura
 * e as mesmas chaves, então as telas não precisam saber qual está ativo.
 * - doca: escuro profundo e lima, a linha da barra de abas.
 * - vidro: fundo em gradiente com cartões translúcidos, esmeralda.
 * - editorial: papel, tinta e terracota, tipografia serifada grande.
 */
export type Estilo = 'doca' | 'vidro' | 'editorial';
export const ESTILOS: { valor: Estilo; texto: string }[] = [
  { valor: 'doca', texto: 'Doca' },
  { valor: 'vidro', texto: 'Vidro' },
  { valor: 'editorial', texto: 'Editorial' },
];

const DOCA_CLARO = {
  fundo: '#EDF0E6',
  cartao: '#FFFFFF',
  superficie: '#E4E8DA',
  trilho: '#DDE2D2',
  borda: '#DDE2D2',
  bordaCampo: '#9AA38F',
  texto: '#111611',
  textoSuave: '#59614F',
  verde: '#111611',
  verdeEscuro: '#3E5C0E',
  verdeClaro: '#E1ECCB',
  sobreVerde: '#D9F57A',
  erro: '#A3261B',
  alerta: '#6B4A00',
  fundoAlerta: '#F6EBD3',
  barraAlerta: '#C9A24B',
  doca: '#111611',
  docaTexto: '#A9B3A2',
  docaAtivo: '#FFFFFF',
  destaque: '#C9EC5F',
  sobreDestaque: '#111611',
};

export type Cores = typeof DOCA_CLARO;

const DOCA_ESCURO: Cores = {
  fundo: '#0B0F0B',
  cartao: '#151B15',
  superficie: '#1D251C',
  trilho: '#263024',
  borda: '#222B21',
  bordaCampo: '#4C5845',
  texto: '#F1F4EC',
  textoSuave: '#9EA898',
  verde: '#C9EC5F',
  verdeEscuro: '#D9F57A',
  verdeClaro: '#1E2A19',
  sobreVerde: '#111611',
  erro: '#FF8A80',
  alerta: '#F0C878',
  fundoAlerta: '#3D3220',
  barraAlerta: '#E0B060',
  doca: '#1A211A',
  docaTexto: '#9EA898',
  docaAtivo: '#F1F4EC',
  destaque: '#C9EC5F',
  sobreDestaque: '#111611',
};

const VIDRO_CLARO: Cores = {
  fundo: '#E8F3EE',
  cartao: 'rgba(255,255,255,0.66)',
  superficie: 'rgba(255,255,255,0.5)',
  trilho: 'rgba(16,64,46,0.10)',
  borda: 'rgba(255,255,255,0.9)',
  bordaCampo: 'rgba(16,64,46,0.28)',
  texto: '#0E2A21',
  textoSuave: '#4D6B60',
  verde: '#14825A',
  verdeEscuro: '#0D5C3F',
  verdeClaro: 'rgba(20,130,90,0.12)',
  sobreVerde: '#FFFFFF',
  erro: '#B42318',
  alerta: '#7A4D00',
  fundoAlerta: 'rgba(250,200,110,0.30)',
  barraAlerta: '#E3A33B',
  doca: 'rgba(255,255,255,0.78)',
  docaTexto: '#557367',
  docaAtivo: '#0E2A21',
  destaque: '#14825A',
  sobreDestaque: '#FFFFFF',
};

const VIDRO_ESCURO: Cores = {
  fundo: '#08161A',
  cartao: 'rgba(255,255,255,0.07)',
  superficie: 'rgba(255,255,255,0.06)',
  trilho: 'rgba(255,255,255,0.10)',
  borda: 'rgba(255,255,255,0.12)',
  bordaCampo: 'rgba(255,255,255,0.25)',
  texto: '#EAF6F1',
  textoSuave: '#93B2A7',
  verde: '#45D99A',
  verdeEscuro: '#8EF0C4',
  verdeClaro: 'rgba(69,217,154,0.12)',
  sobreVerde: '#03241A',
  erro: '#FF8A80',
  alerta: '#F6C86E',
  fundoAlerta: 'rgba(246,200,110,0.14)',
  barraAlerta: '#F0B44C',
  doca: 'rgba(14,34,36,0.88)',
  docaTexto: '#93B2A7',
  docaAtivo: '#EAF6F1',
  destaque: '#45D99A',
  sobreDestaque: '#03241A',
};

const EDITORIAL_CLARO: Cores = {
  fundo: '#F7F4EE',
  cartao: '#F7F4EE',
  superficie: '#EDE8DE',
  trilho: '#E2DCCF',
  borda: '#D9D2C3',
  bordaCampo: '#8F877A',
  texto: '#1A1814',
  textoSuave: '#6B6459',
  verde: '#1A1814',
  verdeEscuro: '#B4472A',
  verdeClaro: '#ECE5D8',
  sobreVerde: '#F7F4EE',
  erro: '#A3261B',
  alerta: '#7A4A12',
  fundoAlerta: '#F1E4CC',
  barraAlerta: '#C98B2F',
  doca: '#1A1814',
  docaTexto: '#A39C90',
  docaAtivo: '#F7F4EE',
  destaque: '#D2603C',
  sobreDestaque: '#FFFFFF',
};

const EDITORIAL_ESCURO: Cores = {
  fundo: '#121110',
  cartao: '#121110',
  superficie: '#1C1A18',
  trilho: '#2A2724',
  borda: '#2E2B27',
  bordaCampo: '#6B655C',
  texto: '#F2EEE6',
  textoSuave: '#A39C90',
  verde: '#F2EEE6',
  verdeEscuro: '#EE8A66',
  verdeClaro: '#1E1C19',
  sobreVerde: '#121110',
  erro: '#FF8A80',
  alerta: '#E9B66E',
  fundoAlerta: '#33281A',
  barraAlerta: '#D9A04A',
  doca: '#F2EEE6',
  docaTexto: '#6B6459',
  docaAtivo: '#121110',
  destaque: '#D2603C',
  sobreDestaque: '#FFFFFF',
};

const PALETAS: Record<Estilo, { claro: Cores; escuro: Cores }> = {
  doca: { claro: DOCA_CLARO, escuro: DOCA_ESCURO },
  vidro: { claro: VIDRO_CLARO, escuro: VIDRO_ESCURO },
  editorial: { claro: EDITORIAL_CLARO, escuro: EDITORIAL_ESCURO },
};

/** Forma de cada estilo: cantos, peso do título e se o cartão tem preenchimento. */
export interface Forma {
  raioCartao: number;
  raioCampo: number;
  fonteTitulo: string;
  tamanhoTitulo: number;
  /** Fundo com manchas de cor (vidro). */
  manchas: boolean;
  /** Cartões só com fio, sem sombra (editorial). */
  fio: boolean;
}

const FORMAS: Record<Estilo, Forma> = {
  doca: { raioCartao: 26, raioCampo: 16, fonteTitulo: 'BricolageGrotesque_600SemiBold', tamanhoTitulo: 34, manchas: false, fio: false },
  vidro: { raioCartao: 28, raioCampo: 18, fonteTitulo: 'BricolageGrotesque_600SemiBold', tamanhoTitulo: 32, manchas: true, fio: false },
  editorial: { raioCartao: 6, raioCampo: 4, fonteTitulo: 'Fraunces_600SemiBold', tamanhoTitulo: 40, manchas: false, fio: true },
};

export const ContextoEstilo = createContext<{ estilo: Estilo; setEstilo: (e: Estilo) => void }>({ estilo: 'doca', setEstilo: () => undefined });

export function useEstilo() {
  return useContext(ContextoEstilo);
}

export function useEscuro(): boolean {
  return useColorScheme() === 'dark';
}

export function useCores(): Cores {
  const { estilo } = useEstilo();
  const p = PALETAS[estilo];
  return useEscuro() ? p.escuro : p.claro;
}

export function useForma(): Forma {
  return FORMAS[useEstilo().estilo];
}

/** Famílias carregadas no layout raiz (expo-font). */
export const fontes = {
  titulo: 'BricolageGrotesque_600SemiBold',
  serifa: 'Fraunces_600SemiBold',
  texto: 'Inter_400Regular',
  medio: 'Inter_500Medium',
  forte: 'Inter_600SemiBold',
};

/** Fonte customizada não combina com fontWeight no Android: o peso vira a família. */
export function familiaPorPeso(peso: unknown): string {
  const n = Number(peso === 'bold' ? 700 : peso === 'normal' || peso == null ? 400 : peso);
  if (n >= 600) return fontes.forte;
  if (n >= 500) return fontes.medio;
  return fontes.texto;
}
