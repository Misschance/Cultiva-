import { formatarData, linhaDoTempo, NOME_UNIDADE, totalColhido, type EntradaDiario, type ItemLinhaDoTempo } from '@cultivae/core';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { Aviso, Botao, Campo, Cartao, Carregando, Opcoes, Paragrafo, Subtitulo, Tela, Titulo, cores } from '../../components/ui';
import { apagarEntrada, carregarDiario, criarEntrada, type Diario } from '../../lib/dados';
import { escolherFoto, type FotoPronta } from '../../lib/fotos';
import { ESPECIES, useHorta } from '../../lib/horta';
import { useSessao } from '../../lib/sessao';

const NOME_ACAO: Record<string, string> = {
  rega: 'Regou',
  adubacao: 'Adubou',
  poda: 'Podou',
  desbaste: 'Desbastou',
  tutoramento: 'Tutorou',
  transplante: 'Transplantou',
  colheita: 'Colheu',
};

type Vista = 'linha' | 'galeria';

export default function DiarioPlantio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sessao } = useSessao();
  const { dados, plantios, hoje } = useHorta();
  const plantio = id ? plantios.get(id) : undefined;
  const especie = plantio ? ESPECIES.get(plantio.especieId) : undefined;

  const [diario, setDiario] = useState<Diario | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>('linha');
  const [texto, setTexto] = useState('');
  const [foto, setFoto] = useState<FotoPronta | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    if (!id) return;
    try {
      setDiario(await carregarDiario(id));
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível abrir o diário.');
    }
  }, [id]);
  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  if (!plantio || !especie) return <Tela><Aviso>Esta planta não está mais na sua horta.</Aviso></Tela>;
  if (!diario && !erro) return <Carregando />;

  async function agir(chave: string, acao: () => Promise<void>) {
    setOcupado(chave);
    setErro(null);
    try {
      await acao();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Algo deu errado.');
    } finally {
      setOcupado(null);
    }
  }

  const registros = (dados?.registros ?? []).filter((r) => r.plantioId === plantio.id);
  const itens = diario ? linhaDoTempo(diario.entradas, diario.colheitas, registros) : [];
  const comFoto = (diario?.entradas ?? []).filter((e) => e.fotoCaminho && diario?.urls[e.fotoCaminho]);
  const total = diario ? totalColhido(diario.colheitas) : [];

  return (
    <Tela>
      <Titulo>Diário: {plantio.apelido || especie.nomePopular}</Titulo>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {total.length > 0 && (
        <Paragrafo>Colhido até agora: {total.map((t) => `${String(t.quantidade).replace('.', ',')} ${NOME_UNIDADE[t.unidade]}`).join(' · ')}</Paragrafo>
      )}

      <Cartao>
        <Campo
          rotulo={`Anotação de hoje (${formatarData(hoje)})`}
          value={texto}
          onChangeText={setTexto}
          placeholder="Ex.: Apareceram as primeiras folhas verdadeiras."
          multiline
          maxLength={2000}
        />
        {foto && <Image source={{ uri: foto.uri }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 8 }} resizeMode="cover" accessibilityLabel="Prévia da foto" />}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {Platform.OS !== 'web' && (
            <View style={{ flex: 1 }}>
              <Botao titulo="Tirar foto" variante="secundario" onPress={() => agir('foto', async () => setFoto((await escolherFoto('camera')) ?? foto))} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Botao
              titulo={foto ? 'Trocar foto' : 'Escolher foto'}
              variante="secundario"
              carregando={ocupado === 'foto'}
              onPress={() => agir('foto', async () => setFoto((await escolherFoto('galeria')) ?? foto))}
            />
          </View>
        </View>
        {foto && <Botao titulo="Tirar a foto da anotação" variante="secundario" onPress={() => setFoto(null)} />}
        <Paragrafo suave>A foto é guardada só para você, sem a localização de onde foi tirada.</Paragrafo>
        <Botao
          titulo="Salvar anotação"
          carregando={ocupado === 'salvar'}
          desativado={!texto.trim() && !foto}
          onPress={() =>
            agir('salvar', async () => {
              await criarEntrada(sessao!.user.id, plantio.id, hoje, texto, foto?.bytes ?? null);
              setTexto('');
              setFoto(null);
              await recarregar();
            })
          }
        />
      </Cartao>

      <Opcoes
        rotulo="Ver"
        valor={vista}
        onChange={setVista}
        opcoes={[
          { valor: 'linha', texto: 'Linha do tempo' },
          { valor: 'galeria', texto: `Fotos (${comFoto.length})` },
        ]}
      />

      {vista === 'galeria' ? (
        comFoto.length === 0 ? (
          <Paragrafo suave>Nenhuma foto ainda. Uma foto por semana já mostra bem a evolução.</Paragrafo>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[...comFoto].reverse().map((e) => (
              <View key={e.id} style={{ width: '48%', gap: 2 }}>
                <Image
                  source={{ uri: diario!.urls[e.fotoCaminho!] }}
                  style={{ width: '100%', aspectRatio: 1, borderRadius: 8, backgroundColor: cores.verdeClaro }}
                  accessibilityLabel={`Foto de ${formatarData(e.data)}`}
                />
                <Text style={{ fontSize: 13, color: cores.textoSuave }}>{formatarData(e.data)}</Text>
              </View>
            ))}
          </View>
        )
      ) : itens.length === 0 ? (
        <Paragrafo suave>Nada no diário ainda.</Paragrafo>
      ) : (
        itens.map((item, i) => (
          <ItemDiario
            key={chave(item, i)}
            item={item}
            urls={diario!.urls}
            apagando={ocupado === `apagar-${item.tipo === 'anotacao' ? item.entrada.id : ''}`}
            onApagar={(e) => agir(`apagar-${e.id}`, async () => {
              await apagarEntrada(e);
              await recarregar();
            })}
          />
        ))
      )}
    </Tela>
  );
}

function chave(item: ItemLinhaDoTempo, i: number): string {
  if (item.tipo === 'anotacao') return item.entrada.id;
  if (item.tipo === 'colheita') return item.colheita.id;
  return `${item.data}-${item.acao}-${i}`;
}

function ItemDiario({
  item,
  urls,
  apagando,
  onApagar,
}: {
  item: ItemLinhaDoTempo;
  urls: Record<string, string>;
  apagando: boolean;
  onApagar: (e: EntradaDiario) => void;
}) {
  const [confirmar, setConfirmar] = useState(false);
  const data = <Text style={{ fontSize: 13, color: cores.textoSuave }}>{formatarData(item.data)}</Text>;
  if (item.tipo === 'acao') {
    return (
      <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
        {data}
        <Text style={{ fontSize: 15, color: cores.texto }}>{NOME_ACAO[item.acao] ?? item.acao}</Text>
      </View>
    );
  }
  if (item.tipo === 'colheita') {
    const c = item.colheita;
    return (
      <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
        {data}
        <Text style={{ fontSize: 15, color: cores.verdeEscuro, fontWeight: '600' }}>
          Colheu {String(c.quantidade).replace('.', ',')} {NOME_UNIDADE[c.unidade]}
        </Text>
      </View>
    );
  }
  const e = item.entrada;
  const url = e.fotoCaminho ? urls[e.fotoCaminho] : undefined;
  return (
    <Cartao>
      {data}
      {url && <Image source={{ uri: url }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 8 }} accessibilityLabel={`Foto de ${formatarData(e.data)}`} />}
      {/* Texto puro: nada é interpretado como HTML (SEG-10). */}
      {e.texto ? <Paragrafo>{e.texto}</Paragrafo> : null}
      {confirmar ? (
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Botao titulo="Apagar mesmo" variante="perigo" carregando={apagando} onPress={() => onApagar(e)} />
          </View>
          <View style={{ flex: 1 }}>
            <Botao titulo="Cancelar" variante="secundario" onPress={() => setConfirmar(false)} />
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setConfirmar(true)} accessibilityRole="button" style={{ minHeight: 44, justifyContent: 'center' }}>
          <Text style={{ color: cores.erro, fontSize: 14 }}>Apagar anotação</Text>
        </Pressable>
      )}
    </Cartao>
  );
}
