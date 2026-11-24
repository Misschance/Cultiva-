import { faseAtual, formatarData, janelaColheita } from '@cultivae/core';
import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { Aviso, Botao, Cartao, Carregando, Paragrafo, Subtitulo, Tela, Titulo, cores } from '../../components/ui';
import { ESPECIES, useHorta } from '../../lib/horta';
import { NOME_TIPO_LOCAL } from '../../lib/rotulos';

export default function MinhaHorta() {
  const { dados, carregando, erro, hoje, tarefas } = useHorta();
  if (carregando && !dados) return <Carregando />;
  if (!dados) return <Tela>{erro && <Aviso tipo="erro">{erro}</Aviso>}</Tela>;

  const pendentes = new Set(tarefas.map((t) => t.plantioId));

  return (
    <Tela>
      <Titulo>Minha horta</Titulo>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      <View style={{ gap: 8 }}>
        <Botao titulo="Plantar" onPress={() => router.push('/plantas')} />
        <Botao titulo="Novo local" variante="secundario" onPress={() => router.push('/local/novo')} />
      </View>

      {dados.locais.length === 0 && (
        <Paragrafo suave>Cadastre onde você planta: um vaso, um canteiro, o quintal. Depois escolha as plantas.</Paragrafo>
      )}

      {dados.locais.map((local) => {
        const doLocal = dados.plantios.filter((p) => p.localId === local.id);
        return (
          <View key={local.id} style={{ gap: 8 }}>
            <Subtitulo>{local.nome}</Subtitulo>
            <Paragrafo suave>
              {NOME_TIPO_LOCAL[local.tipo]}
              {local.volumeLitros ? `, ${local.volumeLitros} L` : ''}
              {local.interno ? ', dentro de casa' : ''}
              {local.horasSol != null ? `, ${local.horasSol} h de sol` : ''}
            </Paragrafo>
            {doLocal.length === 0 && <Paragrafo suave>Nenhuma planta aqui ainda.</Paragrafo>}
            {doLocal.map((p) => {
              const especie = ESPECIES.get(p.especieId);
              if (!especie) return null;
              const fase = faseAtual(p, especie, hoje);
              const colheita = janelaColheita(p, especie);
              return (
                <Cartao
                  key={p.id}
                  rotulo={`${p.apelido || especie.nomePopular}, fase ${fase.nome}`}
                  onPress={() => router.push({ pathname: '/plantio/[id]', params: { id: p.id } })}
                >
                  <Text style={{ fontSize: 17, fontWeight: '600', color: cores.texto }}>
                    {p.apelido || especie.nomePopular}
                    {p.quantidade > 1 ? ` (${p.quantidade})` : ''}
                  </Text>
                  <Paragrafo suave>
                    Fase: {fase.nome} · plantada em {formatarData(p.dataPlantio)}
                  </Paragrafo>
                  {colheita && <Paragrafo suave>Colheita prevista a partir de {formatarData(colheita.inicio)}</Paragrafo>}
                  {pendentes.has(p.id) && <Text style={{ color: cores.alerta, fontSize: 14 }}>Tem tarefa hoje</Text>}
                </Cartao>
              );
            })}
          </View>
        );
      })}
    </Tela>
  );
}
