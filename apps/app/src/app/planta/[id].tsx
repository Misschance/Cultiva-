import { avaliarLuz, mensagemLuz } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import type { EstagioVisual } from '@cultivae/core';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { Aviso, Botao, Cartao, Carregando, Opcoes, Paragrafo, Subtitulo, Tela, Titulo, Texto, useCores } from '../../components/ui';
import { PlantaViva } from '../../components/planta-viva';
import { carregarFicha, type Ficha } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';

const ESTAGIOS: { valor: EstagioVisual; texto: string }[] = [
  { valor: 'broto', texto: 'Broto' },
  { valor: 'folhas', texto: 'Folhas' },
  { valor: 'crescendo', texto: 'Crescendo' },
  { valor: 'colheita', texto: 'Colheita' },
];

const CONFIANCA: Record<string, string> = {
  A: 'Conferido na fonte original',
  B: 'Fonte técnica lida por resumo, falta conferir a página',
  C: 'Ainda sem fonte técnica: conhecimento prático',
};

function Item({ titulo, texto, confianca }: { titulo: string; texto: unknown; confianca?: unknown }) {
  const cores = useCores();
  if (texto === null || texto === undefined || texto === '') return null;
  const nivel = typeof confianca === 'string' ? confianca : null;
  return (
    <View style={{ gap: 2 }}>
      <Texto style={{ fontSize: 15, fontWeight: '600', color: cores.texto }}>{titulo}</Texto>
      <Paragrafo>{String(texto)}</Paragrafo>
      {nivel && (
        <Texto style={{ fontSize: 13, color: nivel === 'C' ? cores.alerta : cores.textoSuave }}>
          Confiança {nivel}: {CONFIANCA[nivel]}
        </Texto>
      )}
    </View>
  );
}

export default function FichaPlanta() {
  const cores = useCores();
  const { id } = useLocalSearchParams<{ id: string }>();
  const especie = id ? ESPECIES.get(id) : undefined;
  const { dados } = useHorta();
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [estagio, setEstagio] = useState<EstagioVisual>('crescendo');

  useEffect(() => {
    if (!especie) return;
    carregarFicha(especie.id).then(setFicha, (e: Error) => setErro(e.message));
  }, [especie]);

  if (!especie) return <Tela><Aviso tipo="erro">Planta não encontrada.</Aviso></Tela>;

  const e = ficha?.especie;
  const intervalo = especie.regaAdultaIntervaloDias;

  return (
    <Tela>
      <View style={{ alignItems: 'center', borderRadius: 24, backgroundColor: cores.verdeClaro, paddingTop: 12 }}>
        <PlantaViva especieId={especie.id} nome={especie.nomePopular} estagio={estagio} tamanho={220} />
      </View>
      <Opcoes rotulo="Ver a planta" opcoes={ESTAGIOS} valor={estagio} onChange={setEstagio} />
      <Titulo>{especie.nomePopular}</Titulo>
      <Texto style={{ fontSize: 15, fontStyle: 'italic', color: cores.textoSuave }}>{especie.nomeCientifico}</Texto>
      {especie.dicaAcessivel ? <Aviso tipo="ok">{especie.dicaAcessivel}</Aviso> : null}
      <Botao titulo="Plantar esta" onPress={() => router.push({ pathname: '/plantio/novo', params: { especie: especie.id } })} />

      {erro && <Aviso tipo="erro">{erro} Os dados básicos abaixo vêm do app.</Aviso>}

      <Cartao>
        <Item
          titulo="Água"
          texto={e?.agua_como_regar ?? `Planta formada: a cada ${intervalo.min}${intervalo.max !== intervalo.min ? ` a ${intervalo.max}` : ''} dia(s).`}
          confianca={e?.agua_confianca}
        />
        <Item
          titulo="Luz"
          texto={`${especie.localIdeal}${especie.luzHorasMin ? `, pelo menos ${especie.luzHorasMin} horas de sol direto` : ''}`}
          confianca={e?.luz_confianca}
        />
        <Item titulo="Solo" texto={e?.solo} />
        <Item titulo="Adubo no plantio" texto={e?.adubo_plantio} confianca={e?.adubo_confianca} />
        <Item titulo="Adubo de cobertura" texto={e?.adubo_cobertura} confianca={e?.adubo_confianca} />
        <Item
          titulo="Germinação"
          texto={especie.germinacaoDias ? `${especie.germinacaoDias.min} a ${especie.germinacaoDias.max} dias` : null}
          confianca={e?.germinacao_confianca}
        />
        <Item titulo="Como plantar" texto={especie.propagacao} />
        <Item titulo="Espaçamento (cm)" texto={e?.espacamento_cm} />
        <Item
          titulo="Colheita"
          texto={
            especie.colheitaInicioDias
              ? `Começa entre ${especie.colheitaInicioDias.min} e ${especie.colheitaInicioDias.max} dias após o plantio`
              : null
          }
          confianca={e?.colheita_confianca}
        />
        <Item titulo="Ponto de colheita" texto={especie.pontoColheita?.texto} confianca={especie.pontoColheita?.confianca} />
        <Item titulo="Clima" texto={e?.clima_temperatura} />
      </Cartao>

      {(dados?.locais ?? []).some((l) => l.horasSol != null) && (
        <>
          <Subtitulo>Nos seus locais</Subtitulo>
          {dados!.locais
            .filter((l) => l.horasSol != null)
            .map((l) => {
              const a = avaliarLuz(especie, l);
              return (
                <Paragrafo key={l.id}>
                  {a.situacao === 'adequada' ? `${l.nome}: tem o sol que ela pede (${String(l.horasSol).replace('.', ',')} h).` : mensagemLuz(especie, l.nome, a)}
                </Paragrafo>
              );
            })}
        </>
      )}

      <Subtitulo>Fases</Subtitulo>
      {especie.fases.map((f) => (
        <Cartao key={f.ordem}>
          <Texto style={{ fontSize: 16, fontWeight: '600', color: cores.texto }}>
            {f.nome}
            {f.diaInicio != null ? ` · dia ${f.diaInicio}${f.diaFim != null ? ` a ${f.diaFim}` : ' em diante'}` : ''}
          </Texto>
          <Item titulo="Rega" texto={f.rega} />
          <Item titulo="Adubação" texto={f.adubacao} />
          <Item titulo="Cuidados" texto={f.intervencoes} confianca={f.confianca} />
        </Cartao>
      ))}

      {ficha && ficha.epocas.length > 0 && (
        <>
          <Subtitulo>Quando plantar</Subtitulo>
          <Cartao>
            {ficha.epocas.map((ep, i) => (
              <Paragrafo key={i}>
                {ep.regiao}
                {ep.variedade ? ` (${ep.variedade})` : ''}: {ep.recomendado === false ? 'não recomendado' : ep.texto ?? '-'}
              </Paragrafo>
            ))}
          </Cartao>
        </>
      )}

      {ficha && (
        <>
          <Subtitulo>Fontes</Subtitulo>
          {ficha.referencias.map((r) => (
            <Texto
              key={r.id}
              style={{ fontSize: 13, color: r.url ? cores.verdeEscuro : cores.textoSuave }}
              onPress={r.url ? () => void Linking.openURL(r.url!) : undefined}
              accessibilityRole={r.url ? 'link' : 'text'}
            >
              {r.id}. {r.citacao}
            </Texto>
          ))}
        </>
      )}
      {!ficha && !erro && <Carregando />}
    </Tela>
  );
}
