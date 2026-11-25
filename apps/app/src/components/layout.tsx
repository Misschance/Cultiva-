import { Children, createContext, useContext, type ReactNode } from 'react';
import { Platform, View, useWindowDimensions, type ViewStyle } from 'react-native';

/**
 * Layout que se adapta à tela. A Tela mede a largura útil do conteúdo e passa para baixo;
 * Colunas e Grade decidem quantas colunas cabem a partir dela, não da janela inteira
 * (assim a barra lateral e o cabeçalho não confundem a conta).
 */

export type Largura = 'estreita' | 'normal' | 'larga';

const MAXIMO: Record<Largura, number> = { estreita: 560, normal: 760, larga: 1320 };

/** Espaço nas bordas: menor no celular, maior no computador. */
export function margemLateral(janela: number): number {
  return janela < 400 ? 16 : janela < 768 ? 20 : janela < 1200 ? 28 : 36;
}

export function larguraMaxima(largura: Largura): number {
  return MAXIMO[largura];
}

export const LarguraConteudo = createContext<number | null>(null);

/** Largura útil do conteúdo onde o componente está (estimativa pela janela antes da medição). */
export function useLarguraConteudo(): number {
  const medida = useContext(LarguraConteudo);
  const janela = useWindowDimensions().width;
  return medida ?? Math.min(janela, MAXIMO.normal) - 2 * margemLateral(janela);
}

const GRUDAR: ViewStyle | undefined = Platform.OS === 'web' ? ({ position: 'sticky', top: 16 } as unknown as ViewStyle) : undefined;

/**
 * Duas colunas quando há espaço (uma com largura fixa, a outra ocupa o resto); uma embaixo
 * da outra no celular. No computador a coluna fixa acompanha a rolagem.
 * `larguraFixa` é a largura da coluna fixa, seja ela a da esquerda ou a da direita.
 */
export function Colunas({
  esquerda,
  children,
  larguraFixa = 400,
  minimo = 860,
  gap = 24,
  grudar = false,
  fixa = 'esquerda',
}: {
  esquerda: ReactNode;
  children: ReactNode;
  larguraFixa?: number;
  minimo?: number;
  gap?: number;
  grudar?: boolean;
  /** Qual coluna tem largura fixa; a outra ocupa o resto. */
  fixa?: 'esquerda' | 'direita';
}) {
  const total = useLarguraConteudo();
  if (!esquerda || total < minimo) {
    return (
      <>
        {esquerda}
        {children}
      </>
    );
  }
  const fixo = Math.min(larguraFixa, Math.round(total * 0.45));
  const esq = fixa === 'esquerda' ? fixo : total - fixo - gap;
  const dir = total - esq - gap;
  return (
    <View style={{ flexDirection: 'row', gap, alignItems: 'flex-start' }}>
      <View style={[{ width: esq, gap: 14 }, grudar && fixa === 'esquerda' && GRUDAR]}>
        <LarguraConteudo.Provider value={esq}>{esquerda}</LarguraConteudo.Provider>
      </View>
      <View style={[{ width: dir, gap: 14 }, grudar && fixa === 'direita' && GRUDAR]}>
        <LarguraConteudo.Provider value={dir}>{children}</LarguraConteudo.Provider>
      </View>
    </View>
  );
}

/** Grade de cartões: quantas colunas couberem com pelo menos `minimo` px cada (até `maximo`). */
export function Grade({ minimo, maximo = 6, gap = 12, children }: { minimo: number; maximo?: number; gap?: number; children: ReactNode }) {
  const total = useLarguraConteudo();
  const colunas = Math.max(1, Math.min(maximo, Math.floor((total + gap) / (minimo + gap))));
  const largura = Math.floor((total - gap * (colunas - 1)) / colunas);
  const itens = Children.toArray(children);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {itens.map((filho, i) => (
        <View key={i} style={{ width: largura }}>
          <LarguraConteudo.Provider value={largura}>{filho}</LarguraConteudo.Provider>
        </View>
      ))}
    </View>
  );
}

/** Dá a largura do lugar onde está, para quem precisa ajustar medidas por dentro (ex.: altura dos dias). */
export function ComLargura({ children }: { children: (largura: number) => ReactNode }) {
  return <>{children(useLarguraConteudo())}</>;
}
