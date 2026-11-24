import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { PlantaViva } from '../../components/planta-viva';
import { Aviso, BarraProgresso, Botao, Cartao, Carregando, Opcoes, Paragrafo, Subtitulo, Tela, Texto, Titulo, fontes, useCores } from '../../components/ui';
import { ESPECIES, useHorta } from '../../lib/horta';
import { NOME_TIPO_LOCAL } from '../../lib/rotulos';
import { resumirPlanta } from '../../lib/visual';

export default function MinhaHorta() {
  const { dados, carregando, erro, hoje, tarefas, locais } = useHorta();
  const c = useCores();
  const [filtro, setFiltro] = useState<string>('todos');
  if (carregando && !dados) return <Carregando />;
  if (!dados) return <Tela topo>{erro && <Aviso tipo="erro">{erro}</Aviso>}</Tela>;

  const visiveis = dados.plantios.filter((p) => filtro === 'todos' || p.localId === filtro);

  return (
    <Tela topo>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <Titulo>Minha horta</Titulo>
        <View style={{ minWidth: 120 }}>
          <Botao titulo="+ Plantar" onPress={() => router.push('/plantas')} />
        </View>
      </View>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}

      {dados.locais.length > 1 && dados.plantios.length > 0 && (
        <Opcoes
          rotulo="Local"
          opcoes={[{ valor: 'todos', texto: 'Todos' }, ...dados.locais.map((l) => ({ valor: l.id, texto: l.nome }))]}
          valor={filtro}
          onChange={setFiltro}
        />
      )}

      {dados.plantios.length === 0 && (
        <Paragrafo suave>
          {dados.locais.length === 0
            ? 'Cadastre onde você planta: um vaso, um canteiro, o quintal. Depois escolha as plantas.'
            : 'Nenhuma planta ainda. Toque em "+ Plantar" para começar.'}
        </Paragrafo>
      )}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {visiveis.map((p) => {
          const especie = ESPECIES.get(p.especieId);
          if (!especie) return null;
          const local = locais.get(p.localId);
          const r = resumirPlanta(p, especie, local, tarefas, hoje);
          return (
            <Pressable
              key={p.id}
              onPress={() => router.push({ pathname: '/plantio/[id]', params: { id: p.id } })}
              accessibilityRole="button"
              accessibilityLabel={`${r.nome}, ${r.selo.texto}`}
              style={({ pressed }) => ({
                flexGrow: 1,
                flexBasis: '45%',
                maxWidth: '50%',
                minWidth: 150,
                backgroundColor: c.cartao,
                borderWidth: 1,
                borderColor: c.borda,
                borderRadius: 20,
                padding: 10,
                gap: 6,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <View style={{ height: 140, borderRadius: 14, backgroundColor: c.superficie, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <PlantaViva especieId={p.especieId} nome={r.nome} estagio={r.visual.estagio} sede={r.sede} chao={r.chao} tamanho={150} />
              </View>
              <Texto style={{ fontSize: 15, fontWeight: '600' }} numberOfLines={1}>
                {r.nome}
                {p.quantidade > 1 ? ` (${p.quantidade})` : ''}
              </Texto>
              <Texto style={{ fontSize: 12, color: c.textoSuave }} numberOfLines={1}>
                Dia {r.visual.dia} · {local?.nome ?? 'Sem local'}
              </Texto>
              {r.visual.progresso !== null && <BarraProgresso valor={r.visual.progresso} alerta={r.sede} rotulo={`${r.nome}: caminho até a colheita`} />}
              <Texto style={{ fontSize: 12, fontWeight: '600', color: r.selo.alerta ? c.alerta : c.verde }}>{r.selo.texto}</Texto>
            </Pressable>
          );
        })}
      </View>

      <Subtitulo>Seus locais</Subtitulo>
      {dados.locais.map((local) => (
        <Cartao key={local.id} rotulo={`Local ${local.nome}`} onPress={() => router.push({ pathname: '/local/[id]', params: { id: local.id } })}>
          <Texto style={{ fontSize: 17, fontFamily: fontes.titulo }}>{local.nome}</Texto>
          <Paragrafo suave>
            {NOME_TIPO_LOCAL[local.tipo]}
            {local.volumeLitros ? `, ${local.volumeLitros} L` : ''}
            {local.interno ? ', dentro de casa' : ''}
            {local.horasSol != null ? `, ${String(local.horasSol).replace('.', ',')} h de sol` : ', sol não informado'}
          </Paragrafo>
        </Cartao>
      ))}
      <View style={{ gap: 8 }}>
        <Botao titulo="Novo local" variante="secundario" onPress={() => router.push('/local/novo')} />
        {dados.plantios.length > 0 && <Botao titulo="Calendário de colheitas" variante="secundario" onPress={() => router.push('/colheitas')} />}
      </View>
    </Tela>
  );
}
