import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

export const cores = {
  verde: '#2E7D32',
  verdeEscuro: '#1B5E20',
  verdeClaro: '#E8F5E9',
  borda: '#C8E6C9',
  texto: '#212121',
  textoSuave: '#555555',
  erro: '#B71C1C',
  alerta: '#8D6E00',
  fundoAlerta: '#FFF8E1',
};

export function Tela({ children }: { children: ReactNode }) {
  return (
    <ScrollView contentContainerStyle={estilos.tela} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

export function Titulo({ children }: { children: ReactNode }) {
  return (
    <Text style={estilos.titulo} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Subtitulo({ children }: { children: ReactNode }) {
  return (
    <Text style={estilos.subtitulo} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Paragrafo({ children, suave }: { children: ReactNode; suave?: boolean }) {
  return <Text style={[estilos.paragrafo, suave && { color: cores.textoSuave }]}>{children}</Text>;
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
  const principal = variante === 'principal';
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado || carregando}
      accessibilityRole="button"
      accessibilityState={{ disabled: desativado || carregando, busy: carregando }}
      style={({ pressed }) => [
        estilos.botao,
        principal ? estilos.botaoPrincipal : estilos.botaoSecundario,
        variante === 'perigo' && { borderColor: cores.erro },
        (pressed || desativado) && { opacity: 0.6 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={principal ? '#fff' : cores.verde} />
      ) : (
        <Text
          style={[
            estilos.textoBotao,
            { color: principal ? '#fff' : variante === 'perigo' ? cores.erro : cores.verdeEscuro },
          ]}
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

export function Campo({ rotulo, erro, ...props }: TextInputProps & { rotulo: string; erro?: string | null }) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <TextInput
        style={[estilos.campo, erro ? { borderColor: cores.erro } : null]}
        accessibilityLabel={rotulo}
        placeholderTextColor="#888"
        {...props}
      />
      {erro ? <Text style={estilos.erro}>{erro}</Text> : null}
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
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={estilos.chips} accessibilityRole="radiogroup" accessibilityLabel={rotulo}>
        {opcoes.map((o) => {
          const ativo = o.valor === valor;
          return (
            <Pressable
              key={o.valor}
              onPress={() => onChange(o.valor)}
              accessibilityRole="radio"
              accessibilityState={{ checked: ativo }}
              style={[estilos.chip, ativo && estilos.chipAtivo]}
            >
              <Text style={[estilos.textoChip, ativo && { color: '#fff' }]}>{o.texto}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function Cartao({ children, onPress, rotulo }: { children: ReactNode; onPress?: () => void; rotulo?: string }) {
  if (!onPress) return <View style={estilos.cartao}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={({ pressed }) => [estilos.cartao, pressed && { opacity: 0.7 }]}
    >
      {children}
    </Pressable>
  );
}

export function Aviso({ children, tipo = 'alerta' }: { children: ReactNode; tipo?: 'alerta' | 'erro' | 'ok' }) {
  const cor = tipo === 'erro' ? cores.erro : tipo === 'ok' ? cores.verdeEscuro : cores.alerta;
  const fundo = tipo === 'ok' ? cores.verdeClaro : cores.fundoAlerta;
  return (
    <View style={[estilos.aviso, { backgroundColor: fundo, borderColor: cor }]} accessibilityLiveRegion="polite">
      <Text style={{ color: cor, fontSize: 15 }}>{children}</Text>
    </View>
  );
}

export function Carregando() {
  return (
    <View style={estilos.centro}>
      <ActivityIndicator color={cores.verde} />
    </View>
  );
}

export const estilos = StyleSheet.create({
  tela: { padding: 16, gap: 12, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 48 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  titulo: { fontSize: 24, fontWeight: '600', color: cores.verdeEscuro },
  subtitulo: { fontSize: 18, fontWeight: '600', color: cores.texto, marginTop: 8 },
  paragrafo: { fontSize: 16, color: cores.texto, lineHeight: 22 },
  grupo: { gap: 6 },
  rotulo: { fontSize: 16, color: cores.texto },
  campo: { minHeight: 48, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 8, paddingHorizontal: 12, fontSize: 16, color: cores.texto },
  erro: { color: cores.erro, fontSize: 14 },
  botao: { minHeight: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  botaoPrincipal: { backgroundColor: cores.verde },
  botaoSecundario: { borderWidth: 1, borderColor: cores.verde },
  textoBotao: { fontSize: 16, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 44, paddingHorizontal: 14, borderRadius: 22, borderWidth: 1, borderColor: cores.verde, justifyContent: 'center' },
  chipAtivo: { backgroundColor: cores.verde },
  textoChip: { fontSize: 15, color: cores.verdeEscuro },
  cartao: { borderWidth: 1, borderColor: cores.borda, borderRadius: 12, padding: 16, gap: 4, backgroundColor: '#fff' },
  aviso: { borderWidth: 1, borderRadius: 8, padding: 12 },
});
