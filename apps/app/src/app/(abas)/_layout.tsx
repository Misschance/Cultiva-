import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Carregando, fontes, useCores } from '../../components/ui';
import { useSessao } from '../../lib/sessao';

type Icone = 'sol' | 'horta' | 'livro' | 'pessoa';

const TRACOS: Record<Icone, string> = {
  sol: 'M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  horta: 'M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2.2-5-6-5 0 3 2.2 5 6 5zM4 21h16',
  livro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M9 7h6',
  pessoa: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6',
};

function IconeAba({ nome, ativo }: { nome: Icone; ativo: boolean }) {
  const c = useCores();
  const cor = ativo ? c.verdeEscuro : c.textoSuave;
  return (
    <View style={{ width: 56, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: ativo ? c.verdeClaro : 'transparent' }}>
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        {nome === 'sol' && <Circle cx={12} cy={12} r={4} />}
        {nome === 'pessoa' && <Circle cx={12} cy={8} r={4} />}
        <Path d={TRACOS[nome]} />
      </Svg>
    </View>
  );
}

export default function Abas() {
  const { sessao, carregando } = useSessao();
  const c = useCores();
  // Em telas largas (computador, tablet) a navegação vai para a lateral; no celular fica embaixo.
  const lateral = useWindowDimensions().width >= 768;
  if (carregando) return <Carregando />;
  if (!sessao) return <Redirect href="/entrar" />;

  const icone = (nome: Icone) =>
    function Icone({ focused }: { focused: boolean }) {
      return <IconeAba nome={nome} ativo={focused} />;
    };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.verdeEscuro,
        tabBarInactiveTintColor: c.textoSuave,
        tabBarPosition: lateral ? 'left' : 'bottom',
        tabBarVariant: lateral ? 'material' : 'uikit',
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: lateral
          ? { backgroundColor: c.cartao, borderRightColor: c.borda, width: 124, paddingTop: 24 }
          : { backgroundColor: c.cartao, borderTopColor: c.borda, height: 68, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 12, fontFamily: fontes.medio, marginTop: 2 },
        sceneStyle: { backgroundColor: c.fundo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoje', tabBarIcon: icone('sol') }} />
      <Tabs.Screen name="horta" options={{ title: 'Minha horta', tabBarIcon: icone('horta') }} />
      <Tabs.Screen name="plantas" options={{ title: 'Plantas', tabBarIcon: icone('livro') }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta', tabBarIcon: icone('pessoa') }} />
    </Tabs>
  );
}
