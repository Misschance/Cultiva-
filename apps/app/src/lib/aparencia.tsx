import * as SecureStore from 'expo-secure-store';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';
import { ContextoAparencia, MODOS, type Modo } from '../components/tema';

const CHAVE = 'cultivae.aparencia';
const valido = (v: unknown): v is Modo => MODOS.some((m) => m.valor === v);

async function lerSalvo(): Promise<Modo | null> {
  try {
    const v = Platform.OS === 'web' ? globalThis.localStorage?.getItem(CHAVE) : await SecureStore.getItemAsync(CHAVE);
    return valido(v) ? v : null;
  } catch {
    return null;
  }
}

async function salvar(modo: Modo) {
  try {
    if (Platform.OS === 'web') globalThis.localStorage?.setItem(CHAVE, modo);
    else await SecureStore.setItemAsync(CHAVE, modo);
  } catch {
    // Preferência visual: se não der para guardar, vale só nesta sessão.
  }
}

/** Claro, escuro ou automático, escolhido pela pessoa e guardado só no aparelho. */
export function ProvedorAparencia({ children }: { children: ReactNode }) {
  const [modo, setModoState] = useState<Modo>('sistema');
  useEffect(() => {
    void lerSalvo().then((v) => v && setModoState(v));
  }, []);
  const valor = useMemo(
    () => ({
      modo,
      setModo: (m: Modo) => {
        setModoState(m);
        void salvar(m);
      },
    }),
    [modo],
  );
  return <ContextoAparencia.Provider value={valor}>{children}</ContextoAparencia.Provider>;
}
