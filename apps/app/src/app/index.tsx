import { CATALOGO } from '@cultivae/core';
import { Redirect } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSessao } from '../lib/sessao';
import { supabase } from '../lib/supabase';

/** Fase 0: confirma login e mostra o catálogo embutido. A tela "Hoje" chega na fase 1. */
export default function Inicio() {
  const { sessao, carregando } = useSessao();

  if (carregando) {
    return (
      <View style={estilos.centro}>
        <ActivityIndicator />
      </View>
    );
  }
  if (!sessao) return <Redirect href="/entrar" />;

  return (
    <FlatList
      contentContainerStyle={estilos.lista}
      data={CATALOGO}
      keyExtractor={(e) => e.id}
      ListHeaderComponent={
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo} accessibilityRole="header">Plantas da base</Text>
          <Text style={estilos.subtitulo}>{CATALOGO.length} espécies com fichas de cultivo.</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={estilos.cartao}>
          <Text style={estilos.nome}>{item.nomePopular}</Text>
          <Text style={estilos.cientifico}>{item.nomeCientifico}</Text>
          <Text style={estilos.linha}>Luz: {item.localIdeal}</Text>
          <Text style={estilos.linha}>
            Rega da planta formada: a cada {item.regaAdultaIntervaloDias.min}
            {item.regaAdultaIntervaloDias.max !== item.regaAdultaIntervaloDias.min ? ` a ${item.regaAdultaIntervaloDias.max}` : ''}{' '}
            {item.regaAdultaIntervaloDias.max === 1 ? 'dia' : 'dias'}
          </Text>
          {item.dicaAcessivel ? <Text style={estilos.dica}>{item.dicaAcessivel}</Text> : null}
        </View>
      )}
      ListFooterComponent={
        <Pressable style={estilos.sair} onPress={() => supabase.auth.signOut()} accessibilityRole="button">
          <Text style={estilos.textoSair}>Sair</Text>
        </Pressable>
      }
    />
  );
}

const estilos = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: 16, gap: 12, maxWidth: 720, width: '100%', alignSelf: 'center' },
  cabecalho: { marginBottom: 4 },
  titulo: { fontSize: 24, fontWeight: '600', color: '#1B5E20' },
  subtitulo: { fontSize: 16, color: '#424242' },
  cartao: { borderWidth: 1, borderColor: '#C8E6C9', borderRadius: 12, padding: 16, gap: 4 },
  nome: { fontSize: 18, fontWeight: '600' },
  cientifico: { fontSize: 14, fontStyle: 'italic', color: '#616161' },
  linha: { fontSize: 15 },
  dica: { fontSize: 15, color: '#2E7D32', marginTop: 4 },
  sair: { minHeight: 48, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  textoSair: { fontSize: 16, color: '#B71C1C', textDecorationLine: 'underline' },
});
