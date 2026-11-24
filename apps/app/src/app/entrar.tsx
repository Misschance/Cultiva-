import { Redirect } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { PlantaViva } from '../components/planta-viva';
import { Texto, fontes, useCores, type Cores } from '../components/ui';
import { useSessao } from '../lib/sessao';
import { supabase, supabaseConfigurado } from '../lib/supabase';
import { AVISO_CONFIRMAR_EMAIL, credenciais, ERRO_CADASTRO, ERRO_LOGIN } from '../lib/validacao';

type Modo = 'entrar' | 'criar';

/**
 * Para onde o link de confirmação do e-mail volta. Na web é a raiz do próprio site
 * (/Cultiva-/ no GitHub Pages), deduzida do endereço desta tela. O endereço precisa estar
 * na lista de Redirect URLs do Supabase; se não estiver, o Supabase usa o Site URL.
 */
function enderecoDeRetorno(): string | undefined {
  if (typeof window === 'undefined' || !window.location?.href) return undefined;
  return new URL('.', window.location.href).toString();
}

export default function Entrar() {
  const { sessao } = useSessao();
  const c = useCores();
  const estilos = useMemo(() => criarEstilos(c), [c]);
  const [modo, setModo] = useState<Modo>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'erro' | 'aviso'; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (sessao) return <Redirect href="/(abas)" />;

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
        const { error } = await supabase.auth.signUp({
          email: dados.data.email,
          password: dados.data.senha,
          options: { emailRedirectTo: enderecoDeRetorno() },
        });
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
      <View style={{ alignItems: 'center' }}>
        <PlantaViva especieId="alface" nome="Alface" estagio="colheita" tamanho={150} />
      </View>
      <Texto style={estilos.titulo} accessibilityRole="header">
        {modo === 'entrar' ? 'Entre na sua horta' : 'Crie sua conta'}
      </Texto>

      {!supabaseConfigurado && (
        <Texto style={estilos.erro}>O app ainda não está ligado a um servidor. Veja o README para configurar.</Texto>
      )}

      <Texto style={estilos.rotulo} nativeID="rotulo-email">E-mail</Texto>
      <TextInput
        style={estilos.campo}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        maxLength={254}
        placeholderTextColor={c.textoSuave}
        accessibilityLabelledBy="rotulo-email"
      />

      <Texto style={estilos.rotulo} nativeID="rotulo-senha">Senha</Texto>
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
        <Texto style={mensagem.tipo === 'erro' ? estilos.erro : estilos.aviso} accessibilityLiveRegion="polite">
          {mensagem.texto}
        </Texto>
      )}

      <Pressable style={estilos.botao} onPress={enviar} disabled={enviando || !supabaseConfigurado} accessibilityRole="button">
        {enviando ? <ActivityIndicator color={c.sobreVerde} /> : <Texto style={estilos.textoBotao}>{modo === 'entrar' ? 'Entrar' : 'Criar conta'}</Texto>}
      </Pressable>

      <Pressable
        style={estilos.link}
        onPress={() => {
          setModo(modo === 'entrar' ? 'criar' : 'entrar');
          setMensagem(null);
        }}
        accessibilityRole="button"
      >
        <Texto style={estilos.textoLink}>{modo === 'entrar' ? 'Ainda não tenho conta' : 'Já tenho conta'}</Texto>
      </Pressable>
    </View>
  );
}

const criarEstilos = (c: Cores) =>
  StyleSheet.create({
    tela: { flex: 1, padding: 24, gap: 8, maxWidth: 480, width: '100%', alignSelf: 'center', justifyContent: 'center' },
    titulo: { fontSize: 30, fontFamily: fontes.titulo, marginBottom: 16, color: c.texto, textAlign: 'center' },
    rotulo: { fontSize: 15, marginTop: 8, fontWeight: '500' },
      campo: { minHeight: 48, borderWidth: 1, borderColor: c.bordaCampo, borderRadius: 14, paddingHorizontal: 14, fontSize: 16, fontFamily: fontes.texto, color: c.texto, backgroundColor: c.cartao },
    botao: { minHeight: 52, marginTop: 16, borderRadius: 26, backgroundColor: c.verde, alignItems: 'center', justifyContent: 'center' },
    textoBotao: { color: c.sobreVerde, fontSize: 16, fontWeight: '600' },
    link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
    textoLink: { color: c.verde, fontSize: 16, textDecorationLine: 'underline' },
    erro: { color: c.erro, fontSize: 15 },
    aviso: { color: c.verdeEscuro, fontSize: 15 },
  });
