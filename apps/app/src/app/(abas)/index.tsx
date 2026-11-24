import { CAUSAS_GERMINACAO, descreverTarefa, faseAposGerminacao, formatarData, tituloTarefa, type Tarefa } from '@cultivae/core';
import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { DestaquePlanta } from '../../components/destaque';
import { Aviso, Botao, Cartao, Carregando, Paragrafo, Subtitulo, Tela, Texto, Titulo, fontes, useCores } from '../../components/ui';
import { confirmarFase, encerrarPlantio, registrarAcao, registrarAcoes } from '../../lib/dados';
import { ESPECIES, useHorta } from '../../lib/horta';
import { resumirPlanta } from '../../lib/visual';

function saudacao(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

export default function Hoje() {
  const { dados, carregando, erro, hoje, previsaoHoje, tarefas, locais, plantios, recarregar } = useHorta();
  const c = useCores();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [falha, setFalha] = useState<string | null>(null);
  const [indice, setIndice] = useState(0);

  // Plantas para o destaque: com sede primeiro, depois as prontas para colher.
  const destaques = useMemo(() => {
    const lista = (dados?.plantios ?? []).flatMap((p) => {
      const especie = ESPECIES.get(p.especieId);
      if (!especie) return [];
      const local = locais.get(p.localId);
      return [{ plantio: p, local, resumo: resumirPlanta(p, especie, local, tarefas, hoje) }];
    });
    const peso = (r: (typeof lista)[number]) => (r.resumo.sede ? 0 : r.resumo.visual.estagio === 'colheita' ? 1 : 2);
    return lista.sort((a, b) => peso(a) - peso(b));
  }, [dados, locais, tarefas, hoje]);

  if (carregando && !dados) return <Carregando />;

  async function agir(chave: string, acao: () => Promise<unknown>) {
    setOcupado(chave);
    setFalha(null);
    try {
      await acao();
      await recarregar();
    } catch (e) {
      setFalha(e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.');
    } finally {
      setOcupado(null);
    }
  }

  // Agrupa por local, como o usuário anda pela casa (RF-2.2).
  const porLocal = new Map<string, Tarefa[]>();
  for (const t of tarefas) {
    const localId = plantios.get(t.plantioId)?.localId ?? '';
    porLocal.set(localId, [...(porLocal.get(localId) ?? []), t]);
  }

  const semPlantas = destaques.length === 0;
  const atual = destaques.length ? destaques[Math.min(indice, destaques.length - 1)]! : null;
  const total = destaques.length;
  const nome = dados?.perfil.nome?.split(' ')[0];

  return (
    <Tela topo>
      <View style={{ gap: 4 }}>
        <Texto style={{ fontSize: 14, color: c.textoSuave }}>
          {formatarData(hoje)}
          {previsaoHoje
            ? ` · ${previsaoHoje.chuvaMm.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mm de chuva, máx. ${Math.round(previsaoHoje.tempMaxC)} °C`
            : ''}
        </Texto>
        <Titulo>{nome ? `${saudacao()}, ${nome}` : saudacao()}</Titulo>
      </View>
      {erro && <Aviso tipo="erro">{erro}</Aviso>}
      {falha && <Aviso tipo="erro">{falha}</Aviso>}
      {!previsaoHoje && dados && dados.perfil.lat === null && (
        <Paragrafo suave>Escolha sua cidade na aba Conta para a rega se ajustar à chuva e ao calor.</Paragrafo>
      )}

      {atual && (
        <DestaquePlanta
          resumo={atual.resumo}
          especieId={atual.plantio.especieId}
          local={atual.local?.nome ?? 'Sem local'}
          indice={Math.min(indice, total - 1)}
          total={total}
          onAnterior={() => setIndice((i) => (Math.min(i, total - 1) + total - 1) % total)}
          onProxima={() => setIndice((i) => (Math.min(i, total - 1) + 1) % total)}
          onAbrir={() => router.push({ pathname: '/plantio/[id]', params: { id: atual.plantio.id } })}
        />
      )}

      {semPlantas ? (
        <Cartao>
          <Texto style={{ fontSize: 20, fontFamily: fontes.titulo }}>Sua horta ainda está vazia</Texto>
          <Paragrafo suave>Escolha uma planta na aba Plantas e toque em "Plantar esta".</Paragrafo>
          <Botao titulo="Ver plantas" onPress={() => router.push('/plantas')} />
        </Cartao>
      ) : tarefas.length === 0 ? (
        <Aviso tipo="ok">Nada para fazer hoje. Sua horta está em dia.</Aviso>
      ) : (
        <Subtitulo>Para fazer hoje</Subtitulo>
      )}

      {[...porLocal.entries()].map(([localId, lista]) => {
        const local = locais.get(localId);
        const regas = lista.filter((t) => t.tipo === 'rega');
        return (
          <View key={localId} style={{ gap: 8 }}>
            <Texto style={{ fontSize: 15, fontWeight: '600', color: c.textoSuave }}>{local?.nome ?? 'Sem local'}</Texto>
            {regas.length > 1 && (
              <Botao
                titulo={`Reguei tudo aqui (${regas.length})`}
                variante="secundario"
                carregando={ocupado === `local-${localId}`}
                onPress={() => agir(`local-${localId}`, () => registrarAcoes(regas.map((t) => t.plantioId), 'rega', hoje))}
              />
            )}
            {lista.map((t) => {
              const plantio = plantios.get(t.plantioId);
              const especie = plantio ? ESPECIES.get(plantio.especieId) : undefined;
              if (!plantio || !especie) return null;
              const chave = `${t.tipo}-${t.plantioId}`;
              const proxima = faseAposGerminacao(especie);
              return (
                <Cartao key={chave}>
                  <Texto style={{ fontSize: 13, fontWeight: '600', color: t.atrasada ? c.alerta : c.textoSuave }}>
                    {tituloTarefa(t.tipo)}
                    {t.atrasada ? ` · desde ${formatarData(t.devidaEm)}` : ''}
                  </Texto>
                  <Link href={{ pathname: '/plantio/[id]', params: { id: plantio.id } }}>
                    <Texto style={{ fontSize: 17, fontWeight: '600' }}>{descreverTarefa(t, especie, plantio.apelido)}</Texto>
                  </Link>
                  {t.ajustes.map((a) => (
                    <Paragrafo key={a} suave>
                      {a}
                    </Paragrafo>
                  ))}
                  {t.tipo === 'germinacao-atrasada' &&
                    CAUSAS_GERMINACAO.map((causa) => (
                      <Paragrafo key={causa} suave>
                        • {causa}
                      </Paragrafo>
                    ))}

                  <View style={{ gap: 8, marginTop: 8 }}>
                    {t.tipo === 'rega' && (
                      <Botao titulo="Reguei" carregando={ocupado === chave} onPress={() => agir(chave, () => registrarAcao(plantio.id, 'rega', hoje))} />
                    )}
                    {(t.tipo === 'verificar-germinacao' || t.tipo === 'germinacao-atrasada') && proxima && (
                      <Botao
                        titulo="Germinou"
                        carregando={ocupado === chave}
                        onPress={() => agir(chave, () => confirmarFase(plantio.id, proxima.nome, hoje))}
                      />
                    )}
                    {t.tipo === 'germinacao-atrasada' && (
                      <Botao
                        titulo="Não nasceu, encerrar"
                        variante="perigo"
                        carregando={ocupado === `${chave}-perdido`}
                        onPress={() => agir(`${chave}-perdido`, () => encerrarPlantio(plantio.id, 'perdido'))}
                      />
                    )}
                    {t.tipo === 'colheita' && (
                      <Botao titulo="Colhi" carregando={ocupado === chave} onPress={() => agir(chave, () => registrarAcao(plantio.id, 'colheita', hoje))} />
                    )}
                  </View>
                </Cartao>
              );
            })}
          </View>
        );
      })}
    </Tela>
  );
}
