import {
  faseAposGerminacao,
  faseAtual,
  formatarData,
  germinacaoConfirmada,
  janelaColheita,
  janelaGerminacao,
  NOME_UNIDADE,
  proximaRega,
  type UnidadeColheita,
} from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Aviso, BarraProgresso, Botao, Campo, Cartao, Dado, Fato, Opcoes, Paragrafo, Secao, Selo, Subtitulo, Tela, Texto, Titulo, useCores } from '../../components/ui';
import { confirmarFase, encerrarPlantio, novaColheita, registrarAcao, registrarColheita } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';
import { NOME_ORIGEM } from '../../lib/rotulos';
import { resumirPlanta } from '../../lib/visual';
import { PlantaViva } from '../../components/planta-viva';

const NOME_ACAO: Record<string, string> = {
  rega: 'Rega',
  adubacao: 'Adubação',
  poda: 'Poda',
  desbaste: 'Desbaste',
  tutoramento: 'Tutoramento',
  transplante: 'Transplante',
  colheita: 'Colheita',
};

const opcoesUnidade = (Object.keys(NOME_UNIDADE) as UnidadeColheita[]).map((u) => ({ valor: u, texto: NOME_UNIDADE[u] }));

export default function DetalhePlantio() {
  const cores = useCores();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, plantios, locais, hoje, previsaoHoje, tarefas, recarregar } = useHorta();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [colhendo, setColhendo] = useState(false);
  const [quantidade, setQuantidade] = useState('');
  const [unidade, setUnidade] = useState<UnidadeColheita>('unidades');

  const plantio = id ? plantios.get(id) : undefined;
  const especie = plantio ? ESPECIES.get(plantio.especieId) : undefined;
  const local = plantio ? locais.get(plantio.localId) : undefined;
  if (!plantio || !especie || !local) {
    return <Tela><Aviso>Esta planta não está mais na sua horta.</Aviso></Tela>;
  }

  const fase = faseAtual(plantio, especie, hoje);
  const resumo = resumirPlanta(plantio, especie, local, tarefas, hoje);
  const historico = (dados?.registros ?? []).filter((r) => r.plantioId === plantio.id);
  const ultimaRega = historico.find((r) => r.tipo === 'rega')?.data ?? null;
  const rega = proximaRega({
    especie,
    fase,
    local,
    dataPlantio: plantio.dataPlantio,
    ultimaRega,
    hoje,
    previsaoHoje: previsaoHoje ?? undefined,
  });
  const germ = janelaGerminacao(plantio, especie);
  const colheita = janelaColheita(plantio, especie);
  const proximaFase = faseAposGerminacao(especie);
  const precisaConfirmar = germ && !germinacaoConfirmada(plantio, especie) && proximaFase;

  async function agir(chave: string, acao: () => Promise<unknown>, depois?: () => void) {
    setOcupado(chave);
    setErro(null);
    try {
      await acao();
      await recarregar();
      depois?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Algo deu errado.');
    } finally {
      setOcupado(null);
    }
  }

  return (
    <Tela>
      <View style={{ alignItems: 'center', borderRadius: 24, backgroundColor: cores.superficie, paddingTop: 12, overflow: 'hidden' }}>
        <PlantaViva especieId={especie.id} nome={resumo.nome} estagio={resumo.visual.estagio} sede={resumo.sede} chao={resumo.chao} tamanho={220} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <View style={{ flexShrink: 1 }}>
          <Titulo>{plantio.apelido || especie.nomePopular}</Titulo>
        </View>
        <Selo texto={resumo.selo.texto} alerta={resumo.selo.alerta} />
      </View>
      {resumo.visual.progresso !== null && (
        <View style={{ gap: 6 }}>
          <Texto style={{ fontSize: 13, color: cores.textoSuave }}>
            Dia {resumo.visual.dia} · {Math.round(resumo.visual.progresso * 100)}% do caminho até a colheita
          </Texto>
          <BarraProgresso valor={resumo.visual.progresso} alerta={resumo.sede} rotulo="Caminho até a colheita" />
        </View>
      )}
      <Paragrafo suave>
        {local.nome} · {NOME_ORIGEM[plantio.origem]} · plantada em {formatarData(plantio.dataPlantio)}
        {plantio.quantidade > 1 ? ` · ${plantio.quantidade} pés` : ''}
      </Paragrafo>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Fato
          rotulo="Próxima rega"
          valor={rega.atrasada ? 'Atrasada' : rega.devidaEm === hoje ? 'Hoje' : formatarData(rega.devidaEm)}
          detalhe={rega.atrasada ? `desde ${formatarData(rega.devidaEm)}` : undefined}
          alerta={rega.atrasada}
        />
        <Fato
          rotulo={colheita ? 'Colheita' : 'Germinação'}
          valor={colheita ? formatarData(colheita.inicio) : germ ? formatarData(germ.inicio) : '—'}
          detalhe={colheita ? `até ${formatarData(colheita.fim)}` : germ ? `até ${formatarData(germ.fim)}` : undefined}
        />
      </View>

      {rega.ajustes.map((a) => (
        <Paragrafo key={a} suave>
          {a}
        </Paragrafo>
      ))}
      <Botao
        titulo={ultimaRega === hoje ? 'Já reguei hoje' : 'Reguei hoje'}
        desativado={ultimaRega === hoje}
        carregando={ocupado === 'rega'}
        onPress={() => agir('rega', () => registrarAcao(plantio.id, 'rega', hoje))}
      />
      {precisaConfirmar && (
        <Cartao>
          <Paragrafo>
            Germinação esperada entre {formatarData(germ.inicio)} e {formatarData(germ.fim)}. Já nasceu?
          </Paragrafo>
          <Botao
            titulo="Germinou"
            variante="secundario"
            carregando={ocupado === 'germinou'}
            onPress={() => agir('germinou', () => confirmarFase(plantio.id, proximaFase.nome, hoje))}
          />
        </Cartao>
      )}

      <Subtitulo>Cuidados agora</Subtitulo>
      <Secao titulo={`Fase: ${fase.nome.charAt(0).toUpperCase()}${fase.nome.slice(1)}`} resumo={fase.rega ?? undefined} inicialAberta>
        <Dado titulo="Rega" texto={fase.rega} />
        <Dado titulo="Adubação" texto={fase.adubacao} />
        <Dado titulo="Cuidados" texto={fase.intervencoes} confianca={fase.confianca} />
        <Paragrafo suave>Antes de regar, enfie o dedo 2 cm na terra: se estiver úmida, pode esperar.</Paragrafo>
      </Secao>
      {colheita && especie.pontoColheita && (
        <Secao titulo="Ponto de colheita" resumo={especie.pontoColheita.texto}>
          <Dado titulo="Quando colher" texto={especie.pontoColheita.texto} confianca={especie.pontoColheita.confianca} />
        </Secao>
      )}
      <Botao titulo="Ver ficha completa da espécie" variante="secundario" onPress={() => router.push({ pathname: '/planta/[id]', params: { id: especie.id } })} />

      <Subtitulo>Registrar</Subtitulo>
      <View style={{ gap: 8 }}>
        <Botao titulo="Adubei hoje" variante="secundario" carregando={ocupado === 'adubacao'} onPress={() => agir('adubacao', () => registrarAcao(plantio.id, 'adubacao', hoje))} />
        {colhendo ? (
          <Cartao>
            <Campo
              rotulo="Quanto colheu hoje? (opcional)"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="decimal-pad"
              placeholder="Ex.: 3"
              maxLength={8}
            />
            <Opcoes rotulo="Unidade" valor={unidade} onChange={setUnidade} opcoes={opcoesUnidade} />
            <Botao
              titulo="Registrar colheita"
              carregando={ocupado === 'colheita'}
              onPress={() =>
                agir(
                  'colheita',
                  async () => {
                    if (quantidade.trim() === '') return registrarAcao(plantio.id, 'colheita', hoje);
                    const v = novaColheita.safeParse({ quantidade: Number(quantidade.replace(',', '.')), unidade });
                    if (!v.success) throw new Error(v.error.issues[0]?.message ?? 'Confira a quantidade.');
                    return registrarColheita(plantio.id, hoje, v.data.quantidade, v.data.unidade);
                  },
                  () => {
                    setColhendo(false);
                    setQuantidade('');
                  },
                )
              }
            />
            <Botao titulo="Cancelar" variante="secundario" onPress={() => setColhendo(false)} />
          </Cartao>
        ) : (
          <Botao titulo="Colhi hoje" variante="secundario" onPress={() => setColhendo(true)} />
        )}
        <Botao titulo="Diário e fotos" onPress={() => router.push({ pathname: '/diario/[id]', params: { id: plantio.id } })} />
      </View>

      <Secao titulo="Histórico" resumo={historico.length ? `${historico.length} registros` : 'Nada registrado ainda'}>
        {historico.length === 0 ? (
          <Paragrafo suave>Nada registrado ainda.</Paragrafo>
        ) : (
          historico.slice(0, 30).map((r, i) => (
            <View key={`${r.data}-${r.tipo}-${i}`} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Texto style={{ fontSize: 15 }}>{NOME_ACAO[r.tipo] ?? r.tipo}</Texto>
              <Texto style={{ fontSize: 15, color: cores.textoSuave }}>{formatarData(r.data)}</Texto>
            </View>
          ))
        )}
      </Secao>

      <Secao titulo="Encerrar este plantio">
        <Botao
          titulo="Terminei de colher"
          variante="secundario"
          carregando={ocupado === 'colhido'}
          onPress={() => agir('colhido', () => encerrarPlantio(plantio.id, 'colhido'), () => router.replace('/horta'))}
        />
        <Botao
          titulo="A planta morreu"
          variante="perigo"
          carregando={ocupado === 'perdido'}
          onPress={() => agir('perdido', () => encerrarPlantio(plantio.id, 'perdido'), () => router.replace('/horta'))}
        />
      </Secao>
    </Tela>
  );
}
