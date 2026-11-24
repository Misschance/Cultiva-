import {
  buscarPrevisao,
  CATALOGO,
  PLANTAS_DE_CASA,
  conferenciasDoDia,
  hojeNoFuso,
  regiaoDaCidade,
  tarefasDoDia,
  type DataISO,
  type Especie,
  type PlantaDeCasa,
  type SituacaoCasa,
  type PrevisaoDia,
  type Tarefa,
} from '@cultivae/core';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { carregarHorta, type DadosHorta, type LocalComNome, type PlantioCompleto } from './dados';
import { agendarLembretes } from './lembretes';
import { useSessao } from './sessao';

export const ESPECIES: ReadonlyMap<string, Especie> = new Map(CATALOGO.map((e) => [e.id, e]));
export const CASA: ReadonlyMap<string, PlantaDeCasa> = new Map(PLANTAS_DE_CASA.map((p) => [p.id, p]));

interface EstadoHorta {
  dados: DadosHorta | null;
  carregando: boolean;
  erro: string | null;
  hoje: DataISO;
  previsaoHoje: PrevisaoDia | null;
  tarefas: Tarefa[];
  /** Plantas de casa com a terra para conferir hoje. */
  conferencias: SituacaoCasa[];
  locais: ReadonlyMap<string, LocalComNome>;
  plantios: ReadonlyMap<string, PlantioCompleto>;
  recarregar: () => Promise<void>;
}

const Contexto = createContext<EstadoHorta | null>(null);

export function ProvedorHorta({ children }: { children: ReactNode }) {
  const { sessao } = useSessao();
  const usuarioId = sessao?.user.id ?? null;
  const [dados, setDados] = useState<DadosHorta | null>(null);
  const [previsao, setPrevisao] = useState<PrevisaoDia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!usuarioId) return;
    setErro(null);
    try {
      setDados(await carregarHorta(usuarioId));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível carregar sua horta.');
    } finally {
      setCarregando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    if (!usuarioId) {
      setDados(null);
      return;
    }
    setCarregando(true);
    void recarregar();
  }, [usuarioId, recarregar]);

  // Previsão do tempo da cidade do usuário (só se ele escolheu uma cidade).
  const lat = dados?.perfil.lat ?? null;
  const lon = dados?.perfil.lon ?? null;
  useEffect(() => {
    if (lat === null || lon === null) {
      setPrevisao([]);
      return;
    }
    let ativo = true;
    buscarPrevisao(lat, lon)
      .then((p) => ativo && setPrevisao(p))
      .catch(() => ativo && setPrevisao([])); // sem clima, a agenda segue sem ajuste
    return () => {
      ativo = false;
    };
  }, [lat, lon]);

  const fuso = dados?.perfil.fuso ?? 'America/Sao_Paulo';
  const hoje = hojeNoFuso(new Date(), fuso);
  const previsaoHoje = previsao.find((p) => p.data === hoje) ?? null;

  const valor = useMemo<EstadoHorta>(() => {
    const locais = new Map((dados?.locais ?? []).map((l) => [l.id, l]));
    const plantios = new Map((dados?.plantios ?? []).map((p) => [p.id, p]));
    const tarefas = dados
      ? tarefasDoDia({
          plantios: dados.plantios,
          especies: ESPECIES as Map<string, Especie>,
          locais,
          registros: dados.registros,
          previsaoHoje: previsaoHoje ? new Map(dados.locais.map((l) => [l.id, previsaoHoje])) : undefined,
          hoje,
        })
      : [];
    const conferencias = dados?.casa
      ? conferenciasDoDia(dados.casa.plantas, CASA, dados.casa.registros, hoje, regiaoDaCidade(dados.perfil.cidade))
      : [];
    return { dados, carregando, erro, hoje, previsaoHoje, tarefas, conferencias, locais, plantios, recarregar };
  }, [dados, carregando, erro, hoje, previsaoHoje, recarregar]);

  // Reagenda os lembretes do celular sempre que a horta muda.
  useEffect(() => {
    if (dados) void agendarLembretes(dados, hoje).catch(() => undefined);
  }, [dados, hoje]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useHorta(): EstadoHorta {
  const valor = useContext(Contexto);
  if (!valor) throw new Error('useHorta fora do ProvedorHorta');
  return valor;
}
