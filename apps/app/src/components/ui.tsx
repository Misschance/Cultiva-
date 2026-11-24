import { useMemo, useState, type ReactNode } from 'react';
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
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { familiaPorPeso, fontes, forma as f, useCores, useEscuro, type Cores } from './tema';

export { MODOS, fontes, useAparencia, useCores, useEscuro, type Cores, type Modo } from './tema';

function criarEstilos(c: Cores) {
  return StyleSheet.create({
    tela: { padding: 20, gap: 14, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 48 },
    fundo: { flex: 1, backgroundColor: 'transparent' },
    centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: c.fundo },
    titulo: { fontSize: f.tamanhoTitulo, lineHeight: Math.round(f.tamanhoTitulo * 1.12), fontFamily: f.fonteTitulo, color: c.texto, letterSpacing: -0.8 },
    subtitulo: { fontSize: 13, fontFamily: fontes.forte, color: c.textoSuave, marginTop: 8, letterSpacing: 0.8, textTransform: 'uppercase' },
    paragrafo: { fontSize: 16, color: c.texto, lineHeight: 23 },
    grupo: { gap: 6 },
    rotulo: { fontSize: 15, fontFamily: fontes.medio, color: c.texto },
    campo: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: c.bordaCampo,
      borderRadius: f.raioCampo,
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
    cartao: {
      borderWidth: 1,
      borderColor: c.borda,
      borderRadius: f.raioCartao,
      padding: 16,
      gap: 6,
      backgroundColor: c.cartao,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
    },
    aviso: { borderRadius: f.raioCampo, padding: 14 },
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
  const familia = fontFamily ?? familiaPorPeso(fontWeight);
  return <Text {...props} style={[{ color: c.texto, fontSize: 16 }, resto, { fontFamily: familia }]} />;
}

/** Tela rolável. `topo` reserva a área da barra de status nas abas, que não têm cabeçalho. */
export function Tela({ children, topo }: { children: ReactNode; topo?: boolean }) {
  const e = useEstilos();
  const margem = useSafeAreaInsets();
  const rolagem = (
    <ScrollView style={e.fundo} contentContainerStyle={[e.tela, topo && { paddingTop: margem.top + 20 }]} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
  return (
    <View style={{ flex: 1 }}>
      <Manchas />
      {rolagem}
    </View>
  );
}

/** Fundo do estilo Vidro: manchas de cor desfocadas atrás dos cartões translúcidos. */
export function Manchas() {
  const c = useCores();
  const escuro = useEscuro();
  const cores = escuro ? ['#1F7A5C', '#2B4D8F', '#7A3D6B'] : ['#9BE7C4', '#A9C8FF', '#FFD0B0'];
  const op = escuro ? 0.55 : 0.85;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.fundo }]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
        <Defs>
          {cores.map((cor, i) => (
            <RadialGradient key={i} id={`m${i}`} cx="50%" cy="50%" r="50%">
              <Stop offset="0" stopColor={cor} stopOpacity={op} />
              <Stop offset="1" stopColor={cor} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        <Rect x={-30} y={-20} width={90} height={60} fill="url(#m0)" />
        <Rect x={45} y={10} width={80} height={55} fill="url(#m1)" />
        <Rect x={-10} y={55} width={90} height={60} fill="url(#m2)" />
      </Svg>
    </View>
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

/** Bloco de resumo: um rótulo pequeno e um valor em destaque. */
export function Fato({ rotulo, valor, detalhe, alerta }: { rotulo: string; valor: string; detalhe?: string; alerta?: boolean }) {
  const c = useCores();
  return (
    <View style={{ flexGrow: 1, flexBasis: '45%', minWidth: 140, gap: 2, padding: 12, borderRadius: Math.min(18, f.raioCartao), backgroundColor: alerta ? c.fundoAlerta : c.superficie }}>
      <Text style={{ fontSize: 12, fontFamily: fontes.medio, color: alerta ? c.alerta : c.textoSuave }}>{rotulo}</Text>
      <Texto style={{ fontSize: 19, fontFamily: fontes.titulo, color: alerta ? c.alerta : c.texto }}>{valor}</Texto>
      {detalhe ? <Text style={{ fontSize: 13, fontFamily: fontes.texto, color: alerta ? c.alerta : c.textoSuave }}>{detalhe}</Text> : null}
    </View>
  );
}

/** Cartão com título que abre e fecha, para esconder detalhes longos. */
export function Secao({ titulo, resumo, inicialAberta = false, children }: { titulo: string; resumo?: string; inicialAberta?: boolean; children: ReactNode }) {
  const c = useCores();
  const e = useEstilos();
  const [aberta, setAberta] = useState(inicialAberta);
  return (
    <View style={[e.cartao, { padding: 0, gap: 0, overflow: 'hidden' }]}>
      <Pressable
        onPress={() => setAberta((a) => !a)}
        accessibilityRole="button"
        accessibilityState={{ expanded: aberta }}
        accessibilityLabel={titulo}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, minHeight: 56, opacity: pressed ? 0.7 : 1 })}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={{ fontSize: 16, fontFamily: fontes.forte, color: c.texto }}>{titulo}</Text>
          {resumo && !aberta ? (
            <Text style={{ fontSize: 13, fontFamily: fontes.texto, color: c.textoSuave }} numberOfLines={1}>
              {resumo}
            </Text>
          ) : null}
        </View>
        <Text style={{ fontSize: 18, color: c.textoSuave, transform: [{ rotate: aberta ? '180deg' : '0deg' }] }}>⌄</Text>
      </Pressable>
      {aberta ? <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}>{children}</View> : null}
    </View>
  );
}

const NIVEL_CONFIANCA: Record<string, string> = { A: 'Fonte conferida', B: 'Fonte técnica', C: 'Prática, sem fonte técnica' };

/** Um dado da ficha: rótulo, texto e, se houver, o nível de confiança da fonte. */
export function Dado({ titulo, texto, confianca }: { titulo: string; texto: unknown; confianca?: unknown }) {
  const c = useCores();
  if (texto === null || texto === undefined || texto === '') return null;
  const nivel = typeof confianca === 'string' && NIVEL_CONFIANCA[confianca] ? confianca : null;
  return (
    <View style={{ gap: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <Text style={{ fontSize: 13, fontFamily: fontes.forte, color: c.textoSuave, letterSpacing: 0.4, textTransform: 'uppercase' }}>{titulo}</Text>
        {nivel && (
          <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: nivel === 'C' ? c.fundoAlerta : c.verdeClaro }}>
            <Text style={{ fontSize: 11, fontFamily: fontes.medio, color: nivel === 'C' ? c.alerta : c.verdeEscuro }}>{NIVEL_CONFIANCA[nivel]}</Text>
          </View>
        )}
      </View>
      <Texto style={{ fontSize: 16, lineHeight: 23 }}>{String(texto)}</Texto>
    </View>
  );
}
