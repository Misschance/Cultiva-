import { CATALOGO, avaliarLuz, especiesParaLocal, faseAtual, mensagemLuz } from '@cultivae/core';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { PerguntaSol } from '../../components/sol';
import { Aviso, Botao, Campo, Cartao, Paragrafo, Subtitulo, Tela, Titulo, cores } from '../../components/ui';
import { atualizarLocal, edicaoLocal } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';
import { NOME_TIPO_LOCAL } from '../../lib/rotulos';

export default function DetalheLocal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dados, locais, hoje, recarregar } = useHorta();
  const local = id ? locais.get(id) : undefined;

  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState('');
  const [horasSol, setHorasSol] = useState<number | null>(null);
  const [solInvalido, setSolInvalido] = useState(false);
  const [msg, setMsg] = useState<{ tipo: 'erro' | 'ok'; texto: string } | null>(null);
  const [salvando, setSalvando] = useState(false);
  const aoMudarSol = useCallback((h: number | null, invalido: boolean) => {
    setHorasSol(h);
    setSolInvalido(invalido);
  }, []);

  if (!local) return <Tela><Aviso>Este local não está mais na sua horta.</Aviso></Tela>;
  const doLocal = (dados?.plantios ?? []).filter((p) => p.localId === local.id);
  const sugestoes = especiesParaLocal(CATALOGO, local);
  const boas = sugestoes.filter((s) => s.avaliacao.situacao === 'adequada');
  const meiaSombra = sugestoes.filter((s) => s.avaliacao.situacao === 'aceita-meia-sombra');

  function comecarEdicao() {
    setNome(local!.nome);
    setHorasSol(local!.horasSol ?? null);
    setMsg(null);
    setEditando(true);
  }

  async function salvar() {
    setMsg(null);
    if (solInvalido) return setMsg({ tipo: 'erro', texto: 'Confira o horário do sol.' });
    const v = edicaoLocal.safeParse({ nome, horasSol });
    if (!v.success) return setMsg({ tipo: 'erro', texto: v.error.issues[0]?.message ?? 'Confira os dados.' });
    setSalvando(true);
    try {
      await atualizarLocal(local!.id, v.data);
      await recarregar();
      setEditando(false);
      setMsg({ tipo: 'ok', texto: 'Local salvo.' });
    } catch (e) {
      setMsg({ tipo: 'erro', texto: e instanceof Error ? e.message : 'Não foi possível salvar.' });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Tela>
      <Titulo>{local.nome}</Titulo>
      <Paragrafo suave>
        {NOME_TIPO_LOCAL[local.tipo]}
        {local.volumeLitros ? `, ${local.volumeLitros} L` : ''}
        {local.interno ? ', dentro de casa' : ''}
      </Paragrafo>
      {msg && <Aviso tipo={msg.tipo}>{msg.texto}</Aviso>}

      {editando ? (
        <Cartao>
          <Campo rotulo="Nome do local" value={nome} onChangeText={setNome} maxLength={60} />
          <PerguntaSol inicial={local.horasSol} onChange={aoMudarSol} />
          <Botao titulo="Salvar" onPress={salvar} carregando={salvando} />
          <Botao titulo="Cancelar" variante="secundario" onPress={() => setEditando(false)} />
        </Cartao>
      ) : (
        <Cartao>
          <Text style={{ fontSize: 13, color: cores.textoSuave }}>Sol direto</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: cores.texto }}>
            {local.horasSol != null ? `${String(local.horasSol).replace('.', ',')} h por dia` : 'Ainda não informado'}
          </Text>
          <Botao titulo={local.horasSol != null ? 'Editar local' : 'Informar o sol'} variante="secundario" onPress={comecarEdicao} />
        </Cartao>
      )}

      <Subtitulo>Plantas aqui</Subtitulo>
      {doLocal.length === 0 && <Paragrafo suave>Nenhuma planta aqui ainda.</Paragrafo>}
      {doLocal.map((p) => {
        const especie = ESPECIES.get(p.especieId);
        if (!especie) return null;
        const aviso = mensagemLuz(especie, local.nome, avaliarLuz(especie, local));
        return (
          <Cartao key={p.id} rotulo={p.apelido || especie.nomePopular} onPress={() => router.push({ pathname: '/plantio/[id]', params: { id: p.id } })}>
            <Text style={{ fontSize: 17, fontWeight: '600', color: cores.texto }}>{p.apelido || especie.nomePopular}</Text>
            <Paragrafo suave>Fase: {faseAtual(p, especie, hoje).nome}</Paragrafo>
            {aviso && <Text style={{ color: cores.alerta, fontSize: 14 }}>{aviso}</Text>}
          </Cartao>
        );
      })}

      <Subtitulo>O que plantar aqui</Subtitulo>
      {local.horasSol == null ? (
        <Paragrafo suave>Informe as horas de sol do local para ver o que combina com ele.</Paragrafo>
      ) : (
        <>
          {boas.length > 0 && <Paragrafo>Têm o sol que pedem: {boas.map((s) => s.especie.nomePopular).join(', ')}.</Paragrafo>}
          {meiaSombra.length > 0 && (
            <Paragrafo>Aceitam meia-sombra: {meiaSombra.map((s) => s.especie.nomePopular).join(', ')}.</Paragrafo>
          )}
          {boas.length === 0 && meiaSombra.length === 0 && (
            <Paragrafo suave>Nenhuma planta da base tem sol suficiente aqui.</Paragrafo>
          )}
          <Botao
            titulo="Ver na lista de plantas"
            variante="secundario"
            onPress={() => router.push({ pathname: '/plantas', params: { local: local.id } })}
          />
        </>
      )}
    </Tela>
  );
}
