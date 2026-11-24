import { useColorScheme } from 'react-native';

/** Paleta clara: papel, terra e um verde só para ação. */
export const CLARO = {
  fundo: '#F5F2EA',
  cartao: '#FFFDF8',
  superficie: '#F0ECE1',
  trilho: '#E9E4D8',
  borda: '#E2DDD0',
  bordaCampo: '#A8A293',
  texto: '#1D261E',
  textoSuave: '#5B6259',
  verde: '#2E5E3A',
  verdeEscuro: '#1F4229',
  verdeClaro: '#E3EBDD',
  sobreVerde: '#FFFFFF',
  erro: '#A3261B',
  alerta: '#6B4A00',
  fundoAlerta: '#F6EBD3',
  barraAlerta: '#C9A24B',
  // Barra de abas: doca escura com destaque lima na aba ativa.
  doca: '#1D261E',
  docaTexto: '#AEB8AA',
  docaAtivo: '#FFFFFF',
  destaque: '#C6E86B',
  sobreDestaque: '#18210F',
};

/** Paleta escura: mesmas funções, contraste AA sobre fundo de folha à noite. */
export const ESCURO: typeof CLARO = {
  fundo: '#141A15',
  cartao: '#1E261F',
  superficie: '#252E26',
  trilho: '#2E382F',
  borda: '#2E382F',
  bordaCampo: '#56614F',
  texto: '#EEF1EA',
  textoSuave: '#A3AC9F',
  verde: '#8CC596',
  verdeEscuro: '#CFE8D2',
  verdeClaro: '#2C4A33',
  sobreVerde: '#10200F',
  erro: '#FF8A80',
  alerta: '#F0C878',
  fundoAlerta: '#3D3220',
  barraAlerta: '#E0B060',
  doca: '#263027',
  docaTexto: '#A3AC9F',
  docaAtivo: '#EEF1EA',
  destaque: '#C6E86B',
  sobreDestaque: '#18210F',
};

export type Cores = typeof CLARO;

export function useEscuro(): boolean {
  return useColorScheme() === 'dark';
}

export function useCores(): Cores {
  return useEscuro() ? ESCURO : CLARO;
}

/** Famílias carregadas no layout raiz (expo-font). */
export const fontes = {
  titulo: 'BricolageGrotesque_600SemiBold',
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
