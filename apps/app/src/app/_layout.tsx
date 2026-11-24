import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { cores } from '../components/ui';
import { ProvedorHorta } from '../lib/horta';
import { ProvedorSessao } from '../lib/sessao';

export default function Layout() {
  return (
    <ProvedorSessao>
      <ProvedorHorta>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerTintColor: cores.verdeEscuro, headerBackTitle: 'Voltar' }}>
          <Stack.Screen name="(abas)" options={{ headerShown: false }} />
          <Stack.Screen name="entrar" options={{ title: 'Entrar' }} />
          <Stack.Screen name="planta/[id]" options={{ title: 'Ficha da planta' }} />
          <Stack.Screen name="plantio/novo" options={{ title: 'Plantar' }} />
          <Stack.Screen name="plantio/[id]" options={{ title: 'Planta' }} />
          <Stack.Screen name="local/novo" options={{ title: 'Novo local' }} />
          <Stack.Screen name="local/[id]" options={{ title: 'Local' }} />
          <Stack.Screen name="colheitas" options={{ title: 'Calendário de colheitas' }} />
          <Stack.Screen name="diario/[id]" options={{ title: 'Diário' }} />
        </Stack>
      </ProvedorHorta>
    </ProvedorSessao>
  );
}
