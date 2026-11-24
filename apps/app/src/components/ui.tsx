import { useMemo, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { familiaPorPeso, fontes, useCores, type Cores } from './tema';

export { fontes, useCores, useEscuro, type Cores } from './tema';

function criarEstilos(c: Cores) {
  return StyleSheet.create({
    tela: { padding: 20, gap: 14, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 48 },
    fundo: { flex: 1, backgroundColor: c.fundo },
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: c.fundo },
    titulo: { fontSize: 30, lineHeight: 34, fontFamily: fontes.titulo, color: c.texto, letterSpacing: -0.5 },
    subtitulo: { fontSize: 13, fontFamily: fontes.forte, color: c.textoSuave, marginTop: 8, letterSpacing: 0.8, textTransform: 'uppercase' },
    paragrafo: { fontSize: 16, color: c.texto, lineHeight: 23 },
    grupo: { gap: 6 },
    rotulo: { fontSize: 15, fontFamily: fontes.medio, color: c.texto },
    campo: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: c.bordaCampo,
      borderRadius: 14,
      paddingHorizontal: 14,
      fontSize: 16,
      fontFamily: fontes.texto,
      color: c.texto,
      backgroundColor: c.cartao,
    },
    erro: { color: c.erro, fontSize: 14 },
    botao: { minHeight: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
    botaoPrincipal: { backgroundColor: c.verde },
    botaoSecundario: { borderWidth: 1, borderColor: c.verde },
    textoBotao: { fontSize: 16, fontFamily: fontes.forte },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { minHeight: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: c.borda, backgroundColor: c.cartao, justifyContent: 'center' },
    chipAtivo: { backgroundColor: c.texto, borderColor: c.texto },
    textoChip: { fontSize: 15, fontFamily: fontes.medio, color: c.texto },
    cartao: { borderWidth: 1, borderColor: c.borda, borderRadius: 20, padding: 16, gap: 6, backgroundColor: c.cartao },
    aviso: { borderRadius: 14, padding: 14 },
  });
}

/** Estilos do tema atual (claro ou escuro). */
export function useEstilos() {
  const c = useCores();
  return useMemo(() => criarEstilos(c), [c]);
}

/** Texto com a fonte e a cor do tema. O peso (fontWeight) escolhe a família da Inter. */
export function Texto({ style, ...props }: TextProps) {
  const c = useCores();
  const plano = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const { fontWeight, fontFamily, ...resto } = plano;
  return <Text {...props} style={[{ color: c.texto, fontSize: 16 }, resto, { fontFamily: fontFamily ?? familiaPorPeso(fontWeight) }]} />;
}

/** Tela rolável. `topo` reserva a área da barra de status nas abas, que não têm cabeçalho. */
export function Tela({ children, topo }: { children: ReactNode; topo?: boolean }) {
  const e = useEstilos();
  const margem = useSafeAreaInsets();
  return (
    <ScrollView style={e.fundo} contentContainerStyle={[e.tela, topo && { paddingTop: margem.top + 20 }]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Titulo({ children }: { children: ReactNode }) {
  const e = useEstilos();
  return (
    <Text style={e.titulo} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Subtitulo({ children }: { children: ReactNode }) {
  const e = useEstilos();
  return (
    <Text style={e.subtitulo} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Paragrafo({ children, suave }: { children: ReactNode; suave?: boolean }) {
  const e = useEstilos();
  const c = useCores();
  return <Texto style={[e.paragrafo, suave && { color: c.textoSuave, fontSize: 15 }]}>{children}</Texto>;
}

export function Botao({
  titulo,
  onPress,
  variante = 'principal',
  carregando,
  desativado,
}: {
  titulo: string;
  onPress: () => void;
  variante?: 'principal' | 'secundario' | 'perigo';
  carregando?: boolean;
  desativado?: boolean;
}) {
  const e = useEstilos();
  const c = useCores();
  const principal = variante === 'principal';
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado || carregando}
      accessibilityRole="button"
      accessibilityState={{ disabled: desativado || carregando, busy: carregando }}
      style={({ pressed }) => [
        e.botao,
        principal ? e.botaoPrincipal : e.botaoSecundario,
        variante === 'perigo' && { borderColor: c.erro },
        desativado && { opacity: 0.5 },
        pressed && { transform: [{ scale: 0.97 }] },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={principal ? c.sobreVerde : c.verde} />
      ) : (
        <Text style={[e.textoBotao, { color: principal ? c.sobreVerde : variante === 'perigo' ? c.erro : c.verde }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

export function Campo({ rotulo, erro, ...props }: TextInputProps & { rotulo: string; erro?: string | null }) {
  const e = useEstilos();
  const c = useCores();
  return (
    <View style={e.grupo}>
      <Text style={e.rotulo}>{rotulo}</Text>
      <TextInput
        style={[e.campo, erro ? { borderColor: c.erro } : null]}
        accessibilityLabel={rotulo}
        placeholderTextColor={c.textoSuave}
        {...props}
      />
      {erro ? <Text style={[e.erro, { fontFamily: fontes.texto }]}>{erro}</Text> : null}
    </View>
  );
}

export function Opcoes<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
}: {
  rotulo: string;
  opcoes: { valor: T; texto: string }[];
  valor: T | null;
  onChange: (v: T) => void;
}) {
  const e = useEstilos();
  const c = useCores();
  return (
    <View style={e.grupo}>
      <Text style={e.rotulo}>{rotulo}</Text>
      <View style={e.chips} accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
        {opcoes.map((o) => {
          const ativo = o.valor === valor;
          return (
            <Pressable
              key={o.valor}
              onPress={() => onChange(o.valor)}
              accessibilityRole="radio"
              accessibilityState={{ checked: ativo }}
              style={[e.chip, ativo && e.chipAtivo]}
            >
              <Text style={[e.textoChip, ativo && { color: c.fundo }]}>{o.texto}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Cartao({ children, onPress, rotulo }: { children: ReactNode; onPress?: () => void; rotulo?: string }) {
  const e = useEstilos();
  if (!onPress) return <View style={e.cartao}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) => [e.cartao, pressed && { transform: [{ scale: 0.985 }] }]}
    >
      {children}
    </Pressable>
  );
}

export function Aviso({ children, tipo = 'alerta' }: { children: ReactNode; tipo?: 'alerta' | 'erro' | 'ok' }) {
  const e = useEstilos();
  const c = useCores();
  const cor = tipo === 'erro' ? c.erro : tipo === 'ok' ? c.verdeEscuro : c.alerta;
  const fundo = tipo === 'ok' ? c.verdeClaro : c.fundoAlerta;
  return (
    <View style={[e.aviso, { backgroundColor: fundo }]} accessibilityLiveRegion="polite">
      <Texto style={{ color: cor, fontSize: 15 }}>{children}</Texto>
    </View>
  );
}

/** Barra de progresso até a colheita (0 a 1). */
export function BarraProgresso({ valor, alerta, rotulo }: { valor: number; alerta?: boolean; rotulo: string }) {
  const c = useCores();
  const pct = Math.round(Math.min(1, Math.max(0, valor)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      style={{ height: 8, borderRadius: 4, backgroundColor: c.trilho, overflow: 'hidden' }}
    >
      <View style={{ height: 8, width: `${pct}%`, borderRadius: 4, backgroundColor: alerta ? c.barraAlerta : c.verde }} />
    </View>
  );
}

/** Selo curto de status (ex.: "Com sede", "Pronta para colher"). */
export function Selo({ texto, alerta }: { texto: string; alerta?: boolean }) {
  const c = useCores();
  return (
    <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 999, backgroundColor: alerta ? c.fundoAlerta : c.verdeClaro }}>
      <Text style={{ fontSize: 12, fontFamily: fontes.forte, color: alerta ? c.alerta : c.verdeEscuro }}>{texto}</Text>
    </View>
  );
}

export function Carregando() {
  const e = useEstilos();
  const c = useCores();
  return (
    <View style={e.centro}>
      <ActivityIndicator color={c.verde} />
    </View>
  );
}
