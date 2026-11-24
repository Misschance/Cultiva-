import { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';

/**
 * Estilo Vidro (escolhido pelo Murilo em 24/11/2026): fundo com manchas de cor e
 * cartões translúcidos, verde esmeralda. Claro e escuro com as mesmas chaves.
 * A pessoa escolhe claro, escuro ou automático (segue o aparelho).
 */
const CLARO = {
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

export type Cores = typeof CLARO;

const ESCURO: Cores = {
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

/** Forma do estilo: cantos, fonte e tamanho do título. */
export const forma = {
  raioCartao: 28,
  raioCampo: 18,
  fonteTitulo: 'BricolageGrotesque_600SemiBold',
  tamanhoTitulo: 32,
};

export type Modo = 'sistema' | 'claro' | 'escuro';
export const MODOS: { valor: Modo; texto: string }[] = [
  { valor: 'sistema', texto: 'Automático' },
  { valor: 'claro', texto: 'Claro' },
  { valor: 'escuro', texto: 'Escuro' },
];

export const ContextoAparencia = createContext<{ modo: Modo; setModo: (m: Modo) => void }>({ modo: 'sistema', setModo: () => undefined });

export function useAparencia() {
  return useContext(ContextoAparencia);
}

export function useEscuro(): boolean {
  const { modo } = useAparencia();
  const sistema = useColorScheme();
  return modo === 'sistema' ? sistema === 'dark' : modo === 'escuro';
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

export function familiaPorPeso(peso: unknown): string {
  const n = Number(peso === 'bold' ? 700 : peso === 'normal' || peso == null ? 400 : peso);
  if (n >= 600) return fontes.forte;
  if (n >= 500) return fontes.medio;
  return fontes.texto;
}
