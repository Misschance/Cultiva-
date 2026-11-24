import { CATALOGO, NOME_LUZ_CASA, PLANTAS_DE_CASA, avaliarLuz, resumoPets, type SituacaoLuz } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { CasaViva } from '../../components/casa-viva';
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
  const [grupo, setGrupo] = useState<'horta' | 'casa'>('horta');
  const [filtroCasa, setFiltroCasa] = useState<'todas' | 'pets' | 'pouca-luz' | 'sol'>('todas');
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

  const listaCasa = useMemo(() => {
    const termo = normalizar(busca.trim());
    return PLANTAS_DE_CASA.filter((p) => {
      if (termo && !normalizar(`${p.nomePopular} ${p.outrosNomes ?? ''} ${p.nomeCientifico}`).includes(termo)) return false;
      if (filtroCasa === 'pets') return resumoPets(p).situacao === 'segura';
      if (filtroCasa === 'pouca-luz') return p.luz.categoria === 'pouca_luz' || p.luz.categoria === 'meia_sombra';
      if (filtroCasa === 'sol') return p.luz.categoria === 'sol_direto';
      return true;
    }).sort((a, b) => a.nomePopular.localeCompare(b.nomePopular, 'pt-BR'));
  }, [busca, filtroCasa]);

  return (
    <Tela topo>
      <Titulo>Plantas</Titulo>
      <Opcoes
        rotulo="Ver"
        valor={grupo}
        onChange={setGrupo}
        opcoes={[
          { valor: 'horta', texto: 'Horta e temperos' },
          { valor: 'casa', texto: 'Plantas de casa' },
        ]}
      />
      {grupo === 'horta' && <PlanteAgora cidade={dados?.perfil.cidade} hoje={hoje} />}
      <Campo
        rotulo="Buscar"
        value={busca}
        onChangeText={setBusca}
        placeholder={grupo === 'horta' ? 'Ex.: alface, tomate' : 'Ex.: jiboia, cacto'}
        maxLength={60}
        autoCorrect={false}
      />
      {grupo === 'casa' ? (
        <>
          <Opcoes
            rotulo="Mostrar"
            valor={filtroCasa}
            onChange={setFiltroCasa}
            opcoes={[
              { valor: 'todas', texto: 'Todas' },
              { valor: 'pets', texto: 'Não tóxicas para pets' },
              { valor: 'pouca-luz', texto: 'Aguentam pouca luz' },
              { valor: 'sol', texto: 'Gostam de sol' },
            ]}
          />
          {listaCasa.length === 0 && <Paragrafo suave>Nenhuma planta encontrada.</Paragrafo>}
          {listaCasa.map((p) => {
            const pets = resumoPets(p);
            return (
              <Cartao key={p.id} rotulo={p.nomePopular} onPress={() => router.push({ pathname: '/casa/[id]', params: { id: p.id } })}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 76, height: 76, borderRadius: 20, backgroundColor: cores.verdeClaro, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <CasaViva plantaId={p.id} nome={p.nomePopular} tamanho={76} />
                  </View>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Texto style={{ fontSize: 17, fontWeight: '600', color: cores.texto }}>{p.nomePopular}</Texto>
                    <Texto style={{ fontSize: 14, color: cores.textoSuave }}>{NOME_LUZ_CASA[p.luz.categoria]}</Texto>
                    <Texto style={{ fontSize: 13, fontWeight: '500', color: pets.situacao === 'toxica' ? cores.alerta : pets.situacao === 'segura' ? cores.verdeEscuro : cores.textoSuave }}>
                      {pets.situacao === 'segura' ? 'Não tóxica para pets' : pets.texto}
                    </Texto>
                  </View>
                </View>
              </Cartao>
            );
          })}
        </>
      ) : (
        <>
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
        </>
      )}
    </Tela>
  );
}
