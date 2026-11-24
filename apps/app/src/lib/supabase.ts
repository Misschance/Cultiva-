import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';
import { armazenamentoSeguro } from './armazenamento-seguro';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chaveAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(url && chaveAnon);

if (url && !url.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL precisa usar https (SEG-18).');
}

const nativo = Platform.OS !== 'web';

export const supabase = createClient(url ?? 'https://nao-configurado.invalid', chaveAnon ?? 'nao-configurado', {
  auth: {
    // No celular a sessão fica no armazenamento seguro do sistema; na web, no armazenamento do navegador.
    ...(nativo ? { storage: armazenamentoSeguro } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: !nativo,
    flowType: 'pkce',
  },
});

// No celular, só renova o token com o app em primeiro plano.
if (nativo) {
  AppState.addEventListener('change', (estado) => {
    if (estado === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
