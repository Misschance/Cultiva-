import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';

interface EstadoSessao {
  sessao: Session | null;
  carregando: boolean;
}

const ContextoSessao = createContext<EstadoSessao>({ sessao: null, carregando: true });

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoSessao>({ sessao: null, carregando: true });

  useEffect(() => {
    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (ativo) setEstado({ sessao: data.session, carregando: false });
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
      setEstado({ sessao, carregando: false });
    });
    return () => {
      ativo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <ContextoSessao.Provider value={estado}>{children}</ContextoSessao.Provider>;
}

export const useSessao = () => useContext(ContextoSessao);
