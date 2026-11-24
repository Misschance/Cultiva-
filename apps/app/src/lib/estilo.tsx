import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { ContextoEstilo, ESTILOS, type Estilo } from '../components/tema';

const CHAVE = 'cultivae.estilo';
const valido = (v: unknown): v is Estilo => ESTILOS.some((e) => e.valor === v);

async function lerSalvo(): Promise<Estilo | null> {
  try {
    if (Platform.OS === 'web') {
      // Na web, ?estilo=vidro na URL permite comparar os estilos sem entrar na conta.
      const daUrl = new URLSearchParams(globalThis.location?.search ?? '').get('estilo');
      if (valido(daUrl)) return daUrl;
      const v = globalThis.localStorage?.getItem(CHAVE);
      return valido(v) ? v : null;
    }
    const v = await SecureStore.getItemAsync(CHAVE);
    return valido(v) ? v : null;
  } catch {
    return null;
  }
}

async function salvar(estilo: Estilo) {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(CHAVE, estilo);
    else await SecureStore.setItemAsync(CHAVE, estilo);
  } catch {
    // Preferência visual: se não der para guardar, vale só nesta sessão.
  }
}

/** Estilo visual escolhido na aba Conta, guardado só no aparelho. */
export function ProvedorEstilo({ children }: { children: ReactNode }) {
  const [estilo, setEstiloState] = useState<Estilo>('doca');
  useEffect(() => {
    void lerSalvo().then((v) => v && setEstiloState(v));
  }, []);
  const valor = useMemo(
    () => ({
      estilo,
      setEstilo: (e: Estilo) => {
        setEstiloState(e);
        void salvar(e);
      },
    }),
    [estilo],
  );
  return <ContextoEstilo.Provider value={valor}>{children}</ContextoEstilo.Provider>;
}
