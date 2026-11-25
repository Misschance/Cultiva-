import { avaliarLuz, mensagemLuz, type EstagioVisual } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, View } from 'react-native';
import { PlantaViva } from '../../components/planta-viva';
import { Aviso, Botao, Carregando, Colunas, Dado, Fato, Opcoes, Paragrafo, Secao, Subtitulo, Tela, Texto, Titulo, fontes, useCores } from '../../components/ui';
import { carregarFicha, type Ficha } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';

const ESTAGIOS: { valor: EstagioVisual; texto: string }[] = [
  { valor: 'broto', texto: 'Broto' },
  { valor: 'folhas', texto: 'Folhas' },
  { valor: 'crescendo', texto: 'Crescendo' },
  { valor: 'colheita', texto: 'Colheita' },
];

const faixa = (f: { min: number; max: number } | null | undefined, unidade: string) =>
  f ? `${f.min}${f.max !== f.min ? ` a ${f.max}` : ''} ${unidade}` : '—';

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
  const locaisComSol = (dados?.locais ?? []).filter((l) => l.horasSol != null);
  const fases = [...especie.fases].sort((a, b) => a.ordem - b.ordem);

  return (
    <Tela largura="larga">
      <Colunas
        larguraFixa={420}
        esquerda={
          <>
            <View style={{ alignItems: 'center', borderRadius: 24, backgroundColor: cores.verdeClaro, paddingTop: 12 }}>
              <PlantaViva especieId={especie.id} nome={especie.nomePopular} estagio={estagio} tamanho={220} />
            </View>
            <Opcoes rotulo="Ver a planta" opcoes={ESTAGIOS} valor={estagio} onChange={setEstagio} />

            <View style={{ gap: 2 }}>
              <Titulo>{especie.nomePopular}</Titulo>
              <Texto style={{ fontSize: 15, fontStyle: 'italic', color: cores.textoSuave }}>{especie.nomeCientifico}</Texto>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              <Fato rotulo="Sol" valor={especie.luzHorasMin ? `${especie.luzHorasMin} h ou mais` : '—'} detalhe={especie.localIdeal} />
              <Fato rotulo="Rega da planta formada" valor={`A cada ${faixa(intervalo, intervalo.max === 1 ? 'dia' : 'dias')}`} />
              <Fato rotulo="Germina em" valor={faixa(especie.germinacaoDias, 'dias')} />
              <Fato rotulo="Colheita a partir de" valor={faixa(especie.colheitaInicioDias, 'dias')} />
            </View>

            {especie.dicaAcessivel ? <Aviso tipo="ok">{especie.dicaAcessivel}</Aviso> : null}
            <Botao titulo="Plantar esta" onPress={() => router.push({ pathname: '/plantio/novo', params: { especie: especie.id } })} />
            {erro && <Aviso tipo="erro">{erro} Os dados básicos acima vêm do app.</Aviso>}
          </>
        }
      >
        <Subtitulo>Como cuidar</Subtitulo>
        <Secao titulo="Água" resumo={e?.agua_como_regar ? String(e.agua_como_regar) : undefined} inicialAberta>
          <Dado
            titulo="Como regar"
            texto={e?.agua_como_regar ?? `Planta formada: a cada ${faixa(intervalo, 'dia(s)')}.`}
            confianca={e?.agua_confianca}
          />
        </Secao>
        <Secao titulo="Luz" resumo={especie.localIdeal}>
          <Dado
            titulo="Onde colocar"
            texto={`${especie.localIdeal}${especie.luzHorasMin ? `, pelo menos ${especie.luzHorasMin} horas de sol direto` : ''}.`}
            confianca={e?.luz_confianca}
          />
          {locaisComSol.map((l) => {
            const a = avaliarLuz(especie, l);
            return (
              <Paragrafo key={l.id} suave>
                {a.situacao === 'adequada' ? `${l.nome}: tem o sol que ela pede (${String(l.horasSol).replace('.', ',')} h).` : mensagemLuz(especie, l.nome, a)}
              </Paragrafo>
            );
          })}
        </Secao>
        {(e?.solo || e?.adubo_plantio || e?.adubo_cobertura) && (
          <Secao titulo="Solo e adubo">
            <Dado titulo="Solo" texto={e?.solo} />
            <Dado titulo="Adubo no plantio" texto={e?.adubo_plantio} confianca={e?.adubo_confianca} />
            <Dado titulo="Adubo de cobertura" texto={e?.adubo_cobertura} confianca={e?.adubo_confianca} />
          </Secao>
        )}
        <Secao titulo="Plantio" resumo={especie.propagacao}>
          <Dado titulo="Como plantar" texto={especie.propagacao} />
          <Dado titulo="Espaçamento (cm)" texto={e?.espacamento_cm} />
          <Dado titulo="Germinação" texto={especie.germinacaoDias ? faixa(especie.germinacaoDias, 'dias') : null} confianca={e?.germinacao_confianca} />
          <Dado titulo="Clima" texto={e?.clima_temperatura} />
        </Secao>
        <Secao titulo="Colheita" resumo={especie.pontoColheita?.texto}>
          <Dado
            titulo="Quando"
            texto={especie.colheitaInicioDias ? `Começa entre ${especie.colheitaInicioDias.min} e ${especie.colheitaInicioDias.max} dias após o plantio.` : null}
            confianca={e?.colheita_confianca}
          />
          <Dado titulo="Ponto de colheita" texto={especie.pontoColheita?.texto} confianca={especie.pontoColheita?.confianca} />
        </Secao>

        <Subtitulo>Fases</Subtitulo>
        <View>
          {fases.map((f, i) => (
            <View key={f.ordem} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ alignItems: 'center', width: 16 }}>
                <View style={{ width: 12, height: 12, borderRadius: 6, marginTop: 22, backgroundColor: cores.verde }} />
                {i < fases.length - 1 && <View style={{ flex: 1, width: 2, backgroundColor: cores.borda }} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 10 }}>
                <Secao
                  titulo={f.nome.charAt(0).toUpperCase() + f.nome.slice(1)}
                  resumo={f.diaInicio != null ? `Dia ${f.diaInicio}${f.diaFim != null ? ` a ${f.diaFim}` : ' em diante'}` : undefined}
                >
                  <Dado titulo="Rega" texto={f.rega} />
                  <Dado titulo="Adubação" texto={f.adubacao} />
                  <Dado titulo="Cuidados" texto={f.intervencoes} confianca={f.confianca} />
                </Secao>
              </View>
            </View>
          ))}
        </View>

        {ficha && ficha.epocas.length > 0 && (
          <>
            <Subtitulo>Quando plantar</Subtitulo>
            <View style={{ borderRadius: 20, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.cartao, overflow: 'hidden' }}>
              {ficha.epocas.map((ep, i) => (
                <View
                  key={i}
                  style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: cores.borda }}
                >
                  <View style={{ width: 110 }}>
                    <Texto style={{ fontWeight: '600', fontSize: 15 }}>{ep.regiao}</Texto>
                    {ep.variedade ? <Texto style={{ fontSize: 12, color: cores.textoSuave }}>{ep.variedade}</Texto> : null}
                  </View>
                  <Texto style={{ flex: 1, fontSize: 15, color: ep.recomendado === false ? cores.textoSuave : cores.texto }}>
                    {ep.recomendado === false ? 'Não recomendado' : ep.texto ?? '—'}
                  </Texto>
                </View>
              ))}
            </View>
          </>
        )}

        {ficha && ficha.referencias.length > 0 && (
          <Secao titulo="Fontes" resumo={ficha.referencias.length === 1 ? "1 referência técnica" : `${ficha.referencias.length} referências técnicas`}>
            {ficha.referencias.map((r) => (
              <Texto
                key={r.id}
                style={{ fontSize: 13, color: r.url ? cores.verde : cores.textoSuave, fontFamily: fontes.texto }}
                onPress={r.url ? () => void Linking.openURL(r.url!) : undefined}
                accessibilityRole={r.url ? 'link' : 'text'}
              >
                {r.id}. {r.citacao}
              </Texto>
            ))}
          </Secao>
        )}
        {!ficha && !erro && <Carregando />}
      </Colunas>
    </Tela>
  );
}
