import { Redirect } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSessao } from '../lib/sessao';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { AVISO_CONFIRMAR_EMAIL, credenciais, ERRO_CADASTRO, ERRO_LOGIN } from '../lib/validacao';

type Modo = 'entrar' | 'criar';

export default function Entrar() {
  const { sessao } = useSessao();
  const [modo, setModo] = useState<Modo>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'aviso'; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (sessao) return <Redirect href="/" />;

  async function enviar() {
    setMensagem(null);
    const dados = credenciais.safeParse({ email, senha });
    if (!dados.success) {
      setMensagem({ tipo: 'erro', texto: dados.error.issues[0]?.message ?? 'Confira os dados.' });
      return;
    }
    setEnviando(true);
    try {
      if (modo === 'entrar') {
        const { error } = await supabase.auth.signInWithPassword({ email: dados.data.email, password: dados.data.senha });
        if (error) setMensagem({ tipo: 'erro', texto: ERRO_LOGIN });
      } else {
        const { error } = await supabase.auth.signUp({ email: dados.data.email, password: dados.data.senha });
        // Mesmo aviso exista ou não a conta, para não revelar e-mails cadastrados (SEG-4).
        setMensagem(error && error.status !== 422 ? { tipo: 'erro', texto: ERRO_CADASTRO } : { tipo: 'aviso', texto: AVISO_CONFIRMAR_EMAIL });
      }
    } catch {
      setMensagem({ tipo: 'erro', texto: 'Sem conexão. Tente de novo.' });
    } finally {
      setEnviando(false);
      setSenha('');
    }
  }

  return (
    <View style={estilos.tela}>
      <Text style={estilos.titulo} accessibilityRole="header">
        {modo === 'entrar' ? 'Entre na sua horta' : 'Crie sua conta'}
      </Text>

      {!supabaseConfigurado && (
        <Text style={estilos.erro}>O app ainda não está ligado a um servidor. Veja o README para configurar.</Text>
      )}

      <Text style={estilos.rotulo} nativeID="rotulo-email">E-mail</Text>
      <TextInput
        style={estilos.campo}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        maxLength={254}
        accessibilityLabelledBy="rotulo-email"
      />

      <Text style={estilos.rotulo} nativeID="rotulo-senha">Senha</Text>
      <TextInput
        style={estilos.campo}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'}
        textContentType={modo === 'entrar' ? 'password' : 'newPassword'}
        maxLength={72}
        accessibilityLabelledBy="rotulo-senha"
      />

      {mensagem && (
        <Text style={mensagem.tipo === 'erro' ? estilos.erro : estilos.aviso} accessibilityLiveRegion="polite">
          {mensagem.texto}
        </Text>
      )}

      <Pressable style={estilos.botao} onPress={enviar} disabled={enviando || !supabaseConfigurado} accessibilityRole="button">
        {enviando ? <ActivityIndicator color="#fff" /> : <Text style={estilos.textoBotao}>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</Text>}
      </Pressable>

      <Pressable
        style={estilos.link}
        onPress={() => {
          setModo(modo === 'entrar' ? 'criar' : 'entrar');
          setMensagem(null);
        }}
        accessibilityRole="button"
      >
        <Text style={estilos.textoLink}>{modo === 'entrar' ? 'Ainda não tenho conta' : 'Já tenho conta'}</Text>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 24, gap: 8, maxWidth: 480, width: '100%', alignSelf: 'center' },
  titulo: { fontSize: 24, fontWeight: '600', marginBottom: 16, color: '#1B5E20' },
  rotulo: { fontSize: 16, marginTop: 8 },
  campo: { minHeight: 48, borderWidth: 1, borderColor: '#9E9E9E', borderRadius: 8, paddingHorizontal: 12, fontSize: 16 },
  botao: { minHeight: 48, marginTop: 16, borderRadius: 8, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  textoLink: { color: '#1B5E20', fontSize: 16, textDecorationLine: 'underline' },
  erro: { color: '#B71C1C', fontSize: 15 },
  aviso: { color: '#1B5E20', fontSize: 15 },
});
