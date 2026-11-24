import { router } from 'expo-router';
import { Platform, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Texto, useCores } from './ui';

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
