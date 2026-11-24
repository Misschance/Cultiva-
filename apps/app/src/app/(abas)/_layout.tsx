import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { useWindowDimensions } from 'react-native';
import { BarraAbas } from '../../components/barra-abas';
import { Carregando, useCores } from '../../components/ui';
import { useSessao } from '../../lib/sessao';

export default function Abas() {
  const { sessao, carregando } = useSessao();
  const c = useCores();
  // Em telas largas (computador, tablet) a navegação vai para a lateral; no celular fica embaixo.
  const lateral = useWindowDimensions().width >= 768;
  if (carregando) return <Carregando />;
  if (!sessao) return <Redirect href="/entrar" />;

  return (
    <Tabs
      tabBar={(props) => <BarraAbas {...props} lateral={lateral} />}
      screenOptions={{
        headerShown: false,
        tabBarPosition: lateral ? 'left' : 'bottom',
        sceneStyle: { backgroundColor: c.fundo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoje' }} />
      <Tabs.Screen name="horta" options={{ title: 'Minha horta' }} />
      <Tabs.Screen name="calendario" options={{ title: 'Calendário' }} />
      <Tabs.Screen name="plantas" options={{ title: 'Plantas' }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta' }} />
    </Tabs>
  );
}
