import type { BottomTabBarProps } from 'expo-router/tabs';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { Texto, useCores } from './ui';

export type Icone = 'sol' | 'horta' | 'livro' | 'pessoa';

const TRACOS: Record<Icone, string> = {
  sol: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  horta: 'M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2.2-5-6-5 0 3 2.2 5 6 5zM4 21h16',
  livro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M9 7h6',
  pessoa: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
};

const ICONE_DA_ROTA: Record<string, Icone> = { index: 'sol', horta: 'horta', plantas: 'livro', conta: 'pessoa' };

function Desenho({ nome, cor, tamanho = 22 }: { nome: Icone; cor: string; tamanho?: number }) {
  return (
    <Svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      {nome === 'sol' && <Circle cx={12} cy={12} r={4} />}
      {nome === 'pessoa' && <Circle cx={12} cy={8} r={4} />}
      <Path d={TRACOS[nome]} />
    </Svg>
  );
}

/** Raio do recorte em semicírculo na barra e da bolha que leva o ícone da aba ativa. */
const RECORTE = 36;
const BOLHA = 27;
const BARRA = 66;
const ITEM_LATERAL = 92;

function useMenosMovimento() {
  const [menos, setMenos] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setMenos, () => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setMenos);
    return () => sub.remove();
  }, []);
  return menos;
}

/**
 * Barra de abas flutuante: a aba ativa sobe numa bolha que se encaixa num recorte em semicírculo
 * da barra e desliza até a aba tocada. No celular fica embaixo; em tela larga, vira trilho na lateral.
 */
export function BarraAbas({ state, descriptors, emitter, navigateToTab, lateral }: BottomTabBarProps & { lateral: boolean }) {
  const c = useCores();
  const insets = useSafeAreaInsets();
  const menos = useMenosMovimento();
  const [comprimento, setComprimento] = useState(0);
  const pos = useRef(new Animated.Value(state.index)).current;
  const pulo = useRef(new Animated.Value(1)).current;
  const n = state.routes.length;

  useEffect(() => {
    if (menos) {
      pos.setValue(state.index);
      return;
    }
    Animated.spring(pos, { toValue: state.index, useNativeDriver: Platform.OS !== 'web', damping: 18, stiffness: 180, mass: 0.9 }).start();
    pulo.setValue(0.6);
    Animated.timing(pulo, { toValue: 1, duration: 420, easing: Easing.out(Easing.back(2.2)), useNativeDriver: Platform.OS !== 'web' }).start();
  }, [state.index, menos, pos, pulo]);

  const passo = lateral ? ITEM_LATERAL : comprimento / n;
  const centro = pos.interpolate({ inputRange: [0, Math.max(n - 1, 1)], outputRange: [passo / 2, passo * (Math.max(n - 1, 1) + 0.5)] });
  // No trilho lateral a bolha sobe um pouco, para não cobrir o nome da aba logo abaixo.
  const ajuste = lateral ? -16 : 0;
  const desloca = (raio: number) => Animated.add(centro, ajuste - raio);
  const pronto = lateral || comprimento > 0;

  const recorte = {
    position: 'absolute' as const,
    width: RECORTE * 2,
    height: RECORTE * 2,
    borderRadius: RECORTE,
    backgroundColor: c.fundo,
    ...(lateral ? { right: -RECORTE, top: 0 } : { top: -RECORTE, left: 0 }),
    transform: lateral ? [{ translateY: desloca(RECORTE) }] : [{ translateX: desloca(RECORTE) }],
  };
  const ativa = state.routes[state.index];
  const bolha = {
    position: 'absolute' as const,
    width: BOLHA * 2,
    height: BOLHA * 2,
    borderRadius: BOLHA,
    backgroundColor: c.destaque,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: c.destaque,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    ...(lateral ? { right: -BOLHA, top: 0 } : { top: -BOLHA, left: 0 }),
    transform: [lateral ? { translateY: desloca(BOLHA) } : { translateX: desloca(BOLHA) }, { scale: pulo }],
  };

  return (
    <View
      style={
        lateral
          ? { backgroundColor: c.fundo, paddingLeft: 14, paddingRight: RECORTE + 4, paddingTop: Math.max(insets.top, 20) + 12, paddingBottom: 20 }
          : { backgroundColor: c.fundo, paddingHorizontal: 16, paddingTop: RECORTE - 2, paddingBottom: Math.max(insets.bottom, 12) }
      }
    >
      <View
        accessibilityRole="tablist"
        onLayout={(e) => setComprimento(e.nativeEvent.layout.width)}
        style={{
          flexDirection: lateral ? 'column' : 'row',
          width: lateral ? 104 : undefined,
          height: lateral ? ITEM_LATERAL * n : BARRA,
          borderRadius: lateral ? 32 : BARRA / 2,
          backgroundColor: c.doca,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
          elevation: 3,
        }}
      >
        {pronto && <Animated.View pointerEvents="none" style={recorte} />}
        {state.routes.map((rota, i) => {
          const { options } = descriptors[rota.key]!;
          const foco = state.index === i;
          const nome = typeof options.title === 'string' ? options.title : rota.name;
          const icone = ICONE_DA_ROTA[rota.name] ?? 'sol';
          const tocar = () => {
            const ev = emitter.emit({ type: 'tabPress', target: rota.key, canPreventDefault: true });
            if (!foco && !ev.defaultPrevented) navigateToTab(rota.key);
          };
          return (
            <Pressable
              key={rota.key}
              onPress={tocar}
              onLongPress={() => emitter.emit({ type: 'tabLongPress', target: rota.key })}
              accessibilityRole="tab"
              accessibilityState={{ selected: foco }}
              accessibilityLabel={nome}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}
            >
              <View style={{ opacity: foco ? 0 : 1, marginTop: lateral ? 0 : 2 }}>
                <Desenho nome={icone} cor={c.docaTexto} />
              </View>
              <Texto numberOfLines={1} style={{ fontSize: 11.5, fontWeight: foco ? '600' : '500', color: foco ? c.docaAtivo : c.docaTexto, letterSpacing: 0.1 }}>
                {nome}
              </Texto>
            </Pressable>
          );
        })}
        {pronto && ativa && (
          <Animated.View pointerEvents="none" style={bolha}>
            <Desenho nome={ICONE_DA_ROTA[ativa.name] ?? 'sol'} cor={c.sobreDestaque} tamanho={24} />
          </Animated.View>
        )}
      </View>
    </View>
  );
}
