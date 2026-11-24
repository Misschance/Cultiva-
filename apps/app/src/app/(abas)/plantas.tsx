import { CATALOGO } from '@cultivae/core';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Text } from 'react-native';
import { Campo, Cartao, Opcoes, Paragrafo, Tela, Titulo, cores } from '../../components/ui';
import { NOME_GRUPO } from '../../lib/rotulos';

type Filtro = 'todas' | 'meia-sombra' | 'rapidas' | string;

/** Sem acento e minúsculo, para a busca achar "manjericao" e "Manjericão". */
const normalizar = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export default function Plantas() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todas');

  const grupos = [...new Set(CATALOGO.map((e) => e.grupo))];
  const lista = useMemo(() => {
    const termo = normalizar(busca.trim());
    return CATALOGO.filter((e) => {
      if (termo && !normalizar(`${e.nomePopular} ${e.nomeCientifico}`).includes(termo)) return false;
      if (filtro === 'meia-sombra') return e.localIdeal.includes('meia-sombra');
      if (filtro === 'rapidas') return (e.colheitaInicioDias?.min ?? Infinity) <= 60;
      if (filtro !== 'todas') return e.grupo === filtro;
      return true;
    }).sort((a, b) => a.nomePopular.localeCompare(b.nomePopular, 'pt-BR'));
  }, [busca, filtro]);

  return (
    <Tela>
      <Titulo>Plantas</Titulo>
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
      {lista.length === 0 && <Paragrafo suave>Nenhuma planta encontrada.</Paragrafo>}
      {lista.map((e) => (
        <Cartao key={e.id} rotulo={e.nomePopular} onPress={() => router.push({ pathname: '/planta/[id]', params: { id: e.id } })}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: cores.texto }}>{e.nomePopular}</Text>
          <Text style={{ fontSize: 14, fontStyle: 'italic', color: cores.textoSuave }}>{e.nomeCientifico}</Text>
          <Paragrafo suave>
            Luz: {e.localIdeal}
            {e.colheitaInicioDias ? ` · colheita a partir de ${e.colheitaInicioDias.min} dias` : ''}
          </Paragrafo>
        </Cartao>
      ))}
    </Tela>
  );
}
