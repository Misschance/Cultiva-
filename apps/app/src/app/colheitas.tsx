import { calendarioColheitas, formatarData } from '@cultivae/core';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { View } from 'react-native';
import { Cartao, Carregando, Paragrafo, Subtitulo, Tela, Titulo, Texto, useCores } from '../components/ui';
import { ESPECIES, useHorta } from '../lib/horta';

/** Calendário de colheitas por semana (RF-4.5): quanto vai dar para colher e quando. */
export default function Colheitas() {
  const cores = useCores();
  const { dados, hoje } = useHorta();
  const semanas = useMemo(() => {
    if (!dados) return [];
    const itens = dados.plantios.flatMap((plantio) => {
      const especie = ESPECIES.get(plantio.especieId);
      return especie ? [{ plantio, especie, quantidade: plantio.quantidade }] : [];
    });
    return calendarioColheitas(itens, hoje, 12);
  }, [dados, hoje]);

  if (!dados) return <Carregando />;
  const plantios = new Map(dados.plantios.map((p) => [p.id, p]));
  const comColheita = semanas.filter((s) => s.colheitas.length > 0);

  return (
    <Tela>
      <Titulo>Colheitas</Titulo>
      <Paragrafo suave>
        Próximas 12 semanas. Cada planta aparece nas semanas em que a colheita pode começar, segundo a ficha. A data real
        depende do clima e da variedade.
      </Paragrafo>
      {comColheita.length === 0 && <Paragrafo>Nenhuma colheita prevista nas próximas 12 semanas.</Paragrafo>}
      {comColheita.map((s) => (
        <View key={s.inicio} style={{ gap: 8 }}>
          <Subtitulo>
            {s.inicio === semanas[0]?.inicio ? 'Esta semana' : `Semana de ${formatarData(s.inicio).slice(0, 5)} a ${formatarData(s.fim).slice(0, 5)}`}
          </Subtitulo>
          <Paragrafo>
            {s.porEspecie
              .map((e) => `${ESPECIES.get(e.especieId)?.nomePopular ?? e.especieId}: ${e.quantidade} ${e.quantidade === 1 ? 'pé' : 'pés'}`)
              .join(' · ')}
          </Paragrafo>
          {s.colheitas.map((c) => {
            const p = plantios.get(c.plantioId);
            const especie = ESPECIES.get(c.especieId);
            if (!p || !especie) return null;
            return (
              <Cartao key={c.plantioId} rotulo={p.apelido || especie.nomePopular} onPress={() => router.push({ pathname: '/plantio/[id]', params: { id: p.id } })}>
                <Texto style={{ fontSize: 16, fontWeight: '600', color: cores.texto }}>
                  {p.apelido || especie.nomePopular} ({c.quantidade})
                </Texto>
                <Paragrafo suave>
                  {c.abreNestaSemana ? 'A colheita pode começar nesta semana' : 'Ainda na janela de início da colheita'} · plantada em{' '}
                  {formatarData(p.dataPlantio)}
                </Paragrafo>
              </Cartao>
            );
          })}
        </View>
      ))}
    </Tela>
  );
}
