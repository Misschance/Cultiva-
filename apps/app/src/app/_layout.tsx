import { BricolageGrotesque_600SemiBold } from '@expo-google-fonts/bricolage-grotesque';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { BotaoMenu, BotaoVoltar } from '../components/navegacao';
import { fontes, useCores, useEscuro } from '../components/ui';
import { ProvedorHorta } from '../lib/horta';
import { ProvedorSessao } from '../lib/sessao';

function useTemaNavegacao(): Theme {
  const escuro = useEscuro();
  const c = useCores();
  const base = escuro ? DarkTheme : DefaultTheme;
  return {
    ...base,
    dark: escuro,
    colors: { ...base.colors, primary: c.verde, background: c.fundo, card: c.cartao, text: c.texto, border: c.borda, notification: c.alerta },
  };
}

export default function Layout() {
  // Fontes vão no pacote do app: nada é buscado em servidor de terceiros.
  const [fontesProntas, falhaFontes] = useFonts({ BricolageGrotesque_600SemiBold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold });
  const tema = useTemaNavegacao();
  const c = useCores();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(c.fundo).catch(() => undefined);
  }, [c.fundo]);

  if (!fontesProntas && !falhaFontes) return null;

  return (
    <ThemeProvider value={tema}>
      <ProvedorSessao>
        <ProvedorHorta>
          <StatusBar style={tema.dark ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerTintColor: c.texto,
              headerBackTitle: 'Voltar',
              headerShadowVisible: false,
              headerStyle: { backgroundColor: c.fundo },
              headerTitleStyle: { fontFamily: fontes.forte },
              contentStyle: { backgroundColor: c.fundo },
              animation: 'slide_from_right',
              // Voltar sempre aparece (mesmo sem histórico, como ao recarregar a página) e o Início leva ao menu.
              headerLeft: () => <BotaoVoltar />,
              headerRight: () => <BotaoMenu />,
            }}
          >
            <Stack.Screen name="(abas)" options={{ headerShown: false }} />
            <Stack.Screen name="entrar" options={{ title: 'Entrar', headerLeft: () => null, headerRight: () => null }} />
            <Stack.Screen name="planta/[id]" options={{ title: '' }} />
            <Stack.Screen name="plantio/novo" options={{ title: 'Plantar' }} />
            <Stack.Screen name="plantio/[id]" options={{ title: '' }} />
            <Stack.Screen name="local/novo" options={{ title: 'Novo local' }} />
            <Stack.Screen name="local/[id]" options={{ title: 'Local' }} />
            <Stack.Screen name="colheitas" options={{ title: 'Calendário de colheitas' }} />
            <Stack.Screen name="diario/[id]" options={{ title: 'Diário' }} />
          </Stack>
        </ProvedorHorta>
      </ProvedorSessao>
    </ThemeProvider>
  );
}
