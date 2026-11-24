import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ProvedorSessao } from '../lib/sessao';

export default function Layout() {
  return (
    <ProvedorSessao>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerTintColor: '#2E7D32' }}>
        <Stack.Screen name="index" options={{ title: 'Cultivaê' }} />
        <Stack.Screen name="entrar" options={{ title: 'Entrar' }} />
      </Stack>
    </ProvedorSessao>
  );
}
