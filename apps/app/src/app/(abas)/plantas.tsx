import { CATALOGO, avaliarLuz, type SituacaoLuz } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { PlanteAgora } from '../../components/plante-agora';
import { Campo, Cartao, Opcoes, Paragrafo, Tela, Titulo, Texto, useCores } from '../../components/ui';
import { useHorta } from '../../lib/horta';
import { NOME_GRUPO } from '../../lib/rotulos';

const TEXTO_LUZ: Record<SituacaoLuz, string | null> = {
  adequada: 'Tem o sol que pede',
  'aceita-meia-sombra': 'Aceita meia-sombra',
  'pouco-sol': 'Pouco sol para ela',
  'sem-dado': null,
};
const PESO: Record<SituacaoLuz, number> = { adequada: 0, 'aceita-meia-sombra': 1, 'sem-dado': 2, 'pouco-sol': 3 };

type Filtro = 'todas' | 'meia-sombra' | 'rapidas' | string;

/** Sem acento e minúsculo, para a busca achar "manjericao" e "Manjericão". */
const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export default function Plantas() {
  const cores = useCores();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const { local: localParam } = useLocalSearchParams<{ local?: string }>();
  const { dados, hoje } = useHorta();
  const locaisComSol = (dados?.locais ?? []).filter((l) => l.horasSol != null);
  const [localId, setLocalId] = useState<string>('nenhum');
  useEffect(() => {
    if (localParam) setLocalId(localParam);
  }, [localParam]);
  const local = locaisComSol.find((l) => l.id === localId);

  const grupos = [...new Set(CATALOGO.map((e) => e.grupo))];
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    return CATALOGO.filter((e) => {
      if (termo && !normalizar(`${e.nomePopular} ${e.nomeCientifico}`).includes(termo)) return false;
      if (filtro === 'meia-sombra') return e.localIdeal.includes('meia-sombra');
      if (filtro === 'rapidas') return (e.colheitaInicioDias?.min ?? Infinity) <= 60;
      if (filtro !== 'todas') return e.grupo === filtro;
      return true;
    })
      .map((e) => ({ e, luz: local ? avaliarLuz(e, local).situacao : null }))
      .sort((a, b) => (a.luz && b.luz ? PESO[a.luz] - PESO[b.luz] : 0) || a.e.nomePopular.localeCompare(b.e.nomePopular, 'pt-BR'));
  }, [busca, filtro, local]);

  return (
    <Tela topo>
      <Titulo>Plantas</Titulo>
      <PlanteAgora cidade={dados?.perfil.cidade} hoje={hoje} />
      <Campo rotulo="Buscar" value={busca} onChangeText={setBusca} placeholder="Ex.: alface, tomate" maxLength={60} autoCorrect={false} />
      <Opcoes
        rotulo="Mostrar"
        valor={filtro}
        onChange={setFiltro}
        opcoes={[
          { valor: 'todas', texto: 'Todas' },
          { valor: 'meia-sombra', texto: 'Aceitam meia-sombra' },
          { valor: 'rapidas', texto: 'Colheita em até 60 dias' },
          ...grupos.map((g) => ({ valor: g, texto: NOME_GRUPO[g] ?? g })),
        ]}
      />
      {locaisComSol.length > 0 && (
        <Opcoes
          rotulo="O que posso plantar em"
          valor={local ? localId : 'nenhum'}
          onChange={setLocalId}
          opcoes={[{ valor: 'nenhum', texto: 'Qualquer lugar' }, ...locaisComSol.map((l) => ({ valor: l.id, texto: l.nome }))]}
        />
      )}
      {lista.length === 0 && <Paragrafo suave>Nenhuma planta encontrada.</Paragrafo>}
      {lista.map(({ e, luz }) => (
        <Cartao key={e.id} rotulo={e.nomePopular} onPress={() => router.push({ pathname: '/planta/[id]', params: { id: e.id } })}>
          <Texto style={{ fontSize: 17, fontWeight: '600', color: cores.texto }}>{e.nomePopular}</Texto>
          <Texto style={{ fontSize: 14, fontStyle: 'italic', color: cores.textoSuave }}>{e.nomeCientifico}</Texto>
          <Paragrafo suave>
            Luz: {e.localIdeal}
            {e.colheitaInicioDias ? ` · colheita a partir de ${e.colheitaInicioDias.min} dias` : ''}
          </Paragrafo>
          {luz && TEXTO_LUZ[luz] && (
            <Texto style={{ fontSize: 14, color: luz === 'pouco-sol' ? cores.alerta : cores.verdeEscuro }}>
              {TEXTO_LUZ[luz]} em {local?.nome}
            </Texto>
          )}
        </Cartao>
      ))}
    </Tela>
  );
}
