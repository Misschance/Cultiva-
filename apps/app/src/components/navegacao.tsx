import { router } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Texto, useAparencia, useCores, useEscuro } from './ui';

/** Volta uma tela; se não houver para onde voltar (link aberto direto, página recarregada), vai ao menu. */
export function BotaoVoltar() {
  const c = useCores();
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={10}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 2, paddingRight: 8, marginLeft: Platform.OS === 'web' ? 8 : 0, opacity: pressed ? 0.6 : 1 })}
    >
      <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.texto} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M15 18l-6-6 6-6" />
      </Svg>
      <Texto style={{ fontSize: 16, fontWeight: '500' }}>Voltar</Texto>
    </Pressable>
  );
}

/** Leva direto ao menu principal (as abas), fechando todas as telas abertas por cima. */
export function BotaoMenu() {
  const c = useCores();
  return (
    <Pressable
      onPress={() => (router.canDismiss() ? router.dismissAll() : router.replace('/'))}
      accessibilityRole="button"
      accessibilityLabel="Ir para o menu principal"
      hitSlop={10}
      style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, marginRight: Platform.OS === 'web' ? 12 : 0 })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, height: 34, borderRadius: 17, backgroundColor: c.verdeClaro }}>
        <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c.verdeEscuro} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10" />
        </Svg>
        <Texto style={{ fontSize: 14, fontWeight: '600', color: c.verdeEscuro }}>Início</Texto>
      </View>
    </Pressable>
  );
}

/** Alterna entre claro e escuro. Mostra a lua no claro (para escurecer) e o sol no escuro. */
export function BotaoTema({ tamanho = 34 }: { tamanho?: number }) {
  const c = useCores();
  const escuro = useEscuro();
  const { setModo } = useAparencia();
  return (
    <Pressable
      onPress={() => setModo(escuro ? 'claro' : 'escuro')}
      accessibilityRole="button"
      accessibilityLabel={escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      hitSlop={8}
      style={({ pressed }) => ({
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: c.cartao,
        borderWidth: 1,
        borderColor: c.borda,
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={c.texto} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        {escuro ? (
          <>
            <Circle cx={12} cy={12} r={4} />
            <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <Path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        )}
      </Svg>
    </Pressable>
  );
}
