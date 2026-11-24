import {
  faseAposGerminacao,
  faseAtual,
  formatarData,
  germinacaoConfirmada,
  janelaColheita,
  janelaGerminacao,
  proximaRega,
} from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Aviso, Botao, Cartao, Paragrafo, Subtitulo, Tela, Titulo, cores } from '../../components/ui';
import { confirmarFase, encerrarPlantio, registrarAcao } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';
import { NOME_ORIGEM } from '../../lib/rotulos';

const NOME_ACAO: Record<string, string> = {
  rega: 'Rega',
  adubacao: 'Adubação',
  poda: 'Poda',
  desbaste: 'Desbaste',
  tutoramento: 'Tutoramento',
  transplante: 'Transplante',
  colheita: 'Colheita',
};

export default function DetalhePlantio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, plantios, locais, hoje, previsaoHoje, recarregar } = useHorta();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const plantio = id ? plantios.get(id) : undefined;
  const especie = plantio ? ESPECIES.get(plantio.especieId) : undefined;
  const local = plantio ? locais.get(plantio.localId) : undefined;
  if (!plantio || !especie || !local) {
    return <Tela><Aviso>Esta planta não está mais na sua horta.</Aviso></Tela>;
  }

  const fase = faseAtual(plantio, especie, hoje);
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
      <Titulo>{plantio.apelido || especie.nomePopular}</Titulo>
      <Paragrafo suave>
        {especie.nomePopular} · {NOME_ORIGEM[plantio.origem]} · {local.nome} · plantada em {formatarData(plantio.dataPlantio)}
        {plantio.quantidade > 1 ? ` · ${plantio.quantidade} pés` : ''}
      </Paragrafo>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      <Cartao>
        <Text style={{ fontSize: 13, color: cores.textoSuave }}>Fase atual</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: cores.texto }}>{fase.nome}</Text>
        {fase.rega ? <Paragrafo>Rega: {fase.rega}</Paragrafo> : null}
        {fase.adubacao ? <Paragrafo>Adubação: {fase.adubacao}</Paragrafo> : null}
        {fase.intervencoes ? <Paragrafo>Cuidados: {fase.intervencoes}</Paragrafo> : null}
      </Cartao>

      <Cartao>
        <Text style={{ fontSize: 13, color: cores.textoSuave }}>Próxima rega</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: rega.atrasada ? cores.erro : cores.texto }}>
          {rega.devidaEm === hoje ? 'Hoje' : formatarData(rega.devidaEm)}
          {rega.atrasada ? ' (atrasada)' : ''}
        </Text>
        {rega.ajustes.map((a) => (
          <Paragrafo key={a} suave>
            {a}
          </Paragrafo>
        ))}
        <Paragrafo suave>Antes de regar, enfie o dedo 2 cm na terra: se estiver úmida, pode esperar.</Paragrafo>
        <Botao
          titulo={ultimaRega === hoje ? 'Já reguei hoje' : 'Reguei hoje'}
          desativado={ultimaRega === hoje}
          carregando={ocupado === 'rega'}
          onPress={() => agir('rega', () => registrarAcao(plantio.id, 'rega', hoje))}
        />
      </Cartao>

      {(germ || colheita) && (
        <Cartao>
          {germ && (
            <Paragrafo>
              Germinação esperada: {formatarData(germ.inicio)} a {formatarData(germ.fim)}
              {germinacaoConfirmada(plantio, especie) ? ' (confirmada)' : ''}
            </Paragrafo>
          )}
          {colheita && (
            <Paragrafo>
              Colheita começa entre {formatarData(colheita.inicio)} e {formatarData(colheita.fim)}
            </Paragrafo>
          )}
          {precisaConfirmar && (
            <Botao
              titulo="Germinou"
              variante="secundario"
              carregando={ocupado === 'germinou'}
              onPress={() => agir('germinou', () => confirmarFase(plantio.id, proximaFase.nome, hoje))}
            />
          )}
        </Cartao>
      )}

      <Subtitulo>Registrar</Subtitulo>
      <View style={{ gap: 8 }}>
        <Botao titulo="Adubei hoje" variante="secundario" carregando={ocupado === 'adubacao'} onPress={() => agir('adubacao', () => registrarAcao(plantio.id, 'adubacao', hoje))} />
        <Botao titulo="Colhi hoje" variante="secundario" carregando={ocupado === 'colheita'} onPress={() => agir('colheita', () => registrarAcao(plantio.id, 'colheita', hoje))} />
      </View>

      <Subtitulo>Histórico</Subtitulo>
      {historico.length === 0 ? (
        <Paragrafo suave>Nada registrado ainda.</Paragrafo>
      ) : (
        historico.slice(0, 30).map((r, i) => (
          <Paragrafo key={`${r.data}-${r.tipo}-${i}`}>
            {formatarData(r.data)} · {NOME_ACAO[r.tipo] ?? r.tipo}
          </Paragrafo>
        ))
      )}

      <Subtitulo>Encerrar</Subtitulo>
      <View style={{ gap: 8 }}>
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
      </View>
    </Tela>
  );
}
