import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { Carregando, cores } from '../../components/ui';
import { useSessao } from '../../lib/sessao';

export default function Abas() {
  const { sessao, carregando } = useSessao();
  if (carregando) return <Carregando />;
  if (!sessao) return <Redirect href="/entrar" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: cores.verdeEscuro,
        headerTintColor: cores.verdeEscuro,
        tabBarLabelStyle: { fontSize: 13 },
        tabBarIconStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoje' }} />
      <Tabs.Screen name="horta" options={{ title: 'Minha horta' }} />
      <Tabs.Screen name="plantas" options={{ title: 'Plantas' }} />
      <Tabs.Screen name="conta" options={{ title: 'Conta' }} />
    </Tabs>
  );
}
